const { app } = require('firebase-admin');
const db=require('../config/firebase.js');


const getAppointments =async(req,res)=>{
    try{
        const appointmentsRef=db.collection('appointments');
        const snapshot=await appointmentsRef.get();

        if(snapshot.empty){
            res.status(404).json({message:"nu s au gasit programari"});

        }

        const appointments=snapshot.docs.map(doc=>({id:doc.id,...doc.data()}));
        res.status(200).json({appointments});
    }catch(err){
        res.status(500).json({message:"eroare la preluarea programarilor"});
    }
}


const addAppointments=async (req,res)=>{
    try{
        const{clientId,barberId,serviceId,packageId,date,timeSlot}=req.body;

        if(!clientId||!barberId||!date||!timeSlot||(!serviceId&&!packageId)){
            return res.status(400).json({message:"toate campurile sunt obligatorii"});

        }

        //are programare?
        const appointmentsRef=db.collection('appointments');
        const existingAppointments=await appointmentsRef
        .where("barberId","==",barberId)
        .where("date","==",date)
        .where("timeSlot","==",barberId)
        .where("barberId","==",timeSlot)
        .get();

        if(!existingAppointments.empty){
            return res.status(400).json({message:"exista deja programare la acea ora"});

        }

        const newAppointment={
            clientId,
            barberId,
            serviceId:serviceId,
            packageId:packageId||null,
            date,
            timeSlot,
            price,
            status:"pending",
            createdAt:new Date().toISOString,
        };

        await appointmentsRef.add(newAppointment);
        res.status(201).json({message:"s a facut programarea cu success"});



    }catch(err){
        res.status(500).json({message:"s a produs o eroare la adaugarea PROGRAMARII"});
    }
}


module.exports={getAppointments,addAppointments};