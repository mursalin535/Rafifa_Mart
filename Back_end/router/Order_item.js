const express = require('express');
const router = express.Router();
const Order_item_controller = require('../controller/Order_item_controller');
const requireAdmin = require('../requireAdmin');
const requireCustomerOrAdmin = require('../requireCustomerOrAdmin');

router.get('/order_items/:order_id', requireCustomerOrAdmin, Order_item_controller.GetItemsByOrder);
router.put('/update_order_item/:id', requireAdmin, Order_item_controller.UpdateItem);
router.delete('/delete_order_item/:id', requireAdmin, Order_item_controller.DeleteItem);

module.exports = router;