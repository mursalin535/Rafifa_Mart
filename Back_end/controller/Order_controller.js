const Order_model = require('../model/Order_model');
const Product_model = require('../model/Product_model');
const Bottle_model = require('../model/Bottle_model');
const Address_model = require('../model/Address_model');
const rollbar = require('../rollbar');
const { bestPrice, getActiveOffersByProduct, roundMoney } = require('../services/pricing');

const MAX_QTY = 100;
const MAX_LINES = 50;
const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'rejected'];

function parseId(value) {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
}

function logError(label, err) {
    console.error(label, err);
    rollbar.error(label, err);
}

function isStockError(err) {
    return err && typeof err.message === 'string' && err.message.startsWith('Stock unavailable');
}

// payment: এখন শুধু COD (bKash/online gateway নেই)
function checkPayment(body) {
    const method = body.payment_method === undefined ? 'cod' : body.payment_method;
    if (method !== 'cod') {
        return 'Only Cash on Delivery is available right now.';
    }
    return null;
}

// items যাচাই করে একই id-র লাইন যোগ করে দেয়: [{ id, quantity }]
function normalizeItems(items, idKey) {
    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
        return { error: 'items must be a non-empty list' };
    }

    const merged = new Map();
    for (const item of items) {
        if (!item || typeof item !== 'object') {
            return { error: 'Invalid item' };
        }
        const id = parseId(item[idKey]);
        if (!id) {
            return { error: `Each item must have a valid ${idKey}` };
        }
        if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1) {
            return { error: 'Each item must have a whole-number quantity of at least 1' };
        }
        merged.set(id, (merged.get(id) || 0) + item.quantity);
    }

    const list = [];
    for (const [id, quantity] of merged) {
        if (quantity > MAX_QTY) {
            return { error: `Quantity per item cannot exceed ${MAX_QTY}` };
        }
        list.push({ id, quantity });
    }
    return { list };
}

// client যে total দেখেছে (expected_total) আর server-এর হিসাব না মিললে true
// expected_total না পাঠালে চেক হয় না
function totalMismatch(body, serverTotal) {
    if (body.expected_total === undefined || body.expected_total === null) return false;
    const expected = Number(body.expected_total);
    if (!Number.isFinite(expected)) return true;
    return Math.abs(expected - serverTotal) > 0.009;
}

