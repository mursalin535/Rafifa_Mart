const express = require('express');
const router = express.Router();
const Product_controller = require('../controller/Product_controller');
const requireAdmin = require('../requireAdmin');

router.post('/add_product', requireAdmin, Product_controller.AddProduct);
router.get('/products', Product_controller.GetAllProducts);
router.get('/product/:id', Product_controller.GetProductById);
router.put('/update_product/:id', requireAdmin, Product_controller.UpdateProduct);
router.delete('/delete_product/:id', requireAdmin, Product_controller.DeleteProduct);

router.get('/all_variants', Product_controller.GetAllVariants);
router.post('/product/:product_id/variant', requireAdmin, Product_controller.AddVariant);
router.get('/product/:product_id/variants', Product_controller.GetVariants);
router.put('/update_variant/:variant_id', requireAdmin, Product_controller.UpdateVariant);
router.delete('/delete_variant/:variant_id', requireAdmin, Product_controller.DeleteVariant);

module.exports = router;
