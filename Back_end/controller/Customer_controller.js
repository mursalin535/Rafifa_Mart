const rollbar = require('../rollbar');
const {
  findCustomerById,
  findAllCustomers,
  updateCustomerPhone,
  updateCustomerStatus,
} = require('../model/Customer_model');

const Customer_controller = {
    GetAllCustomers: async (req, res) => {
        try {
            const customers = await findAllCustomers();
            const safe = customers.map(({ password, ...rest }) => rest);
            res.status(200).json({ data: safe, success: true });
        } catch (err) {
            console.error("error occured in customer controller:", err);
            rollbar.error("error occured in customer controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch customers" });
        }
    },

    GetCustomerById: async (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ success: false, message: "Invalid customer id" });
        }

        try {
            const customer = await findCustomerById(id);
            if (!customer) {
                return res.status(404).json({ success: false, message: "Customer not found" });
            }

            const { password, ...safe } = customer;
            res.status(200).json({ data: safe, success: true });
        } catch (err) {
            console.error("error occured in customer controller:", err);
            rollbar.error("error occured in customer controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch customer" });
        }
    },

    UpdateMyPhone: async (req, res) => {
        const raw = req.body && req.body.phone;
        let phone = null;

        if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
            phone = String(raw).replace(/[\s-]/g, '');
            if (!/^01[3-9][0-9]{8}$/.test(phone)) {
                return res.status(400).json({ success: false, message: "Phone number must be 11 digits and start with 01 (e.g. 017XXXXXXXX)." });
            }
        }

        try {
            const customer = await updateCustomerPhone(req.customerId, phone);
            const { password, ...safe } = customer;
            res.status(200).json({ data: safe, success: true, message: "Phone updated successfully" });
        } catch (err) {
            console.error("error occured in customer controller:", err);
            rollbar.error("error occured in customer controller:", err);
            res.status(500).json({ success: false, message: "Failed to update phone" });
        }
    },

    // admin: customer block / unblock
    UpdateCustomerStatus: async (req, res) => {
        const id = Number(req.params.id);
        const status = req.body && req.body.status;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ success: false, message: "Invalid customer id" });
        }
        if (status !== 'active' && status !== 'blocked') {
            return res.status(400).json({ success: false, message: "Status must be 'active' or 'blocked'" });
        }

        try {
            const existing = await findCustomerById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Customer not found" });
            }

            const customer = await updateCustomerStatus(id, status);
            const { password, ...safe } = customer;
            res.status(200).json({
                data: safe,
                success: true,
                message: status === 'blocked' ? "Customer blocked" : "Customer unblocked",
            });
        } catch (err) {
            console.error("error occured in customer controller:", err);
            rollbar.error("error occured in customer controller:", err);
            res.status(500).json({ success: false, message: "Failed to update customer status" });
        }
    },
}

module.exports = Customer_controller;