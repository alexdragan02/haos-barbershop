const express=require('express');
const {getServices,addServices,updateServiceById,deleteServiceById}=require("../controller/serviceController");
const router=express.Router();


router.get('/',getServices);
router.post('/addServices',addServices);
router.put('/updateService/:serviceId', updateServiceById); 
router.delete('/deleteService/:serviceId', deleteServiceById); 

module.exports=router;


