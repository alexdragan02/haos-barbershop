const express=require('express');
const {login,register, registerBarber}=require("../controller/authController");
const router=express.Router();

router.post('/register',register);
router.post('/registerBarber',registerBarber);
router.post('/login',login);

module.exports=router;