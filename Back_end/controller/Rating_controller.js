const Rating_model = require('../model/Rating_model');
const Product_model = require('../model/Product_model');
const rollbar = require('../rollbar');

const MAX_COMMENT = 1000;

function parseId(value) {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
}

function logError(err) {
    console.error("error occured in rating controller:", err);
    rollbar.error("error occured in rating controller:", err);
}

const Rating_controller = {
    AddRating: async (req, res) => {
        const body = req.body || {};
        const product_id = parseId(body.product_id);
        const rating = body.rating;
        const comment = typeof body.comment === 'string' ? body.comment.trim() : '';

        if (!product_id) {
            return res.status(400).json({ success: false, message: "A valid product_id is required" });
        }
        if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be a whole number between 1 and 5" });
        }
        if (comment.length > MAX_COMMENT) {
            return res.status(400).json({ success: false, message: `Comment cannot exceed ${MAX_COMMENT} characters` });
        }

        const ratingModel = new Rating_model();
        const productModel = new Product_model();

        try {
            const product = await productModel.Get_product_by_id(product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            // customer_id সবসময় session থেকে, body থেকে না
            const data = await ratingModel.Add_rating({
                product_id,
                customer_id: req.customerId,
                rating,
                comment
            });
            const message = data.updated ? "Rating updated successfully" : "Rating added successfully";
            res.status(200).json({ data, success: true, message });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to add rating" });
        }
    },

    GetRatingsByProduct: async (req, res) => {
        const product_id = parseId(req.params.product_id);
        if (!product_id) {
            return res.status(400).json({ success: false, message: "Invalid product id" });
        }

        const ratingModel = new Rating_model();

        try {
            const ratings = await ratingModel.Get_ratings_by_product(product_id);
            const summary = await ratingModel.Get_avg_rating(product_id);
            res.status(200).json({ ratings, summary, success: true });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to fetch ratings" });
        }
    },

    // সর্বজনীন, শুধু { id, product_id, rating }: কোনো customer-এর নাম/ছবি/id/comment নেই
    GetPublicRatings: async (req, res) => {
        const ratingModel = new Rating_model();

        try {
            const ratings = await ratingModel.Get_public_ratings();
            res.status(200).json({ ratings, success: true });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to fetch ratings" });
        }
    },

    GetAllRatings: async (req, res) => {
        const ratingModel = new Rating_model();

        try {
            const ratings = await ratingModel.Get_all_ratings();
            res.status(200).json({ ratings, success: true });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to fetch all ratings" });
        }
    },

    DeleteRating: async (req, res) => {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid rating id" });
        }

        const ratingModel = new Rating_model();

        try {
            const existing = await ratingModel.Get_rating_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Rating not found" });
            }

            await ratingModel.Delete_rating(id);
            res.status(200).json({ success: true, message: "Rating deleted successfully" });
        } catch (err) {
            logError(err);
            res.status(500).json({ success: false, message: "Failed to delete rating" });
        }
    }
}

module.exports = Rating_controller;