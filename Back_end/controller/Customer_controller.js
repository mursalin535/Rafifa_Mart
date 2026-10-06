const bcrypt = require('bcrypt');
const rollbar = require('../rollbar');
const {
  findCustomerById,
  findCustomerByEmail,
  findCustomerByGoogleId,
  createCustomerWithPassword,
  createCustomerWithGoogle,
  linkGoogleIdToCustomer,
  findAllCustomers,
  updateCustomerPhone,
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
        const { id } = req.params;

        try {
            const customer = await findCustomerById(Number(id));
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

    GetCustomerByEmail: async (req, res) => {
        const { email } = req.params;

        try {
            const customer = await findCustomerByEmail(email);
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

    GetCustomerByGoogleId: async (req, res) => {
        const { google_id } = req.params;

        try {
            const customer = await findCustomerByGoogleId(google_id);
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

    CreateCustomerWithPassword: async (req, res) => {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        }

        try {
            const existing = await findCustomerByEmail(email);
            if (existing) {
                return res.status(409).json({ success: false, message: "An account with this email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const customer = await createCustomerWithPassword({ name, email, hashedPassword, phone });

            const { password: _, ...safe } = customer;
            res.status(201).json({ data: safe, success: true, message: "Customer created successfully" });
        } catch (err) {
            console.error("error occured in customer controller:", err);
            rollbar.error("error occured in customer controller:", err);
            res.status(500).json({ success: false, message: "Failed to create customer" });
        }
    },

    CreateCustomerWithGoogle: async (req, res) => {
        const { name, email, google_id, profile_pic } = req.body;

        if (!name || !email || !google_id) {
            return res.status(400).json({ success: false, message: "Name, email, and google_id are required" });
        }

        try {
            const existing = await findCustomerByEmail(email);
            if (existing) {
                return res.status(409).json({ success: false, message: "An account with this email already exists" });
            }

            const customer = await createCustomerWithGoogle({ name, email, googleId: google_id, profilePic: profile_pic });

            const { password, ...safe } = customer;
            res.status(201).json({ data: safe, success: true, message: "Customer created successfully" });
        } catch (err) {
            console.error("error occured in customer controller:", err);
            rollbar.error("error occured in customer controller:", err);
            res.status(500).json({ success: false, message: "Failed to create customer" });
        }
    },

    LinkGoogleId: async (req, res) => {
        const { id } = req.params;
        const { google_id, profile_pic } = req.body;

        if (!google_id) {
            return res.status(400).json({ success: false, message: "google_id is required" });
        }

        try {
            const existing = await findCustomerById(Number(id));
            if (!existing) {
                return res.status(404).json({ success: false, message: "Customer not found" });
            }

            const customer = await linkGoogleIdToCustomer(Number(id), google_id, profile_pic);

            const { password, ...safe } = customer;
            res.status(200).json({ data: safe, success: true, message: "Google ID linked successfully" });
        } catch (err) {
            console.error("error occured in customer controller:", err);
            rollbar.error("error occured in customer controller:", err);
            res.status(500).json({ success: false, message: "Failed to link Google ID" });
        }
    },

    UpdateCustomerPhone: async (req, res) => {
        const { id } = req.params;
        const { phone } = req.body;

        try {
            const existing = await findCustomerById(Number(id));
            if (!existing) {
                return res.status(404).json({ success: false, message: "Customer not found" });
            }

            const customer = await updateCustomerPhone(Number(id), phone || null);
            const { password, ...safe } = customer;
            res.status(200).json({ data: safe, success: true, message: "Phone updated successfully" });
        } catch (err) {
            console.error("error occured in customer controller:", err);
            rollbar.error("error occured in customer controller:", err);
            res.status(500).json({ success: false, message: "Failed to update phone" });
        }
    },
}

module.exports = Customer_controller;
