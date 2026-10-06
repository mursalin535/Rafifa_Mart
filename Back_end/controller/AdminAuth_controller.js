const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rollbar = require('../rollbar');
const { sendOtpEmail } = require('../services/email');
const {
  findAdminByEmail,
  findAdminById,
  findAllAdmins,
  updateAdminPassword,
  deleteAdminById,
  createAdmin,
} = require('../model/Admin_model');

// In-memory OTP store for admin signup
const adminOtpStore = new Map();
const OTP_EXPIRY_MS = 60 * 1000;

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)
  );
}

// POST /admin/login
async function AdminLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }
    req.session.adminId = admin.id;
    res.json({ success: true, admin: { id: admin.id, email: admin.admin_email } });
  } catch (err) {
    console.error('AdminLogin error:', err);
    rollbar.error('AdminLogin error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

// GET /admin/me
async function AdminMe(req, res) {
  try {
    if (!req.session.adminId) {
      return res.status(200).json({ admin: null });
    }
    const admin = await findAdminById(req.session.adminId);
    if (!admin) {
      return res.status(200).json({ admin: null });
    }
    res.json({ admin: { id: admin.id, email: admin.admin_email } });
  } catch (err) {
    console.error('AdminMe error:', err);
    rollbar.error('AdminMe error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

// POST /admin/logout
async function AdminLogout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('AdminLogout error:', err);
      rollbar.error('AdminLogout error:', err);
      return res.status(500).json({ error: 'Could not log out.' });
    }
    res.clearCookie('rafifa_session');
    res.json({ success: true });
  });
}

// GET /admin/all
async function GetAllAdmins(req, res) {
  try {
    const admins = await findAllAdmins();
    res.json({ success: true, admins });
  } catch (err) {
    console.error('GetAllAdmins error:', err);
    rollbar.error('GetAllAdmins error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

// PUT /admin/change-password
async function ChangeAdminPassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required.' });
    }
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        error: 'New password must include uppercase, lowercase, digit, and special character.',
      });
    }
    const admin = await findAdminById(req.session.adminId);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    const fullAdmin = await findAdminByEmail(admin.admin_email);
    const match = await bcrypt.compare(oldPassword, fullAdmin.password);
    if (!match) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await updateAdminPassword(admin.id, hash);
    res.json({ success: true, message: 'Password updated.' });
  } catch (err) {
    console.error('ChangeAdminPassword error:', err);
    rollbar.error('ChangeAdminPassword error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

// DELETE /admin/:id
async function DeleteAdmin(req, res) {
  try {
    const targetId = Number(req.params.id);
    if (req.session.adminId === targetId) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }
    await deleteAdminById(targetId);
    res.json({ success: true, message: 'Admin deleted.' });
  } catch (err) {
    console.error('DeleteAdmin error:', err);
    rollbar.error('DeleteAdmin error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

// POST /admin/send-otp — send OTP to add new admin
async function AdminSendOtp(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        error: 'Password must include uppercase, lowercase, digit, and special character.',
      });
    }
    const existing = await findAdminByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An admin with this email already exists.' });
    }
    const otp = generateOtp();
    adminOtpStore.set(email.toLowerCase(), {
      otp,
      email: email.toLowerCase(),
      password,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
    });
    await sendOtpEmail({ to: email, name: 'Admin', otp });
    res.status(200).json({ success: true, message: 'Verification code sent.' });
  } catch (err) {
    console.error('AdminSendOtp error:', err);
    rollbar.error('AdminSendOtp error:', err);
    res.status(500).json({ error: 'Failed to send code.' });
  }
}

// POST /admin/verify-otp — verify OTP and create admin
async function AdminVerifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and code are required.' });
    }
    const record = adminOtpStore.get(email.toLowerCase());
    if (!record) {
      return res.status(400).json({ error: 'No verification code found. Request a new one.' });
    }
    if (Date.now() > record.expiresAt) {
      adminOtpStore.delete(email.toLowerCase());
      return res.status(400).json({ error: 'Code expired. Request a new one.' });
    }
    if (record.otp !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid code. Try again.' });
    }
    const hash = await bcrypt.hash(record.password, 10);
    const admin = await createAdmin(record.email, hash);
    adminOtpStore.delete(email.toLowerCase());
    res.status(201).json({ success: true, admin: { id: admin.id, email: admin.admin_email } });
  } catch (err) {
    console.error('AdminVerifyOtp error:', err);
    rollbar.error('AdminVerifyOtp error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

module.exports = {
  AdminLogin,
  AdminMe,
  AdminLogout,
  GetAllAdmins,
  ChangeAdminPassword,
  DeleteAdmin,
  AdminSendOtp,
  AdminVerifyOtp,
};
