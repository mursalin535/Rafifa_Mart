const Address_model = require('../model/Address_model');
const rollbar = require('../rollbar');

const Address_controller = {
    AddAddress: async (req, res) => {
        const { customer_id, label, recipient_name, phone, address_line1, address_line2, city, district, division, postal_code, country, is_default } = req.body;

        if (!customer_id || !address_line1 || !city) {
            return res.status(400).json({ success: false, message: "customer_id, address_line1, and city are required" });
        }

        const addressModel = new Address_model();

        try {
            const data = await addressModel.Add_address({
                customer_id, label, recipient_name, phone, address_line1,
                address_line2, city, district, division, postal_code, country, is_default
            });
            res.status(201).json({ data, success: true, message: "Address added successfully" });
        } catch (err) {
            console.error("error occured in address controller:", err);
            rollbar.error("error occured in address controller:", err);
            res.status(500).json({ success: false, message: "Failed to add address" });
        }
    },

    GetAddressById: async (req, res) => {
        const { id } = req.params;
        const addressModel = new Address_model();

        try {
            const data = await addressModel.Get_address_by_id(Number(id));
            if (!data) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in address controller:", err);
            rollbar.error("error occured in address controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch address" });
        }
    },

    GetAddressesByCustomer: async (req, res) => {
        const { customer_id } = req.params;
        const addressModel = new Address_model();

        try {
            const data = await addressModel.Get_addresses_by_customer(Number(customer_id));
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in address controller:", err);
            rollbar.error("error occured in address controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch addresses" });
        }
    },

    GetDefaultAddress: async (req, res) => {
        const { customer_id } = req.params;
        const addressModel = new Address_model();

        try {
            const data = await addressModel.Get_default_address(Number(customer_id));
            if (!data) {
                return res.status(404).json({ success: false, message: "No default address found" });
            }
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in address controller:", err);
            rollbar.error("error occured in address controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch default address" });
        }
    },

    UpdateAddress: async (req, res) => {
        const { id } = req.params;
        const { label, recipient_name, phone, address_line1, address_line2, city, district, division, postal_code, country, is_default } = req.body;
        const addressModel = new Address_model();

        try {
            const existing = await addressModel.Get_address_by_id(Number(id));
            if (!existing) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }

            const fields = {};
            if (label !== undefined) fields.label = label;
            if (recipient_name !== undefined) fields.recipient_name = recipient_name;
            if (phone !== undefined) fields.phone = phone;
            if (address_line1 !== undefined) fields.address_line1 = address_line1;
            if (address_line2 !== undefined) fields.address_line2 = address_line2;
            if (city !== undefined) fields.city = city;
            if (district !== undefined) fields.district = district;
            if (division !== undefined) fields.division = division;
            if (postal_code !== undefined) fields.postal_code = postal_code;
            if (country !== undefined) fields.country = country;
            if (is_default !== undefined) fields.is_default = is_default;

            if (Object.keys(fields).length === 0) {
                return res.status(400).json({ success: false, message: "No fields to update" });
            }

            await addressModel.Update_address(Number(id), fields);
            const updated = await addressModel.Get_address_by_id(Number(id));
            res.status(200).json({ data: updated, success: true, message: "Address updated successfully" });
        } catch (err) {
            console.error("error occured in address controller:", err);
            rollbar.error("error occured in address controller:", err);
            res.status(500).json({ success: false, message: "Failed to update address" });
        }
    },

    SetDefault: async (req, res) => {
        const { customer_id, address_id } = req.params;
        const addressModel = new Address_model();

        try {
            const existing = await addressModel.Get_address_by_id(Number(address_id));
            if (!existing) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }

            await addressModel.Set_default(Number(customer_id), Number(address_id));
            const updated = await addressModel.Get_address_by_id(Number(address_id));
            res.status(200).json({ data: updated, success: true, message: "Default address updated" });
        } catch (err) {
            console.error("error occured in address controller:", err);
            rollbar.error("error occured in address controller:", err);
            res.status(500).json({ success: false, message: "Failed to set default address" });
        }
    },

    DeleteAddress: async (req, res) => {
        const { id } = req.params;
        const addressModel = new Address_model();

        try {
            const existing = await addressModel.Get_address_by_id(Number(id));
            if (!existing) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }

            await addressModel.Delete_address(Number(id));
            res.status(200).json({ success: true, message: "Address deleted successfully" });
        } catch (err) {
            console.error("error occured in address controller:", err);
            rollbar.error("error occured in address controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete address" });
        }
    },

    DeleteAllAddresses: async (req, res) => {
        const { customer_id } = req.params;
        const addressModel = new Address_model();

        try {
            await addressModel.Delete_all_addresses(Number(customer_id));
            res.status(200).json({ success: true, message: "All addresses deleted" });
        } catch (err) {
            console.error("error occured in address controller:", err);
            rollbar.error("error occured in address controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete addresses" });
        }
    },
}

module.exports = Address_controller;
