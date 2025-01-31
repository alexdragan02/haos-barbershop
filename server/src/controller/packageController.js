const db=require('../config/firebase.js');

const getPackages=async (req,res)=>{
    try{
        const packagesRef=db.collection('packages');
    const snapshot=await packagesRef.get();

    if(snapshot.empty){
       return  res.status(404).json({message:"nu exista pachete inca"});
    }

    const packages=snapshot.docs.map(doc=>({id:doc.id, ...doc.data()}));

    res.status(200).json(packages);
    }catch(err){
        res.status(500).json({message:"eroare la preluarea pachetelor"});

    }
}

const addPackages=async (req,res)=>{
    try{
        const {packageId,name,serviceIds,discount}=req.body;

        if (!name || !Array.isArray(serviceIds) || serviceIds.length === 0) {
            
        return res.status(400).json({message:"exista deja packetul"});
    }

    const packagesRef=db.collection('packages');
    
    const servicesRef=db.collection('services');
    const snapshot=await servicesRef.where("serviceId","in",serviceIds).get();

    if(snapshot.empty){
        res.status(400).json({message:"nu e un serviciu valid"});
    }

    const serviceDocs=snapshot.docs.map(doc=>({
        serviceId:doc.data().serviceId,
        name:doc.data().name,
        price:doc.data().price,
        duration:doc.data().duration,

    }));
    

    const totalPrice=serviceDocs.reduce((sum,service)=>sum+service.price,0);
    const totalDuration=serviceDocs.reduce((sum,service)=>sum+service.duration,0);
    const finalPrice = discount ? totalPrice - (totalPrice * (discount / 100)) : totalPrice;



    const newPack={
        packageId,
        name,
        totalPrice,
        totalDuration,
        finalPrice,
        services:serviceDocs,
        metadata:{
            createdAt:new Date().toISOString(),
            updatedAt:new Date().toISOString()
        }
    };

    await packagesRef.add(newPack);
    res.status(201).json({message:"ai adaugat un pachet nou"});
}catch(err){
    res.status(500).json({message:"eroare la adaugare", err});
    }
}

module.exports={getPackages,addPackages};