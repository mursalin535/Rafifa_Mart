const Rating_model = require('../model/Rating_model');
const Product_model = require('../model/Product_model');
const rollbar = require('../rollbar');

const Rating_controller = {
    AddRating: async (req, res) => {
        const { product_id, customer_id, rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const ratingModel = new Rating_model();
        const productModel = new Product_model();

        try {
            const product = await productModel.Get_product_by_id(product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            const data = await ratingModel.Add_rating({ product_id, customer_id, rating, comment });
            const message = data.updated ? "Rating updated successfully" : "Rating added successfully";
            res.status(200).json({ data, success: true, message });
        } catch (err) {
            console.error("error occured in rating controller:", err);
            rollbar.error("error occured in rating controller:", err);
            res.status(500).json({ success: false, message: "Failed to add rating" });
        }
    },

    GetRatingsByProduct: async (req, res) => {
        const { product_id } = req.params;
        const ratingModel = new Rating_model();

        try {
            const ratings = await ratingModel.Get_ratings_by_product(Number(product_id));
            const summary = await ratingModel.Get_avg_rating(Number(product_id));
            res.status(200).json({ ratings, summary, success: true });
        } catch (err) {
            console.error("error occured in rating controller:", err);
            rollbar.error("error occured in rating controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch ratings" });
        }
    },

    GetAllRatings: async (req, res) => {
        const ratingModel = new Rating_model();

        try {
            const ratings = await ratingModel.Get_all_ratings();
            res.status(200).json({ ratings, success: true });
        } catch (err) {
            console.error("error occured in rating controller:", err);
            rollbar.error("error occured in rating controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch all ratings" });
        }
    },

    DeleteRating: async (req, res) => {
        const { id } = req.params;
        const ratingModel = new Rating_model();

        try {
            const existing = await ratingModel.Get_rating_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Rating not found" });
            }

            await ratingModel.Delete_rating(id);
            res.status(200).json({ success: true, message: "Rating deleted successfully" });
        } catch (err) {
            console.error("error occured in rating controller:", err);
            rollbar.error("error occured in rating controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete rating" });
        }
    }
}

module.exports = Rating_controller;
