const express=require('express');
const {login,register, registerBarber, getUsers,updateUserById,deleteUserById}=require("../controller/authController");
const router=express.Router();

router.post('/register', register);
router.post('/registerBarber', registerBarber);
router.post('/login', login);
router.get('/getUsers', getUsers);
router.put('/updateUser/:userId', updateUserById);
router.delete('/deleteUser/:userId', deleteUserById); 
module.exports=router;