const express=require('express');
const {login,register, registerBarber, getUsers}=require("../controller/authController");
const router=express.Router();

router.post('/register',register);
router.post('/registerBarber',registerBarber);
router.post('/login',login);
router.get('/getUsers',getUsers);

module.exports=router;