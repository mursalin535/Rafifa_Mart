const express = require('express');
const router = express.Router();
const AdminAuth_controller = require('../controller/AdminAuth_controller');
const requireAdmin = require('../requireAdmin');

router.post('/admin/login', AdminAuth_controller.AdminLogin);
router.get('/admin/me', AdminAuth_controller.AdminMe);
router.post('/admin/logout', requireAdmin, AdminAuth_controller.AdminLogout);
router.get('/admin/all', requireAdmin, AdminAuth_controller.GetAllAdmins);
router.put('/admin/change-password', requireAdmin, AdminAuth_controller.ChangeAdminPassword);
router.delete('/admin/:id', requireAdmin, AdminAuth_controller.DeleteAdmin);
router.post('/admin/send-otp', requireAdmin, AdminAuth_controller.AdminSendOtp);
router.post('/admin/verify-otp', requireAdmin, AdminAuth_controller.AdminVerifyOtp);

module.exports = router;
