const express = require('express');
const router = express.Router();
const Order_controller = require('../controller/Order_controller');
const requireAdmin = require('../requireAdmin');
const requireAuth = require('../requireAuth');
const requireCustomerOrAdmin = require('../requireCustomerOrAdmin');

router.post('/add_order', requireAuth, Order_controller.CreateOrder);
router.post('/add_bottle_order', requireAuth, Order_controller.CreateBottleOrder);
router.get('/orders', requireAdmin, Order_controller.GetAllOrders);
router.get('/orders/customer/:customer_id', requireAuth, Order_controller.GetOrdersByCustomer);
router.get('/order/:id', requireCustomerOrAdmin, Order_controller.GetOrderById);
router.put('/update_order_status/:id', requireAdmin, Order_controller.UpdateOrderStatus);
router.delete('/delete_order/:id', requireAdmin, Order_controller.DeleteOrder);

module.exports = router;