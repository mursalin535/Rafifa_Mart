const express = require('express');
const router = express.Router();
const Rating_controller = require('../controller/Rating_controller');
const requireAdmin = require('../requireAdmin');

router.post('/add_rating', Rating_controller.AddRating);
router.get('/ratings/:product_id', Rating_controller.GetRatingsByProduct);
router.get('/all_ratings', requireAdmin, Rating_controller.GetAllRatings);
router.delete('/delete_rating/:id', requireAdmin, Rating_controller.DeleteRating);

module.exports = router;
