const db=require("../config/firebase.js");

const getServices = async (req, res) => {
    try {
        const servicesRef = db.collection("services");
        const snapshot = await servicesRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "Nu exista servicii " });
        }

        const services = snapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data()
        }));

        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: "Eroare la preluarea serviciilor" });
    }
};

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

const updateServiceById = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const updatedData = req.body;

        if (!serviceId) {
            return res.status(400).json({ message: "ID serviciu necesar" });
        }

        const serviceRef = db.collection('services').doc(serviceId);
        const doc = await serviceRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Serviciul nu exista" });
        }

        updatedData.updatedAt = new Date().toISOString();

        await serviceRef.update(updatedData);
        res.status(200).json({ message: "Serviciu actualizat cu succes" });
    } catch (err) {
        console.error("Eroare la actualizarea serviciului", err);
        res.status(500).json({ message: "Eroare la actualizare serviciu" });
    }
};

const deleteServiceById = async (req, res) => {
    try {
        const { serviceId } = req.params;

        if (!serviceId) {
            return res.status(400).json({ message: "ID serviciu necesar" });
        }

        const serviceRef = db.collection('services').doc(serviceId);
        const doc = await serviceRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Serviciul nu exista" });
        }

        await serviceRef.delete();
        res.status(200).json({ message: "Serviciu sters cu succes" });
    } catch (err) {
        console.error("Eroare la stergerea serviciului", err);
        res.status(500).json({ message: "Eroare la stergere serviciu" });
    }
};

module.exports={getServices,addServices,updateServiceById,deleteServiceById};