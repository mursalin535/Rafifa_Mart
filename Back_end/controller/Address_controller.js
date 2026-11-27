const Address_model = require('../model/Address_model');
const rollbar = require('../rollbar');

// কোন ঘর compulsory আর ভুল হলে ব্যবহারকারীকে কী নামে দেখাবে
// (Area ঘরটা district column-এ যায়)
const FIELD_LABELS = {
    label: 'House name',
    recipient_name: 'Receiver name',
    phone: 'Phone number',
    address_line1: 'Address',
    district: 'Area',
    city: 'City',
    division: 'Division',
    postal_code: 'Postal code',
};
const REQUIRED = Object.keys(FIELD_LABELS);
const OPTIONAL = ['address_line2', 'country'];
const LIMITS = {
    label: 50, recipient_name: 100, phone: 20, address_line1: 255, address_line2: 255,
    city: 100, district: 100, division: 100, postal_code: 20, country: 100,
};
const DEFAULTS = { country: 'Bangladesh' };
// বাংলাদেশের মোবাইল: ঠিক ১১ ডিজিট, 01 দিয়ে শুরু, তৃতীয় ডিজিট ৩ থেকে ৯
const PHONE_RE = /^01[3-9][0-9]{8}$/;
// বাংলাদেশের postal code: ঠিক ৪ ডিজিট
const POSTAL_RE = /^[0-9]{4}$/;

function str(v) {
    if (typeof v === 'string') return v.trim();
    if (typeof v === 'number') return String(v);
    return '';
}

function parseId(value) {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
}

function buildFields(body, partial) {
    const fields = {};

    for (const key of [...REQUIRED, ...OPTIONAL]) {
        if (body[key] === undefined) {
            if (!partial && REQUIRED.includes(key)) {
                return { error: `${FIELD_LABELS[key]} is required.` };
            }
            continue;
        }

        let value = str(body[key]);

        if (REQUIRED.includes(key) && value === '') {
            return { error: `${FIELD_LABELS[key]} is required.` };
        }
        if (key === 'phone') {
            value = value.replace(/[\s-]/g, '');
            if (!PHONE_RE.test(value)) {
                return { error: 'Phone number must be 11 digits and start with 01 (e.g. 017XXXXXXXX).' };
            }
        }
        if (key === 'postal_code' && !POSTAL_RE.test(value)) {
            return { error: 'Postal code must be 4 digits.' };
        }
        if (value.length > LIMITS[key]) {
            return { error: `${FIELD_LABELS[key] || key} is too long.` };
        }

        if (value === '') {
            fields[key] = DEFAULTS[key] !== undefined ? DEFAULTS[key] : null;
        } else {
            fields[key] = value;
        }
    }

    if (body.is_default !== undefined) {
        fields.is_default = body.is_default === true || body.is_default === 1 || body.is_default === '1' || body.is_default === 'true';
    }

    return { fields };
}

// শুধু নিজের address পেলে return করে, না হলে 404 পাঠিয়ে null দেয়
async function getOwnedAddress(addressModel, id, customerId, res) {
    const address = await addressModel.Get_address_by_id(id);
    if (!address || Number(address.customer_id) !== Number(customerId)) {
        res.status(404).json({ success: false, message: "Address not found" });
        return null;
    }
    return address;
}

function logError(err) {
    console.error("error occured in address controller:", err);
    rollbar.error("error occured in address controller:", err);
}

const Address_controller = {
    AddAddress: async (req, res) => {
        const { fields, error } = buildFields(req.body || {}, false);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        const addressModel = new Address_model();

        try {
            const data = await addressModel.Add_address({ customer_id: req.customerId, ...fields });
            res.status(201).json({ data, success: true, message: "Address added successfully" });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to add address" });
        }
    },

    GetAddressById: async (req, res) => {
        const id = parseId(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: "Invalid address id" });

        const addressModel = new Address_model();

        try {
            const data = await getOwnedAddress(addressModel, id, req.customerId, res);
            if (!data) return;
            res.status(200).json({ data, success: true });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to fetch address" });
        }
    },

    // URL-এর customer_id উপেক্ষা করা হয়, সবসময় session-এর customer
    GetAddressesByCustomer: async (req, res) => {
        const addressModel = new Address_model();

        try {
            const data = await addressModel.Get_addresses_by_customer(req.customerId);
            res.status(200).json({ data, success: true });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to fetch addresses" });
        }
    },

    GetDefaultAddress: async (req, res) => {
        const addressModel = new Address_model();

        try {
            const data = await addressModel.Get_default_address(req.customerId);
            if (!data) {
                return res.status(404).json({ success: false, message: "No default address found" });
            }
            res.status(200).json({ data, success: true });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to fetch default address" });
        }
    },

    UpdateAddress: async (req, res) => {
        const id = parseId(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: "Invalid address id" });

        const { fields, error } = buildFields(req.body || {}, true);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }
        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        const addressModel = new Address_model();

        try {
            const existing = await getOwnedAddress(addressModel, id, req.customerId, res);
            if (!existing) return;

            await addressModel.Update_address(id, fields);
            const updated = await addressModel.Get_address_by_id(id);
            res.status(200).json({ data: updated, success: true, message: "Address updated successfully" });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to update address" });
        }
    },

    SetDefault: async (req, res) => {
        const addressId = parseId(req.params.address_id);
        if (!addressId) return res.status(400).json({ success: false, message: "Invalid address id" });

        const addressModel = new Address_model();

        try {
            const existing = await getOwnedAddress(addressModel, addressId, req.customerId, res);
            if (!existing) return;

            await addressModel.Set_default(req.customerId, addressId);
            const updated = await addressModel.Get_address_by_id(addressId);
            res.status(200).json({ data: updated, success: true, message: "Default address updated" });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to set default address" });
        }
    },

    DeleteAddress: async (req, res) => {
        const id = parseId(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: "Invalid address id" });

        const addressModel = new Address_model();
        const IN_USE_MESSAGE = "This address is used in an order and can't be deleted.";

        try {
            const existing = await getOwnedAddress(addressModel, id, req.customerId, res);
            if (!existing) return;

            if (await addressModel.Is_address_used(id)) {
                return res.status(409).json({ success: false, code: 'ADDRESS_IN_USE', message: IN_USE_MESSAGE });
            }

            await addressModel.Delete_address(id);
            res.status(200).json({ success: true, message: "Address deleted successfully" });
        } catch (err) {
            // check আর delete-এর মাঝে order হয়ে গেলে FK এই error দেয়
            if (err && err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ success: false, code: 'ADDRESS_IN_USE', message: IN_USE_MESSAGE });
            }
            logError(err);
            res.status(500).json({ success: false, message: "Failed to delete address" });
        }
    },
}

module.exports = Address_controller;