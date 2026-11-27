const express = require('express');
const router = express.Router();
const Address_controller = require('../controller/Address_controller');
const requireAuth = require('../requireAuth');

router.post('/add_address', requireAuth, Address_controller.AddAddress);
router.get('/address/default/:customer_id', requireAuth, Address_controller.GetDefaultAddress);
router.get('/address/:id', requireAuth, Address_controller.GetAddressById);
router.get('/addresses/:customer_id', requireAuth, Address_controller.GetAddressesByCustomer);
router.put('/update_address/:id', requireAuth, Address_controller.UpdateAddress);
router.put('/set_default_address/:customer_id/:address_id', requireAuth, Address_controller.SetDefault);
router.delete('/delete_address/:id', requireAuth, Address_controller.DeleteAddress);

module.exports = router;