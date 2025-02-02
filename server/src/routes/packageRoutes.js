const express=require('express');
const {getPackages,addPackages,updatePackageById,deletePackageById}=require('../controller/packageController');
const router=express.Router();

router.get('/getPackages',getPackages);
router.post('/addPackages',addPackages);
router.put('/updatePackage/:packageId', updatePackageById); 
router.delete('/deletePackage/:packageId', deletePackageById); 

module.exports=router;