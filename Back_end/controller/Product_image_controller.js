const Product_image_model = require('../model/Product_image_model');
const Product_model = require('../model/Product_model');
const rollbar = require('../rollbar');
const fs = require('fs');
const path = require('path');

const Product_image_controller = {
    UploadImage: async (req, res) => {
        const { product_id } = req.params;
        const { is_primary } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const product = new Product_model();
        const imageModel = new Product_image_model();

        try {
            const existing = await product.Get_product_by_id(product_id);
            if (!existing) {
                fs.unlinkSync(req.file.path);
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            const image_url = `/uploads/products/${req.file.filename}`;
            const data = await imageModel.Add_image({
                product_id: Number(product_id),
                image_url,
                is_primary: is_primary === 'true' || is_primary === true
            });

            res.status(200).json({ data, success: true, message: "Image uploaded successfully" });
        } catch (err) {
            if (req.file) fs.unlinkSync(req.file.path);
            console.error("error occured in image controller:", err);
            rollbar.error("error occured in image controller:", err);
            res.status(500).json({ success: false, message: "Failed to upload image" });
        }
    },

    GetImages: async (req, res) => {
        const { product_id } = req.params;
        const imageModel = new Product_image_model();

        try {
            const data = await imageModel.Get_images_by_product(Number(product_id));
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in image controller:", err);
            rollbar.error("error occured in image controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch images" });
        }
    },

    SetPrimary: async (req, res) => {
        const { id } = req.params;
        const { product_id } = req.body;
        const imageModel = new Product_image_model();

        try {
            const existing = await imageModel.Get_image_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Image not found" });
            }

            await imageModel.Set_primary(Number(id), product_id || existing.product_id);
            res.status(200).json({ success: true, message: "Primary image updated" });
        } catch (err) {
            console.error("error occured in image controller:", err);
            rollbar.error("error occured in image controller:", err);
            res.status(500).json({ success: false, message: "Failed to set primary image" });
        }
    },

    GetAllProductImages: async (req, res) => {
        const imageModel = new Product_image_model();

        try {
            const data = await imageModel.Get_all_product_images();
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in image controller:", err);
            rollbar.error("error occured in image controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch all product images" });
        }
    },

    DeleteImage: async (req, res) => {
        const { id } = req.params;
        const imageModel = new Product_image_model();

        try {
            const existing = await imageModel.Get_image_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Image not found" });
            }

            const filePath = path.join(__dirname, '..', existing.image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            await imageModel.Delete_image(id);
            res.status(200).json({ success: true, message: "Image deleted successfully" });
        } catch (err) {
            console.error("error occured in image controller:", err);
            rollbar.error("error occured in image controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete image" });
        }
    }
}

module.exports = Product_image_controller;
