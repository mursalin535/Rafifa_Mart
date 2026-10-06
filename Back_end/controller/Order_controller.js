const Order_model = require('../model/Order_model');
const Product_model = require('../model/Product_model');
const Bottle_model = require('../model/Bottle_model');
const Address_model = require('../model/Address_model');
const rollbar = require('../rollbar');

const Order_controller = {
    CreateOrder: async (req, res) => {
        const { customer_id, address_id, payment_method, items } = req.body;

        if (!customer_id || !address_id || !payment_method || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "customer_id, address_id, payment_method, and items are required" });
        }

        if (!['cod', 'online'].includes(payment_method)) {
            return res.status(400).json({ success: false, message: "payment_method must be 'cod' or 'online'" });
        }

        const orderModel = new Order_model();
        const productModel = new Product_model();
        const addressModel = new Address_model();

        try {
            const address = await addressModel.Get_address_by_id(address_id);
            if (!address) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }
            if (address.customer_id !== Number(customer_id)) {
                return res.status(403).json({ success: false, message: "This address does not belong to the given customer" });
            }

            let total_amount = 0;
            const validatedItems = [];

            for (const item of items) {
                if (!item.variant_id || !item.quantity || item.quantity <= 0) {
                    return res.status(400).json({ success: false, message: "Each item must have variant_id and a valid quantity" });
                }

                const variant = await productModel.Get_variant_by_id(item.variant_id);
                if (!variant) {
                    return res.status(404).json({ success: false, message: `Variant with id ${item.variant_id} not found` });
                }

                if (variant.stock < item.quantity) {
                    return res.status(400).json({ success: false, message: `Insufficient stock for variant "${variant.volume_ml}ml". Available: ${variant.stock}` });
                }

                const unit_price = variant.price;
                total_amount += unit_price * item.quantity;
                validatedItems.push({
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    unit_price
                });
            }

            const order = await orderModel.Create_order({
                customer_id,
                address_id,
                payment_method,
                total_amount,
                items: validatedItems
            });

            res.status(201).json({ data: order, success: true, message: "Order placed successfully" });
        } catch (err) {
            console.error("error occured in order controller:", err);
            rollbar.error("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to create order" });
        }
    },

    CreateBottleOrder: async (req, res) => {
        const { customer_id, address_id, payment_method, items } = req.body;

        if (!customer_id || !address_id || !payment_method || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "customer_id, address_id, payment_method, and items are required" });
        }

        if (!['cod', 'online'].includes(payment_method)) {
            return res.status(400).json({ success: false, message: "payment_method must be 'cod' or 'online'" });
        }

        const orderModel = new Order_model();
        const bottleModel = new Bottle_model();
        const addressModel = new Address_model();

        try {
            const address = await addressModel.Get_address_by_id(address_id);
            if (!address) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }
            if (address.customer_id !== Number(customer_id)) {
                return res.status(403).json({ success: false, message: "This address does not belong to the given customer" });
            }

            let total_amount = 0;
            const validatedItems = [];

            for (const item of items) {
                if (!item.bottle_id || !item.quantity || item.quantity <= 0) {
                    return res.status(400).json({ success: false, message: "Each item must have bottle_id and a valid quantity" });
                }

                const bottle = await bottleModel.Get_bottle_by_id(item.bottle_id);
                if (!bottle) {
                    return res.status(404).json({ success: false, message: `Bottle with id ${item.bottle_id} not found` });
                }

                if (bottle.total_piece < item.quantity) {
                    return res.status(400).json({ success: false, message: `Insufficient stock for bottle "${bottle.name}". Available: ${bottle.total_piece}` });
                }

                const unit_price = bottle.price_per_piece;
                total_amount += unit_price * item.quantity;
                validatedItems.push({
                    bottle_id: item.bottle_id,
                    quantity: item.quantity,
                    unit_price
                });
            }

            const order = await orderModel.Create_bottle_order({
                customer_id,
                address_id,
                payment_method,
                total_amount,
                items: validatedItems
            });

            res.status(201).json({ data: order, success: true, message: "Bottle order placed successfully" });
        } catch (err) {
            console.error("error occured in bottle order controller:", err);
            rollbar.error("error occured in bottle order controller:", err);
            res.status(500).json({ success: false, message: "Failed to create bottle order" });
        }
    },

    GetAllOrders: async (req, res) => {
        const orderModel = new Order_model();
        try {
            const data = await orderModel.Get_all_orders();
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in order controller:", err);
            rollbar.error("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch orders" });
        }
    },

    GetOrdersByCustomer: async (req, res) => {
        const { customer_id } = req.params;
        const orderModel = new Order_model();
        try {
            const data = await orderModel.Get_orders_by_customer(Number(customer_id));
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in order controller:", err);
            rollbar.error("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch customer orders" });
        }
    },

    GetOrderById: async (req, res) => {
        const { id } = req.params;
        const orderModel = new Order_model();
        try {
            const order = await orderModel.Get_order_by_id(Number(id));
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }
            res.status(200).json({ data: order, success: true });
        } catch (err) {
            console.error("error occured in order controller:", err);
            rollbar.error("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch order" });
        }
    },

    UpdateOrderStatus: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['pending', 'confirmed', 'shipped', 'delivered', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Valid status is required (pending, confirmed, shipped, delivered, rejected)" });
        }

        const orderModel = new Order_model();
        try {
            const existing = await orderModel.Get_order_by_id(Number(id));
            if (!existing) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            await orderModel.Update_order_status(Number(id), status);
            const updated = await orderModel.Get_order_by_id(Number(id));
            res.status(200).json({ data: updated, success: true, message: "Order status updated successfully" });
        } catch (err) {
            console.error("error occured in order controller:", err);
            rollbar.error("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to update order status" });
        }
    },

    DeleteOrder: async (req, res) => {
        const { id } = req.params;
        const orderModel = new Order_model();
        try {
            const existing = await orderModel.Get_order_by_id(Number(id));
            if (!existing) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            await orderModel.Delete_order(Number(id));
            res.status(200).json({ success: true, message: "Order deleted successfully" });
        } catch (err) {
            console.error("error occured in order controller:", err);
            rollbar.error("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete order" });
        }
    }
}

module.exports = Order_controller;