const Order_controller = {
    CreateOrder: async (req, res) => {
        const body = req.body || {};
        const address_id = parseId(body.address_id);

        if (!address_id) {
            return res.status(400).json({ success: false, message: "A valid address_id is required" });
        }
        const paymentError = checkPayment(body);
        if (paymentError) {
            return res.status(400).json({ success: false, message: paymentError });
        }
        const { list, error } = normalizeItems(body.items, 'variant_id');
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        const orderModel = new Order_model();
        const productModel = new Product_model();
        const addressModel = new Address_model();

        try {
            const address = await addressModel.Get_address_by_id(address_id);
            if (!address || Number(address.customer_id) !== Number(req.customerId)) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }

            // ১) variant আর stock যাচাই
            const lines = [];
            for (const { id, quantity } of list) {
                const variant = await productModel.Get_variant_by_id(id);
                if (!variant) {
                    return res.status(404).json({ success: false, message: `Variant with id ${id} not found` });
                }

                if (variant.stock < quantity) {
                    return res.status(409).json({ success: false, message: `Insufficient stock for "${variant.volume_ml}ml". Available: ${variant.stock}` });
                }

                lines.push({ variant, quantity });
            }

            // ২) চালু offer অনুযায়ী দাম server নিজে বের করে (client-এর দাম কখনো বিশ্বাস করা হয় না)
            const productIds = [...new Set(lines.map(l => l.variant.product_id))];
            const offersByProduct = await getActiveOffersByProduct(productIds);

            let total_amount = 0;
            const validatedItems = [];

            for (const { variant, quantity } of lines) {
                const unit_price = bestPrice(variant.price, offersByProduct.get(variant.product_id));
                total_amount += unit_price * quantity;
                validatedItems.push({ variant_id: variant.id, quantity, unit_price });
            }

            total_amount = roundMoney(total_amount);

            // ৩) customer যা দেখেছিল আর server-এর হিসাব না মিললে order করা হবে না
            if (totalMismatch(body, total_amount)) {
                return res.status(409).json({
                    success: false,
                    code: 'PRICE_CHANGED',
                    current_total: total_amount,
                    message: `Prices have changed since you viewed them. The current total is ৳${total_amount}. Please review your order.`
                });
            }

            const order = await orderModel.Create_order({
                customer_id: req.customerId,
                address_id,
                payment_method: 'cod',
                total_amount,
                items: validatedItems
            });

            res.status(201).json({ data: order, success: true, message: "Order placed successfully" });
        } catch (err) {
            if (isStockError(err)) {
                return res.status(409).json({ success: false, message: "Some items just went out of stock. Please review your order." });
            }
            logError("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to create order" });
        }
    },

    CreateBottleOrder: async (req, res) => {
        const body = req.body || {};
        const address_id = parseId(body.address_id);

        if (!address_id) {
            return res.status(400).json({ success: false, message: "A valid address_id is required" });
        }
        const paymentError = checkPayment(body);
        if (paymentError) {
            return res.status(400).json({ success: false, message: paymentError });
        }
        const { list, error } = normalizeItems(body.items, 'bottle_id');
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        const orderModel = new Order_model();
        const bottleModel = new Bottle_model();
        const addressModel = new Address_model();

        try {
            const address = await addressModel.Get_address_by_id(address_id);
            if (!address || Number(address.customer_id) !== Number(req.customerId)) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }

            let total_amount = 0;
            const validatedItems = [];

            for (const { id, quantity } of list) {
                const bottle = await bottleModel.Get_bottle_by_id(id);
                if (!bottle) {
                    return res.status(404).json({ success: false, message: `Bottle with id ${id} not found` });
                }

                if (bottle.total_piece < quantity) {
                    return res.status(409).json({ success: false, message: `Insufficient stock for bottle "${bottle.name}". Available: ${bottle.total_piece}` });
                }

                const unit_price = Number(bottle.price_per_piece);
                total_amount += unit_price * quantity;
                validatedItems.push({ bottle_id: id, quantity, unit_price });
            }

            const order = await orderModel.Create_bottle_order({
                customer_id: req.customerId,
                address_id,
                payment_method: 'cod',
                total_amount: roundMoney(total_amount),
                items: validatedItems
            });

            res.status(201).json({ data: order, success: true, message: "Bottle order placed successfully" });
        } catch (err) {
            if (isStockError(err)) {
                return res.status(409).json({ success: false, message: "Some items just went out of stock. Please review your order." });
            }
            logError("error occured in bottle order controller:", err);
            res.status(500).json({ success: false, message: "Failed to create bottle order" });
        }
    },

    GetAllOrders: async (req, res) => {
        const orderModel = new Order_model();
        try {
            const data = await orderModel.Get_all_orders();
            res.status(200).json({ data, success: true });
        } catch (err) {
            logError("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch orders" });
        }
    },

    // URL-এর customer_id উপেক্ষা করা হয়, সবসময় session-এর customer
    GetOrdersByCustomer: async (req, res) => {
        const orderModel = new Order_model();
        try {
            const data = await orderModel.Get_orders_by_customer(req.customerId);
            res.status(200).json({ data, success: true });
        } catch (err) {
            logError("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch customer orders" });
        }
    },

    GetOrderById: async (req, res) => {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid order id" });
        }

        const orderModel = new Order_model();
        try {
            const order = await orderModel.Get_order_by_id(id);
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }
            // admin সব দেখতে পারে; customer শুধু নিজেরটা
            if (!req.isAdmin && Number(order.customer_id) !== Number(req.customerId)) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }
            res.status(200).json({ data: order, success: true });
        } catch (err) {
            logError("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch order" });
        }
    },

    UpdateOrderStatus: async (req, res) => {
        const id = parseId(req.params.id);
        const { status } = req.body || {};

        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid order id" });
        }
        if (!status || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ success: false, message: "Valid status is required (pending, confirmed, shipped, delivered, rejected)" });
        }

        const orderModel = new Order_model();
        try {
            const existing = await orderModel.Get_order_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            await orderModel.Update_order_status(id, status);
            const updated = await orderModel.Get_order_by_id(id);
            res.status(200).json({ data: updated, success: true, message: "Order status updated successfully" });
        } catch (err) {
            logError("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to update order status" });
        }
    },

    DeleteOrder: async (req, res) => {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid order id" });
        }

        const orderModel = new Order_model();
        try {
            const existing = await orderModel.Get_order_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            await orderModel.Delete_order(id);
            res.status(200).json({ success: true, message: "Order deleted successfully" });
        } catch (err) {
            logError("error occured in order controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete order" });
        }
    }
}

module.exports = Order_controller;