const express = require('express');
const router = express.Router();
const Order_item_controller = require('../controller/Order_item_controller');
const requireAdmin = require('../requireAdmin');

router.post('/add_order_item', Order_item_controller.AddItem);
router.get('/order_items/:order_id', Order_item_controller.GetItemsByOrder);
router.put('/update_order_item/:id', requireAdmin, Order_item_controller.UpdateItem);
router.delete('/delete_order_item/:id', requireAdmin, Order_item_controller.DeleteItem);

module.exports = router;
