const express=require('express');
const {getAppointments,getAppointmentsByBarber,getAllAppointmentsForBarber,addAppointments,getAppointmentsByClient,deleteAppointment,updateAppointment}=require('../controller/appointmentController');


router=express.Router();
router.get('/getAppointments',getAppointments);
router.get("/getAppointmentsByBarber/:barberId/:date", getAppointmentsByBarber);
router.get("/getAllAppointmentsForBarber/:barberId", getAllAppointmentsForBarber);

router.post('/addAppointments',addAppointments);
router.get('/getAppointmentsByClient/:clientId',getAppointmentsByClient);
router.delete('/deleteAppointment/:appointmentId',deleteAppointment);
router.put('/updateAppointment/:appointmentId',updateAppointment)
module.exports=router;
