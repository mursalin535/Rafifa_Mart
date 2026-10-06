const express = require('express');
const router = express.Router();
const Customer_controller = require('../controller/Customer_controller');
const requireAdmin = require('../requireAdmin');

router.get('/customers', requireAdmin, Customer_controller.GetAllCustomers);
router.get('/customer/:id', Customer_controller.GetCustomerById);
router.get('/customer/email/:email', Customer_controller.GetCustomerByEmail);
router.get('/customer/google/:google_id', Customer_controller.GetCustomerByGoogleId);
router.post('/customer/create', Customer_controller.CreateCustomerWithPassword);
router.post('/customer/create/google', Customer_controller.CreateCustomerWithGoogle);
router.put('/customer/:id/link-google', Customer_controller.LinkGoogleId);
router.put('/customer/:id/phone', Customer_controller.UpdateCustomerPhone);

module.exports = router;
