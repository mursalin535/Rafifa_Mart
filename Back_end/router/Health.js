const express=require('express');
const router=express.Router();
const Health_controller=require('../controller/Health_controller')

router.get('/',Health_controller);

module.exports=router;