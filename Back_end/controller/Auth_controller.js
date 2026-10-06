const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rollbar = require('../rollbar');
const { sendOtpEmail } = require('../services/email');
const {
  findCustomerByEmail,
  findCustomerById,
  createCustomerWithPassword,
} = require('../model/Customer_model');

// In-memory OTP store: key = email, value = { otp, name, password, phone, expiresAt }
const otpStore = new Map();

const OTP_EXPIRY_MS = 60 * 1000; // 1 minute

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

// Step 1: User submits form → validate + check duplicate → send OTP
async function SendOtp(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    // Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters.' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Validate password
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

    // Check if email already exists
    const existing = await findCustomerByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    // Store OTP + user data in memory
    otpStore.set(email.toLowerCase(), {
      otp,
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      phone: phone || null,
      expiresAt,
    });

    // Send email
    await sendOtpEmail({ to: email, name: name.trim(), otp });

    res.status(200).json({ success: true, message: 'Verification code sent to your email.' });
  } catch (err) {
    console.error('SendOtp error:', err);
    rollbar.error('SendOtp error:', err);
    res.status(500).json({ error: 'Failed to send verification code. Please try again.' });
  }
}

// Step 2: User enters OTP → verify → create customer
async function VerifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }

    const record = otpStore.get(email.toLowerCase());

    // Check if OTP exists
    if (!record) {
      return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
    }

    // Check if expired
    if (Date.now() > record.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Check if OTP matches
    if (record.otp !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid verification code. Please try again.' });
    }

    // OTP is valid — create the customer
    const hashedPassword = await bcrypt.hash(record.password, 10);
    const customer = await createCustomerWithPassword({
      name: record.name,
      email: record.email,
      hashedPassword,
      phone: record.phone,
    });

    // Clean up OTP
    otpStore.delete(email.toLowerCase());

    // Set session
    req.session.customerId = customer.id;

    res.status(201).json({
      success: true,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        profile_pic: customer.profile_pic,
        created_at: customer.created_at,
      },
    });
  } catch (err) {
    console.error('VerifyOtp error:', err);
    rollbar.error('VerifyOtp error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

async function Signup(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await findCustomerByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await createCustomerWithPassword({ name, email, hashedPassword, phone });

    req.session.customerId = customer.id;

    res.status(201).json({
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        profile_pic: customer.profile_pic,
        created_at: customer.created_at,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    rollbar.error('Signup error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    const customer = await findCustomerByEmail(email);

    if (!customer || !customer.password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, customer.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    req.session.customerId = customer.id;

    res.json({
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        profile_pic: customer.profile_pic,
        created_at: customer.created_at,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    rollbar.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

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

async function GetCurrentUser(req, res) {
  try {
    if (!req.session.customerId) {
      return res.status(200).json({ user: null });
    }

    const customer = await findCustomerById(req.session.customerId);

    if (!customer) {
      return res.status(200).json({ user: null });
    }

    res.json({
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        profile_pic: customer.profile_pic,
        created_at: customer.created_at,
      },
    });
  } catch (err) {
    console.error('GetCurrentUser error:', err);
    rollbar.error('GetCurrentUser error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

module.exports = { SendOtp, VerifyOtp, Signup, Login, Logout, GetCurrentUser };