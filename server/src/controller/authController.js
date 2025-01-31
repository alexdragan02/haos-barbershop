const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const db=require('../config/firebase');
const admin=require('firebase-admin');

const register= async  (req,res)=>{
    try{
        const {username,password, email,firstName,lastName,phoneNumber}=req.body;

    if(!username||!password||!email||!firstName||!lastName||!phoneNumber){
        return res.status(400).json({message:"completeaza toate campurile"});
    }

    const usersRef=db.collection('users');
    const snapshot=await usersRef.where('username','==',username).get();

    if(!snapshot.empty){
        return res.status(400).json({message:"foloseste alt nume"});

    }

    const role="client";

    const hashedPass=await bcrypt.hash(password,10);

    const newUser={
        username,
        email,
        password:hashedPass,
        firstName,
        lastName,
        role,phoneNumber,
        createdAt:admin.firestore.FieldValue.serverTimestamp()

    };
    await usersRef.add(newUser);

    res.status(201).json({message:"utilizator initializat cu succes"});
    }catch(err){
        return res.status(500).json({message:"eroare la inregistrare client"});
    }

}

const registerBarber= async  (req,res)=>{
    try{
        const {username,password, email,firstName,lastName,phoneNumber}=req.body;

    if(!username||!password||!email||!firstName||!lastName||!phoneNumber){
        return res.status(400).json({message:"completeaza toate campurile"});
    }

    const usersRef=db.collection('users');
    const snapshot=await usersRef.where('username','==',username).get();

    if(!snapshot.empty){
        return res.status(400).json({message:"foloseste alt nume"});

    }


    const hashedPass=await bcrypt.hash(password,10);

    const newUser={
        username,
        email,
        password:hashedPass,
        firstName,
        lastName,
        role:"barber",
        phoneNumber,
        available:true,
        createdAt:admin.firestore.FieldValue.serverTimestamp()

    };
    await usersRef.add(newUser);

    res.status(201).json({message:"utilizator initializat cu succes"});
    }catch(err){
        return res.status(500).json({message:"eroare la inregistrare client"});
    }

}


const login= async (req,res)=>{
    try{
    const {email,password}=req.body;

    if(!password||!email){
        return res.status(400).json({message:"introduceti date obligatoriu"})
    }
    const usersRef=db.collection('users');
    const snapshot= await usersRef
    .where('email','==',email)
    .get();


    if(snapshot.empty){
        return res.status(401).json({message:"mail sau parola gresita"});
    }

    const userDoc=snapshot.docs[0];
    const user=userDoc.data();

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({message:"parola gresita"});

    }

    const token=jwt.sign({id:userDoc.id,role:user.role},
        process.env.JWT_SECRET,{expiresIn:'1h'});

    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        maxAge:3600000
    })


    res.json({token,userId:userDoc.id,firstName:user.firstName,lastName:user.lastName,role:user.role,phoneNumber:user.phoneNumber});}
    catch(err){
        return res.status(500).json({message:"s a produs o eroare la login"});
    }
}



module.exports={register,registerBarber,login};