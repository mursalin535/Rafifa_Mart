const Offer_model = require('../model/Offer_model');
const Product_offer_model = require('../model/Product_offer_model');
const Product_model = require('../model/Product_model');
const rollbar = require('../rollbar');

const Offer_controller = {
    AddOffer: async (req, res) => {
        const { offer_name, title, punchline, thumbnail, discount_type, discount_value, valid_from, valid_until } = req.body;

        if (!discount_type || !['flat', 'percentage'].includes(discount_type)) {
            return res.status(400).json({ success: false, message: "discount_type must be 'flat' or 'percentage'" });
        }

        const offerModel = new Offer_model();
        try {
            const data = await offerModel.Add_offer({ offer_name, title, punchline, thumbnail, discount_type, discount_value, valid_from, valid_until });
            res.status(200).json({ data, success: true, message: "Offer created successfully" });
        } catch (err) {
            console.error("error occured in offer controller:", err);
            rollbar.error("error occured in offer controller:", err);
            res.status(500).json({ success: false, message: "Failed to create offer" });
        }
    },

    GetAllOffers: async (req, res) => {
        const offerModel = new Offer_model();
        try {
            const data = await offerModel.Get_all_offers();
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in offer controller:", err);
            rollbar.error("error occured in offer controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch offers" });
        }
    },

    UpdateOffer: async (req, res) => {
        const { id } = req.params;
        const { offer_name, title, punchline, thumbnail, discount_type, discount_value, valid_from, valid_until } = req.body;
        const offerModel = new Offer_model();

        try {
            const existing = await offerModel.Get_offer_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Offer not found" });
            }

            const fields = {};
            if (offer_name !== undefined) fields.offer_name = offer_name;
            if (title !== undefined) fields.title = title;
            if (punchline !== undefined) fields.punchline = punchline;
            if (thumbnail !== undefined) fields.thumbnail = thumbnail;
            if (discount_type !== undefined) fields.discount_type = discount_type;
            if (discount_value !== undefined) fields.discount_value = discount_value;
            if (valid_from !== undefined) fields.valid_from = valid_from;
            if (valid_until !== undefined) fields.valid_until = valid_until;

            if (Object.keys(fields).length === 0) {
                return res.status(400).json({ success: false, message: "No fields to update" });
            }

            await offerModel.Update_offer(id, fields);
            const updated = await offerModel.Get_offer_by_id(id);
            res.status(200).json({ data: updated, success: true, message: "Offer updated successfully" });
        } catch (err) {
            console.error("error occured in offer controller:", err);
            rollbar.error("error occured in offer controller:", err);
            res.status(500).json({ success: false, message: "Failed to update offer" });
        }
    },

    DeleteOffer: async (req, res) => {
        const { id } = req.params;
        const offerModel = new Offer_model();
        const productOfferModel = new Product_offer_model();

        try {
            const existing = await offerModel.Get_offer_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Offer not found" });
            }

            const connection = await require('../DataBase/Database').getConnection();
            try {
                await connection.beginTransaction();
                await connection.execute(`DELETE FROM product_offers WHERE offer_id = ?`, [id]);
                await connection.execute(`DELETE FROM offers WHERE id = ?`, [id]);
                await connection.commit();
            } catch (e) {
                await connection.rollback();
                throw e;
            } finally {
                connection.release();
            }

            res.status(200).json({ success: true, message: "Offer deleted successfully" });
        } catch (err) {
            console.error("error occured in offer controller:", err);
            rollbar.error("error occured in offer controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete offer" });
        }
    },

    AssignOfferToProduct: async (req, res) => {
        const { product_id, offer_id } = req.body;
        const productOfferModel = new Product_offer_model();
        const productModel = new Product_model();
        const offerModel = new Offer_model();

        try {
            const product = await productModel.Get_product_by_id(product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            const offer = await offerModel.Get_offer_by_id(offer_id);
            if (!offer) {
                return res.status(404).json({ success: false, message: "Offer not found" });
            }

            const result = await productOfferModel.Assign_offer(product_id, offer_id);
            if (result.already_assigned) {
                return res.status(400).json({ success: false, message: "Offer already assigned to this product" });
            }

            res.status(200).json({ data: result, success: true, message: "Offer assigned to product" });
        } catch (err) {
            console.error("error occured in offer controller:", err);
            rollbar.error("error occured in offer controller:", err);
            res.status(500).json({ success: false, message: "Failed to assign offer" });
        }
    },

    GetOffersByProduct: async (req, res) => {
        const { product_id } = req.params;
        const productOfferModel = new Product_offer_model();

        try {
            const data = await productOfferModel.Get_offers_by_product(Number(product_id));
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in offer controller:", err);
            rollbar.error("error occured in offer controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch offers" });
        }
    },

    GetAllProductOffers: async (req, res) => {
        const productOfferModel = new Product_offer_model();

        try {
            const data = await productOfferModel.Get_all_product_offers();
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in offer controller:", err);
            rollbar.error("error occured in offer controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch all product offers" });
        }
    },

    GetProductsByOffer: async (req, res) => {
        const { offer_id } = req.params;
        const productOfferModel = new Product_offer_model();

        try {
            const data = await productOfferModel.Get_products_by_offer(Number(offer_id));
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in offer controller:", err);
            rollbar.error("error occured in offer controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch products by offer" });
        }
    },

    RemoveOfferFromProduct: async (req, res) => {
        const { product_id, offer_id } = req.params;
        const productOfferModel = new Product_offer_model();

        try {
            await productOfferModel.Remove_offer_from_product(Number(product_id), Number(offer_id));
            res.status(200).json({ success: true, message: "Offer removed from product" });
        } catch (err) {
            console.error("error occured in offer controller:", err);
            rollbar.error("error occured in offer controller:", err);
            res.status(500).json({ success: false, message: "Failed to remove offer" });
        }
    },

    GetOffersWithProducts: async (req, res) => {
        const offerModel = new Offer_model();
        try {
            const data = await offerModel.Get_offers_with_products();
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in offer controller:", err);
            rollbar.error("error occured in offer controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch offers with products" });
        }
    }
}

module.exports = Offer_controller;
