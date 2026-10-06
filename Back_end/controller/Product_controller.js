const Product_model = require('../model/Product_model');
const Product_image_model = require('../model/Product_image_model');
const rollbar = require('../rollbar');
const fs = require('fs');
const path = require('path');

const VALID_PERFUME_TYPES = ['floral', 'fresh', 'amber', 'woody', 'gourmand', 'citrusy'];
const VALID_PERFUME_FOR = ['Male', 'Female'];
const VALID_PACKAGING_TYPES = ['atar', 'spray'];

const Product_controller = {
    AddProduct: async (req, res) => {
        const { name, description, perfume_type, perfume_for } = req.body;
        const product = new Product_model();

        try {
            if (!name) {
                return res.status(400).json({ success: false, message: "Product name is required" });
            }
            if (perfume_type && !VALID_PERFUME_TYPES.includes(perfume_type)) {
                return res.status(400).json({ success: false, message: `perfume_type must be one of: ${VALID_PERFUME_TYPES.join(', ')}` });
            }
            if (perfume_for && !VALID_PERFUME_FOR.includes(perfume_for)) {
                return res.status(400).json({ success: false, message: `perfume_for must be one of: ${VALID_PERFUME_FOR.join(', ')}` });
            }

            const data = await product.Add_product({
                name,
                description,
                perfume_type,
                perfume_for,
            });
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in product controller:", err);
            rollbar.error("error occured in product controller:", err);
            res.status(500).json({ success: false, message: err.message || "Failed to add product" });
        }
    },

    GetAllProducts: async (req, res) => {
        const product = new Product_model();
        try {
            const data = await product.GetAll_products();
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in product controller:", err);
            rollbar.error("error occured in product controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch products" });
        }
    },

    GetProductById: async (req, res) => {
        const { id } = req.params;
        const product = new Product_model();
        try {
            const data = await product.Get_product_by_id(Number(id));
            if (!data) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in product controller:", err);
            rollbar.error("error occured in product controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch product" });
        }
    },

    DeleteProduct: async (req, res) => {
        const { id } = req.params;
        const product = new Product_model();
        const imageModel = new Product_image_model();
        try {
            const existing = await product.Get_product_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            const images = await imageModel.Get_images_by_product(id);
            await product.Delete_product(id);

            for (const img of images) {
                const filePath = path.join(__dirname, '..', img.image_url);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            res.status(200).json({ success: true, message: "Product deleted successfully" });
        } catch (err) {
            console.error("error occured in product controller:", err);
            rollbar.error("error occured in product controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete product" });
        }
    },

    UpdateProduct: async (req, res) => {
        const { id } = req.params;
        const { name, description, perfume_type, perfume_for } = req.body;
        const product = new Product_model();
        try {
            const existing = await product.Get_product_by_id(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            if (perfume_type && !VALID_PERFUME_TYPES.includes(perfume_type)) {
                return res.status(400).json({ success: false, message: `perfume_type must be one of: ${VALID_PERFUME_TYPES.join(', ')}` });
            }
            if (perfume_for && !VALID_PERFUME_FOR.includes(perfume_for)) {
                return res.status(400).json({ success: false, message: `perfume_for must be one of: ${VALID_PERFUME_FOR.join(', ')}` });
            }

            const fields = {};
            if (name !== undefined) fields.name = name;
            if (description !== undefined) fields.description = description;
            if (perfume_type !== undefined) fields.perfume_type = perfume_type;
            if (perfume_for !== undefined) fields.perfume_for = perfume_for;

            if (Object.keys(fields).length === 0) {
                return res.status(400).json({ success: false, message: "No fields to update" });
            }

            await product.Update_product(id, fields);
            const updated = await product.Get_product_by_id(id);
            res.status(200).json({ data: updated, success: true, message: "Product updated successfully" });
        } catch (err) {
            console.error("error occured in product controller:", err);
            rollbar.error("error occured in product controller:", err);
            res.status(500).json({ success: false, message: "Failed to update product" });
        }
    },

    AddVariant: async (req, res) => {
        const { product_id } = req.params;
        const { packaging_type, volume_ml, price, stock } = req.body;
        const product = new Product_model();

        try {
            const existing = await product.Get_product_by_id(Number(product_id));
            if (!existing) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            if (!packaging_type || !VALID_PACKAGING_TYPES.includes(packaging_type)) {
                return res.status(400).json({ success: false, message: `packaging_type must be one of: ${VALID_PACKAGING_TYPES.join(', ')}` });
            }
            if (!volume_ml || Number(volume_ml) <= 0) {
                return res.status(400).json({ success: false, message: "volume_ml is required and must be greater than 0" });
            }
            if (price === undefined || Number(price) < 0) {
                return res.status(400).json({ success: false, message: "price is required and must be 0 or greater" });
            }

            const data = await product.Add_variant({
                product_id: Number(product_id),
                packaging_type,
                volume_ml: Number(volume_ml),
                price: Number(price),
                stock: Number(stock) || 0,
            });
            res.status(200).json({ data, success: true, message: "Variant added successfully" });
        } catch (err) {
            console.error("error occured in product controller:", err);
            rollbar.error("error occured in product controller:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: "A variant with this packaging type and volume already exists for this product" });
            }
            res.status(500).json({ success: false, message: err.message || "Failed to add variant" });
        }
    },

    GetVariants: async (req, res) => {
        const { product_id } = req.params;
        const product = new Product_model();

        try {
            const data = await product.Get_variants_by_product(Number(product_id));
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in product controller:", err);
            rollbar.error("error occured in product controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch variants" });
        }
    },

    UpdateVariant: async (req, res) => {
        const { variant_id } = req.params;
        const { price, stock } = req.body;
        const product = new Product_model();

        try {
            const existing = await product.Get_variant_by_id(Number(variant_id));
            if (!existing) {
                return res.status(404).json({ success: false, message: "Variant not found" });
            }

            const fields = {};
            if (price !== undefined) fields.price = Number(price);
            if (stock !== undefined) fields.stock = Number(stock);

            if (Object.keys(fields).length === 0) {
                return res.status(400).json({ success: false, message: "No fields to update" });
            }

            await product.Update_variant(Number(variant_id), fields);
            const updated = await product.Get_variant_by_id(Number(variant_id));
            res.status(200).json({ data: updated, success: true, message: "Variant updated successfully" });
        } catch (err) {
            console.error("error occured in product controller:", err);
            rollbar.error("error occured in product controller:", err);
            res.status(500).json({ success: false, message: "Failed to update variant" });
        }
    },

    GetAllVariants: async (req, res) => {
        const product = new Product_model();

        try {
            const data = await product.Get_all_variants();
            res.status(200).json({ data, success: true });
        } catch (err) {
            console.error("error occured in product controller:", err);
            rollbar.error("error occured in product controller:", err);
            res.status(500).json({ success: false, message: "Failed to fetch all variants" });
        }
    },

    DeleteVariant: async (req, res) => {
        const { variant_id } = req.params;
        const product = new Product_model();

        try {
            const existing = await product.Get_variant_by_id(Number(variant_id));
            if (!existing) {
                return res.status(404).json({ success: false, message: "Variant not found" });
            }

            await product.Delete_variant(Number(variant_id));
            res.status(200).json({ success: true, message: "Variant deleted successfully" });
        } catch (err) {
            console.error("error occured in product controller:", err);
            rollbar.error("error occured in product controller:", err);
            res.status(500).json({ success: false, message: "Failed to delete variant" });
        }
    }
}

module.exports = Product_controller;
