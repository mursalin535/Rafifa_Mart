const express = require('express');
const router = express.Router();
const Bottle_controller = require('../controller/Bottle_controller');
const requireAdmin = require('../requireAdmin');

router.post('/add_bottle', requireAdmin, Bottle_controller.AddBottle);
router.get('/bottles', Bottle_controller.GetAllBottles);
router.put('/update_bottle/:id', requireAdmin, Bottle_controller.UpdateBottle);
router.delete('/delete_bottle/:id', requireAdmin, Bottle_controller.DeleteBottle);

module.exports = router;
