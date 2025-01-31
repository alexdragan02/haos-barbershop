const express=require('express');
const {getServices,addServices}=require("../controller/serviceController");
const router=express.Router();


router.get('/',getServices);
router.post('/addServices',addServices);

module.exports=router;


