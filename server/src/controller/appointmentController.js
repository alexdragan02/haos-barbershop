const db = require('../config/firebase.js');

const getAppointments = async (req, res) => {
    try {
        const appointmentsRef = db.collection('appointments');
        const snapshot = await appointmentsRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "nu am gasit programari" });
        }

        const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ appointments });

    } catch (err) {
        res.status(500).json({ message: "s a produs o eroare la preluare programarilor" });
    }
};

const addAppointments = async (req, res) => {
    try {
        const { clientId, barberId, serviceId, packageId, date, timeSlot } = req.body;

        if (!clientId || !barberId || !date || !timeSlot || (!serviceId && !packageId)) {
            return res.status(400).json({ message: "completeaza toate campurile" });
        }

        const clientDoc = await db.collection('users').doc(clientId).get();
        const barberDoc = await db.collection('users').doc(barberId).get();

        if (!clientDoc.exists) {
            return res.status(400).json({ message: "nu exista clientul" });
        }
        if (!barberDoc.exists || barberDoc.data().role !== "barber") {
            return res.status(400).json({ message: "nu exista barberul" });
        }

        const appointmentsRef = db.collection('appointments');
        const existingAppointments = await appointmentsRef
            .where("barberId", "==", barberId)
            .where("date", "==", date)
            .where("timeSlot", "==", timeSlot)
            .get();

        if (!existingAppointments.empty) {
            return res.status(400).json({ message: "Exista o programare la ora erspectiva" });
        }

        let totalPrice = 0;
        let totalDuration = 0;

        if (serviceId) {
            const serviceDoc = await db.collection('services').doc(serviceId).get();
            if (!serviceDoc.exists) {
                return res.status(400).json({ message: "nu exista serviciul" });
            }
            const service = serviceDoc.data();
            totalPrice = service.price;
            totalDuration = service.duration;
        } else if (packageId) {
            const packageDoc = await db.collection('packages').doc(packageId).get();
            if (!packageDoc.exists) {
                return res.status(400).json({ message: "nu exista pachetul" });
            }
            const packageData = packageDoc.data();
            totalPrice = packageData.finalPrice;
            totalDuration = packageData.totalDuration;
        }

        const [hours, minutes] = timeSlot.split(":").map(Number);
        const finishTime = new Date(date);
        finishTime.setHours(hours);
        finishTime.setMinutes(minutes + totalDuration);
        const formattedFinishTime = finishTime.toTimeString().slice(0, 5); 

        const newAppointment = {
            clientId,
            clientName: `${clientData.firstName} ${clientData.lastName}`,
            clientPhone: clientData.phoneNumber,
        
            barberId,
            barberName: `${barberData.firstName} ${barberData.lastName}`,
            barberPhone: barberData.phoneNumber,
        
            serviceId: serviceId || null,
            serviceName: serviceId ? serviceOrPackageData.name : null,
            packageId: packageId || null,
            packageName: packageId ? serviceOrPackageData.name : null,
        
            date,
            timeSlot,
            finishTime: formattedFinishTime,
            totalPrice,
            totalDuration,
            status: "pending",
            createdAt: new Date().toISOString()
        };
        
        await appointmentsRef.add(newAppointment);
        res.status(201).json({ message: "Programarea a fost creata", newAppointment });

    } catch (err) {
        console.error("eroare la adaugarea programarii", err);
        res.status(500).json({ message: "exista o eroare la adaugarea programarii" });
    }
};
module.exports = { getAppointments, addAppointments };
