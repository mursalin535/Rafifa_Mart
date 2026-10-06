const Bottle_model = require('../model/Bottle_model');
const rollbar = require('../rollbar');

const Bottle_controller = {
    AddBottle: async (req, res) => {
        const { name, photo_url, total_piece, volume, price_per_piece, description } = req.body;
        const bottle = new Bottle_model();
        try {
            const data = await bottle.Add_bottle({ name, photo_url, total_piece, volume, price_per_piece, description });
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in bottle controller:", err);
            rollbar.error("error occured in bottle controller:", err);
            res.status(500).json({ success: false, message: "Failed to add bottle" });
        }
    },

    GetAllBottles: async (req, res) => {
        const bottle = new Bottle_model();
        try {
            const data = await bottle.GetAll_bottles();
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in bottle controller:", err);
            rollbar.error("error occured in bottle controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch bottles" });
        }
    },

    DeleteBottle: async (req, res) => {
        const { id } = req.params;
        const bottle = new Bottle_model();
        try {
            const existing = await bottle.Get_bottle_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Bottle not found" });
            }

            await bottle.Delete_bottle(id);
            res.status(200).json({ success: true, message: "Bottle deleted successfully" });
        } catch (err) {
            console.error("error occured in bottle controller:", err);
            rollbar.error("error occured in bottle controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete bottle" });
        }
    },

    UpdateBottle: async (req, res) => {
        const { id } = req.params;
        const { name, photo_url, total_piece, volume, price_per_piece, description } = req.body;
        const bottle = new Bottle_model();
        try {
            const existing = await bottle.Get_bottle_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Bottle not found" });
            }

            const fields = {};
            if (name !== undefined) fields.name = name;
            if (photo_url !== undefined) fields.photo_url = photo_url;
            if (total_piece !== undefined) fields.total_piece = total_piece;
            if (volume !== undefined) fields.volume = volume;
            if (price_per_piece !== undefined) fields.price_per_piece = price_per_piece;
            if (description !== undefined) fields.description = description;

            if (Object.keys(fields).length === 0) {
                return res.status(400).json({ success: false, message: "No fields to update" });
            }

            await bottle.Update_bottle(id, fields);
            const updated = await bottle.Get_bottle_by_id(id);
            res.status(200).json({ data: updated, success: true, message: "Bottle updated successfully" });
        } catch (err) {
            console.error("error occured in bottle controller:", err);
            rollbar.error("error occured in bottle controller:", err);
            res.status(500).json({ success: false, message: "Failed to update bottle" });
        }
    }
}

module.exports = Bottle_controller;
