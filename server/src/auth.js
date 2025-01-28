const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const verifyToken=require("./middleware/verifyToken")
const router=express.Router();
const db=require('./firebase');
const admin=require('firebase-admin');

router.post('/register',async  (req,res)=>{
    const {username,password}=req.body;

    const usersRef=db.collection('users');
    const snapshot=await usersRef.where('username','==',username).get();

    if(!snapshot.empty){
        return res.status(400).json({message:"foloseste alt nume"});

    }


    const hashedPass=await bcrypt.hash(password,10);

    const newUser={
        username,
        password:hashedPass,
        createdAt:admin.firestore.FieldValue.serverTimestamp()

    };
    await usersRef.add(newUser);

    res.status(201).json({message:"utilizator initializat cu succes"});


})

router.post('/login', async (req,res)=>{
    const {username,password}=req.body;

    
    const usersRef=db.collection('users');
    const snapshot= await usersRef.where('username','==',username).get();


    if(snapshot.empty){
        return res.status(401).json({message:"utiliz sau parola gresita"});
    }

    const userDoc=snapshot.docs[0];
    const user=userDoc.data();

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({message:"parola gresita"});

    }

    const token=jwt.sign({id:user.id,username:user.username},process.env.JWT_SECRET,{expiresIn:'1h'});

    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        maxAge:3600000
    })


    res.json({token});
})


router.get('protected',verifyToken,(req,res)=>{
    res.json({
        message:'merge merge tokenul',
        user:req.user,
    })
})


module.exports=router;