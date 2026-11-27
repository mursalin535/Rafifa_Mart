const express = require('express');
const router = express.Router();
const passport = require('../DataBase/Passport');
const Auth_controller = require('../controller/Auth_controller');
const { loginLimiter, sendOtpLimiter, verifyOtpLimiter } = require('../rateLimiters');

router.post('/send-otp', sendOtpLimiter, Auth_controller.SendOtp);
router.post('/verify-otp', verifyOtpLimiter, Auth_controller.VerifyOtp);
router.post('/login', loginLimiter, Auth_controller.Login);
router.post('/logout', Auth_controller.Logout);
router.get('/me', Auth_controller.GetCurrentUser);

// Google login শুরু করার route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google login শেষে ফিরে আসার route
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login-failed`,
    session: false, // আমরা নিজেরাই session সেট করছি, Passport-এর default session না
  }),
  (req, res) => {
    const failedUrl = `${process.env.FRONTEND_URL}/login-failed`;
    const customer = req.user;

    // blocked account ঢুকতে পারবে না
    if (!customer || customer.account_status !== 'active') {
      return res.redirect(failedUrl);
    }

    // login-এর সময় নতুন session id (session fixation ঠেকাতে)
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regenerate error:', err);
        return res.redirect(failedUrl);
      }
      req.session.customerId = customer.id;
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.redirect(failedUrl);
        }
        res.redirect(process.env.FRONTEND_URL);
      });
    });
  }
);

module.exports = router;