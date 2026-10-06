const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Offer_controller = require('../controller/Offer_controller');
const requireAdmin = require('../requireAdmin');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', 'offers'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'offer-' + uniqueSuffix + ext);
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

router.post('/upload_offer_thumbnail', requireAdmin, upload.single('thumbnail'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file provided" });
    }
    const url = `/uploads/offers/${req.file.filename}`;
    res.status(200).json({ data: { url }, success: true, message: "Thumbnail uploaded successfully" });
});

router.post('/add_offer', requireAdmin, Offer_controller.AddOffer);
router.get('/offers', Offer_controller.GetAllOffers);
router.get('/offers_with_products', Offer_controller.GetOffersWithProducts);
router.put('/update_offer/:id', requireAdmin, Offer_controller.UpdateOffer);
router.delete('/delete_offer/:id', requireAdmin, Offer_controller.DeleteOffer);

router.get('/all_product_offers', Offer_controller.GetAllProductOffers);
router.post('/assign_offer', requireAdmin, Offer_controller.AssignOfferToProduct);
router.get('/product_offers/:product_id', Offer_controller.GetOffersByProduct);
router.get('/products_by_offer/:offer_id', Offer_controller.GetProductsByOffer);
router.delete('/remove_offer/:product_id/:offer_id', requireAdmin, Offer_controller.RemoveOfferFromProduct);

module.exports = router;
