const Order_item_model = require('../model/Order_item_model');
const Product_model = require('../model/Product_model');
const rollbar = require('../rollbar');

const Order_item_controller = {
    AddItem: async (req, res) => {
        const { order_id, variant_id, quantity, unit_price } = req.body;
        const itemModel = new Order_item_model();
        const productModel = new Product_model();

        try {
            if (!order_id || !variant_id || !quantity || quantity <= 0) {
                return res.status(400).json({ success: false, message: "order_id, variant_id, and valid quantity are required" });
            }

            const variant = await productModel.Get_variant_by_id(variant_id);
            if (!variant) {
                return res.status(404).json({ success: false, message: "Variant not found" });
            }

            const data = await itemModel.Add_item({ order_id, variant_id, quantity, unit_price });
            res.status(200).json({ data, success: true, message: "Item added to order" });
        } catch (err) {
            console.error("error occured in order item controller:", err);
            rollbar.error("error occured in order item controller:", err);
            res.status(500).json({ success: false, message: "Failed to add item" });
        }
    },

    GetItemsByOrder: async (req, res) => {
        const { order_id } = req.params;
        const itemModel = new Order_item_model();

        try {
            const data = await itemModel.Get_items_by_order(Number(order_id));
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in order item controller:", err);
            rollbar.error("error occured in order item controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch items" });
        }
    },

    UpdateItem: async (req, res) => {
        const { id } = req.params;
        const { quantity, unit_price } = req.body;
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
            console.error("error occured in order item controller:", err);
            rollbar.error("error occured in order item controller:", err);
            res.status(500).json({ success: false, message: "Failed to update item" });
        }
    },

    DeleteItem: async (req, res) => {
        const { id } = req.params;
        const itemModel = new Order_item_model();

        try {
            const existing = await itemModel.Get_item_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Item not found" });
            }

            await itemModel.Delete_item(id);
            res.status(200).json({ success: true, message: "Item deleted" });
        } catch (err) {
            console.error("error occured in order item controller:", err);
            rollbar.error("error occured in order item controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete item" });
        }
    }
}

module.exports = Order_item_controller;
