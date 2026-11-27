const express = require('express');
const router = express.Router();
const Customer_controller = require('../controller/Customer_controller');
const requireAdmin = require('../requireAdmin');
const requireAuth = require('../requireAuth');

router.get('/customers', requireAdmin, Customer_controller.GetAllCustomers);
router.get('/customer/:id', requireAdmin, Customer_controller.GetCustomerById);
router.put('/customer/phone', requireAuth, Customer_controller.UpdateMyPhone);
router.put('/customer/:id/status', requireAdmin, Customer_controller.UpdateCustomerStatus);

module.exports = router;