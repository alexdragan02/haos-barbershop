const db=require('../config/firebase.js');


const getPackages = async (req, res) => {
    try {
        const packagesRef = db.collection("packages");
        const snapshot = await packagesRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "Nu exista pachete" });
        }

        const packages = snapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data()
        }));

        res.status(200).json(packages);
    } catch (err) {
        res.status(500).json({ message: "Eroare la preluarea pachetelor" });
    }
};

module.exports = { getPackages };


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
const updatePackageById = async (req, res) => {
    try {
        const { packageId } = req.params;
        const updatedData = req.body;

        if (!packageId) {
            return res.status(400).json({ message: "ID pachet necesar" });
        }

        const packageRef = db.collection('packages').doc(packageId);
        const doc = await packageRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Pachetul nu exista" });
        }

        updatedData.metadata = {
            ...doc.data().metadata,
            updatedAt: new Date().toISOString(),
        };

        await packageRef.update(updatedData);

        res.status(200).json({ message: "Pachet actualizat cu succes" });
    } catch (err) {
        console.error("Eroare la actualizarea pachetului", err);
        res.status(500).json({ message: "Eroare la actualizare pachet" });
    }
};

const deletePackageById = async (req, res) => {
    try {
        const { packageId } = req.params;

        if (!packageId) {
            return res.status(400).json({ message: "ID pachet necesar" });
        }

        const packageRef = db.collection('packages').doc(packageId);
        const doc = await packageRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Pachetul nu exista" });
        }

        await packageRef.delete();
        res.status(200).json({ message: "Pachet sters cu succes" });
    } catch (err) {
        console.error("Eroare la stergerea pachetului", err);
        res.status(500).json({ message: "Eroare la stergere pachet" });
    }
};
module.exports={getPackages,addPackages,updatePackageById,deletePackageById};