const db=require("../config/firebase.js");

const getServices=async (req,res)=>{
    
    const servicesRef=db.collection('services');
    const snapshot=await servicesRef.get();

    if(snapshot.empty){
        res.status(404).json({message:"Nu exista serv"});

    }

    const services=snapshot.docs.map(doc=>({id:doc.id, ...doc.data()}));

    res.status(200).json(services);
}


const addServices=async (req,res)=>{
    const {serviceId,name,price,duration,details}=req.body;
    if(!name||!duration||!price)    {
      return  res.status(400).json({message:"something is missing fill"});
       }


    const servicesRef=db.collection('services');
    const snapshot=await servicesRef.where('name','==',name).get();

    if(!snapshot.empty){
       return res.status(400).json({message:"exista deja acest serviciu in bd"});
    }
   


    const newService={
        serviceId,
        name,
        price,
        duration,
        details,
    }
    
    await servicesRef.add(newService);

    res.status(201).json({message:"serviciu adaugat cu success"});

}



module.exports={getServices,addServices};