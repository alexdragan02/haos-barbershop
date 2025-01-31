const express=require('express');
const {getPackages,addPackages}=require('../controller/packageController');
const router=express.Router();

router.get('/getPackages',getPackages);
router.post('/addPackages',addPackages);

module.exports=router;