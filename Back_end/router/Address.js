const express = require('express');
const router = express.Router();
const Address_controller = require('../controller/Address_controller');

router.post('/add_address', Address_controller.AddAddress);
router.get('/address/:id', Address_controller.GetAddressById);
router.get('/addresses/:customer_id', Address_controller.GetAddressesByCustomer);
router.get('/address/default/:customer_id', Address_controller.GetDefaultAddress);
router.put('/update_address/:id', Address_controller.UpdateAddress);
router.put('/set_default_address/:customer_id/:address_id', Address_controller.SetDefault);
router.delete('/delete_address/:id', Address_controller.DeleteAddress);
router.delete('/delete_addresses/:customer_id', Address_controller.DeleteAllAddresses);

module.exports = router;
