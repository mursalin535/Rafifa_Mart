const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product_image_controller = require('../controller/Product_image_controller');
const requireAdmin = require('../requireAdmin');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', 'products'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'product-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/all_product_images', Product_image_controller.GetAllProductImages);
router.post('/upload_image/:product_id', requireAdmin, upload.single('image'), Product_image_controller.UploadImage);
router.get('/product_images/:product_id', Product_image_controller.GetImages);
router.put('/set_primary_image/:id', requireAdmin, Product_image_controller.SetPrimary);
router.delete('/delete_image/:id', requireAdmin, Product_image_controller.DeleteImage);

module.exports = router;
