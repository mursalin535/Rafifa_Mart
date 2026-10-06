const express = require('express');
const router = express.Router();
const passport = require('../DataBase/Passport');
const Auth_controller = require('../controller/Auth_controller');

router.post('/signup', Auth_controller.Signup);
router.post('/send-otp', Auth_controller.SendOtp);
router.post('/verify-otp', Auth_controller.VerifyOtp);
router.post('/login', Auth_controller.Login);
router.post('/logout', Auth_controller.Logout);
router.get('/me', Auth_controller.GetCurrentUser);

// --- নতুন: Google login শুরু করার route ---
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// --- নতুন: Google login শেষে ফিরে আসার route ---
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login-failed`,
    session: false, // আমরা নিজেরাই session সেট করব নিচে, Passport-এর default session ব্যবহার করব না
  }),
  (req, res) => {
    // এতক্ষণে req.user-এ Google Strategy থেকে ফেরত আসা customer object আছে
    req.session.customerId = req.user.id;
    res.redirect(process.env.FRONTEND_URL);
  }
);

module.exports = router;