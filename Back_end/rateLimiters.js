const rateLimit = require('express-rate-limit');

function makeLimiter({ windowMs, max, message, skipSuccessfulRequests = false }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests, // true হলে শুধু ব্যর্থ (status >= 400) request গোনা হয়
    handler: (req, res) => {
      res.status(429).json({ success: false, error: message, message });
    },
  });
}

const MIN = 60 * 1000;
const HOUR = 60 * MIN;

// Customer login: ১৫ মিনিটে সর্বোচ্চ ১০টি ব্যর্থ চেষ্টা (IP প্রতি)
const loginLimiter = makeLimiter({
  windowMs: 15 * MIN,
  max: 10,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

// Admin login: আরও কড়া, ১৫ মিনিটে ৫টি ব্যর্থ চেষ্টা
const adminLoginLimiter = makeLimiter({
  windowMs: 15 * MIN,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many admin login attempts. Please try again in 15 minutes.',
});

// Signup OTP পাঠানো: ঘণ্টায় ৫টি (email spam ঠেকাতে)
const sendOtpLimiter = makeLimiter({
  windowMs: HOUR,
  max: 5,
  message: 'Too many verification code requests. Please try again later.',
});

// Signup OTP যাচাই: ১৫ মিনিটে ২০টি
const verifyOtpLimiter = makeLimiter({
  windowMs: 15 * MIN,
  max: 20,
  message: 'Too many verification attempts. Please try again later.',
});

// Admin OTP (পাসওয়ার্ড বদল ইত্যাদি)
const adminSendOtpLimiter = makeLimiter({
  windowMs: HOUR,
  max: 5,
  message: 'Too many verification code requests. Please try again later.',
});

const adminVerifyOtpLimiter = makeLimiter({
  windowMs: 15 * MIN,
  max: 20,
  message: 'Too many verification attempts. Please try again later.',
});

module.exports = {
  loginLimiter,
  adminLoginLimiter,
  sendOtpLimiter,
  verifyOtpLimiter,
  adminSendOtpLimiter,
  adminVerifyOtpLimiter,
};