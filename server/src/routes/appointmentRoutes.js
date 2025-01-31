const express=require('express');
const {getAppointments,addAppointments}=require('../controller/appointmentController');


router=express.Router();
router.get('/getAppointments',getAppointments);
router.post('/addAppointments',addAppointments);

module.exports=router;
