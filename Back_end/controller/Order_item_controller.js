const Order_item_model = require('../model/Order_item_model');
const Order_model = require('../model/Order_model');
const rollbar = require('../rollbar');

function parseId(value) {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
}

function logError(err) {
    console.error("error occured in order item controller:", err);
    rollbar.error("error occured in order item controller:", err);
}

const Order_item_controller = {
    GetItemsByOrder: async (req, res) => {
        const orderId = parseId(req.params.order_id);
        if (!orderId) {
            return res.status(400).json({ success: false, message: "Invalid order id" });
        }

        const itemModel = new Order_item_model();
        const orderModel = new Order_model();

        try {
            const order = await orderModel.Get_order_by_id(orderId);
            // admin সব দেখতে পারে; customer শুধু নিজের order-এর item
            if (!order || (!req.isAdmin && Number(order.customer_id) !== Number(req.customerId))) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            const data = await itemModel.Get_items_by_order(orderId);
            res.status(200).json({ data, success: true });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to fetch items" });
        }
    },

    UpdateItem: async (req, res) => {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid item id" });
        }

        const { quantity, unit_price } = req.body || {};
        const itemModel = new Order_item_model();

        try {
            const existing = await itemModel.Get_item_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Item not found" });
            }

            const fields = {};
            if (quantity !== undefined) fields.quantity = quantity;
            if (unit_price !== undefined) fields.unit_price = unit_price;

            if (Object.keys(fields).length === 0) {
                return res.status(400).json({ success: false, message: "No fields to update" });
            }

            await itemModel.Update_item(id, fields);
            const updated = await itemModel.Get_item_by_id(id);
            res.status(200).json({ data: updated, success: true, message: "Item updated" });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to update item" });
        }
    },

    DeleteItem: async (req, res) => {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid item id" });
        }

        const itemModel = new Order_item_model();

        try {
            const existing = await itemModel.Get_item_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Item not found" });
            }

            await itemModel.Delete_item(id);
            res.status(200).json({ success: true, message: "Item deleted" });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to delete item" });
        }
    }
}

module.exports = Order_item_controller;