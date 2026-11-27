const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rollbar = require('../rollbar');
const { sendOtpEmail } = require('../services/email');
const {
  findCustomerByEmail,
  findCustomerById,
  createCustomerWithPassword,
} = require('../model/Customer_model');

// In-memory OTP store:
// key = email, value = { otp, name, email, passwordHash, phone, expiresAt, sentAt, attempts }
const otpStore = new Map();

const OTP_EXPIRY_MS = 60 * 1000; // 1 minute
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_OTP_ATTEMPTS = 5;
const MAX_PENDING_OTPS = 5000;
const MAX_PASSWORD_BYTES = 72; // bcrypt-এর limit
const MAX_LOGIN_PASSWORD_BYTES = 1024;
const PHONE_RE = /^01[3-9][0-9]{8}$/;

// মেয়াদ শেষ হওয়া OTP প্রতি মিনিটে মুছে ফেলে
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of otpStore) {
    if (now > record.expiresAt) otpStore.delete(key);
  }
}, 60 * 1000).unref();

// ---------- helpers ----------

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

function isString(v) {
  return typeof v === 'string';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function validatePassword(password) {
  const checks = {
    minLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };
  const allPassed = Object.values(checks).every(Boolean);
  return { checks, allPassed };
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()));
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve()));
  });
}

// login-এর সময় নতুন session id (session fixation ঠেকাতে) + customerId সেট
async function startCustomerSession(req, customerId) {
  await regenerateSession(req);
  req.session.customerId = customerId;
  await saveSession(req);
}

function publicUser(customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    profile_pic: customer.profile_pic,
    created_at: customer.created_at,
  };
}

// ---------- Step 1: form submit → validate + duplicate check → send OTP ----------

async function SendOtp(req, res) {
  let storeKey = null;
  try {
    const { name, email, password, phone } = req.body || {};

    // সব required field string হতে হবে
    if (!isString(name) || !isString(email) || !isString(password) || !name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (phone !== undefined && phone !== null && !isString(phone)) {
      return res.status(400).json({ error: 'Invalid phone number.' });
    }

    // name
    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters.' });
    }

    // email
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.length > 254 || !isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // phone (optional): space/dash বাদ দিয়ে validate
    let cleanPhone = null;
    if (isString(phone) && phone.trim() !== '') {
      cleanPhone = phone.replace(/[\s-]/g, '');
      if (!PHONE_RE.test(cleanPhone)) {
        return res.status(400).json({ error: 'Phone number must be 11 digits and start with 01 (e.g. 017XXXXXXXX).' });
      }
    }

    // password
    if (Buffer.byteLength(password) > MAX_PASSWORD_BYTES) {
      return res.status(400).json({ error: 'Password is too long (max 72 characters).' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const { checks, allPassed } = validatePassword(password);
    if (!allPassed) {
      const missing = [];
      if (!checks.hasUppercase) missing.push('an uppercase letter');
      if (!checks.hasLowercase) missing.push('a lowercase letter');
      if (!checks.hasDigit) missing.push('a digit');
      if (!checks.hasSpecial) missing.push('a special character');
      return res.status(400).json({ error: `Password must include ${missing.join(', ')}.` });
    }

    // duplicate email
    const existing = await findCustomerByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // resend cooldown + store cap
    const previous = otpStore.get(cleanEmail);
    if (previous && Date.now() - previous.sentAt < RESEND_COOLDOWN_MS) {
      return res.status(429).json({ error: 'Please wait a few seconds before requesting another code.' });
    }
    if (!previous && otpStore.size >= MAX_PENDING_OTPS) {
      return res.status(503).json({ error: 'Too many pending requests. Please try again later.' });
    }

    // plaintext password memory-তে রাখা হবে না, আগেই hash
    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const now = Date.now();

    storeKey = cleanEmail;
    otpStore.set(cleanEmail, {
      otp,
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      phone: cleanPhone,
      expiresAt: now + OTP_EXPIRY_MS,
      sentAt: now,
      attempts: 0,
    });

    // email-এর HTML-এ name escape করে পাঠানো হচ্ছে
    await sendOtpEmail({ to: cleanEmail, name: escapeHtml(cleanName), otp });

    res.status(200).json({ success: true, message: 'Verification code sent to your email.' });
  } catch (err) {
    // email পাঠাতে ব্যর্থ হলে record মুছে দিই
    if (storeKey) otpStore.delete(storeKey);
    console.error('SendOtp error:', err);
    rollbar.error('SendOtp error:', err);
    res.status(500).json({ error: 'Failed to send verification code. Please try again.' });
  }
}

// ---------- Step 2: OTP verify → customer তৈরি → login ----------

async function VerifyOtp(req, res) {
  try {
    const { email, otp } = req.body || {};

    if (!isString(email) || !isString(otp) || !email || !otp) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }

    const key = email.trim().toLowerCase();
    const record = otpStore.get(key);

    if (!record) {
      return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // OTP মিলছে কি না (timing-safe) + attempt limit
    if (!safeEqual(record.otp, otp.trim())) {
      record.attempts += 1;
      if (record.attempts >= MAX_OTP_ATTEMPTS) {
        otpStore.delete(key);
        return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new code.' });
      }
      return res.status(400).json({ error: 'Invalid verification code. Please try again.' });
    }

    // OTP ঠিক, customer তৈরি (password আগেই hash করা)
    let customer;
    try {
      customer = await createCustomerWithPassword({
        name: record.name,
        email: record.email,
        hashedPassword: record.passwordHash,
        phone: record.phone,
      });
    } catch (dbErr) {
      if (dbErr && dbErr.code === 'ER_DUP_ENTRY') {
        otpStore.delete(key);
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      throw dbErr;
    }

    otpStore.delete(key);

    await startCustomerSession(req, customer.id);

    res.status(201).json({ success: true, user: publicUser(customer) });
  } catch (err) {
    console.error('VerifyOtp error:', err);
    rollbar.error('VerifyOtp error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

// ---------- Login ----------

async function Login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!isString(email) || !isString(password) || !email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (Buffer.byteLength(password) > MAX_LOGIN_PASSWORD_BYTES) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.length > 254) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const customer = await findCustomerByEmail(cleanEmail);

    if (!customer || !customer.password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, customer.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // password ঠিক হওয়ার পরেই account status দেখি
    if (customer.account_status !== 'active') {
      return res.status(403).json({ error: 'This account is not active. Please contact support.' });
    }

    await startCustomerSession(req, customer.id);

    res.json({ user: publicUser(customer) });
  } catch (err) {
    console.error('Login error:', err);
    rollbar.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

// ---------- Logout ----------

async function Logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      rollbar.error('Logout error:', err);
      return res.status(500).json({ error: 'Could not log out.' });
    }
    res.clearCookie('rafifa_session');
    res.json({ success: true });
  });
}

// ---------- Current user ----------

async function GetCurrentUser(req, res) {
  try {
    if (!req.session.customerId) {
      return res.status(200).json({ user: null });
    }

    const customer = await findCustomerById(req.session.customerId);

    // customer নেই বা blocked হলে logged-out হিসেবে দেখাই
    if (!customer || customer.account_status !== 'active') {
      return res.status(200).json({ user: null });
    }

    res.json({ user: publicUser(customer) });
  } catch (err) {
    console.error('GetCurrentUser error:', err);
    rollbar.error('GetCurrentUser error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

module.exports = { SendOtp, VerifyOtp, Login, Logout, GetCurrentUser };