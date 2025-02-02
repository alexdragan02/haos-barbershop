const db = require('../config/firebase.js');
const { faker } = require('@faker-js/faker');



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
const getAppointmentsByBarber = async (req, res) => {
    try {
      const { barberId, date } = req.params;
      console.log("Barber ID:", barberId, "Date:", date);
  
      if (!barberId || !date) {
        return res.status(400).json({ message: "Barber Id si data necesare" });
      }
  
      const appointmentsRef = db.collection("appointments");
      const snapshot = await appointmentsRef
        .where("barberId", "==", barberId)
        .where("date", "==", date)
        .get();
  
      if (snapshot.empty) {
        return res.status(200).json({ appointments: [] });
      }
  
      const appointments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.status(200).json({ appointments });
    } catch (err) {
      console.error(" eroare la preluarea prog", err);
      res.status(500).json({ message: "eroare la preluarea prog" });
    }
  };
  const getAllAppointmentsForBarber = async (req, res) => {
    try {
        const { barberId } = req.params;
        console.log("📅 Barber ID:", barberId);

        if (!barberId) {
            return res.status(400).json({ message: "ID-ul frizerului este necesar" });
        }

        const appointmentsRef = db.collection("appointments");
        const snapshot = await appointmentsRef
            .where("barberId", "==", barberId)
            .get();

        if (snapshot.empty) {
            return res.status(200).json({ appointments: [] });
        }

        const appointments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json({ appointments });
    } catch (err) {
        console.error("eroare!!!", err);
        res.status(500).json({ message: "erroare !!!" });
    }
};
  
const addAppointments = async (req, res) => {
    try {
        const { clientId, barberId, serviceId, packageId, date, timeSlot } = req.body;

        if (!clientId || !barberId || !date || !timeSlot || (!serviceId && !packageId)) {
            return res.status(400).json({ message: "Completeaza  toate campurile!" });
        }
        const clientDoc = await db.collection('users').doc(clientId).get();
        if (!clientDoc.exists) {
            return res.status(400).json({ message: "Clientul nu exista!!!" });
        }
        const clientData = clientDoc.data();

        const barberDoc = await db.collection('users').doc(barberId).get();
        if (!barberDoc.exists || barberDoc.data().role !== "barber") {
            return res.status(400).json({ message: "Frizerul nu exista" });
        }
        const barberData = barberDoc.data(); 

        const appointmentsRef = db.collection('appointments');
        const existingAppointments = await appointmentsRef
            .where("barberId", "==", barberId)
            .where("date", "==", date)
            .where("timeSlot", "==", timeSlot)
            .get();

        if (!existingAppointments.empty) {
            return res.status(400).json({ message: "Exista deja o programare la aceasta ora!!!" });
        }

        let totalPrice = 0;
        let totalDuration = 0;
        let serviceOrPackageData = null;

        if (serviceId) {
            const serviceDoc = await db.collection('services').doc(serviceId).get();
            if (!serviceDoc.exists) {
                return res.status(400).json({ message: "Serviciul nu exista" });
            }
            serviceOrPackageData = serviceDoc.data();
            totalPrice = serviceOrPackageData.price;
            totalDuration = serviceOrPackageData.duration;
        } else if (packageId) {
            const packageDoc = await db.collection('packages').doc(packageId).get();
            if (!packageDoc.exists) {
                return res.status(400).json({ message: "Pachetul nu exista" });
            }
            serviceOrPackageData = packageDoc.data();
            totalPrice = serviceOrPackageData.finalPrice;
            totalDuration = serviceOrPackageData.totalDuration;
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
        res.status(201).json({ message: "Programarea a fost adaugata cu success", newAppointment });

    } catch (err) {
        console.error("Eroare la adaugare programare", err);
        res.status(500).json({ message: "eroare la adaugare programare" });
    }
};
const getAppointmentsByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        console.log("Client ID:", clientId); // ✅ Debugging

        if (!clientId) {
            console.log("nu exista id ul clientului");
            return res.status(400).json({ message: "nu exista id client" });
        }

        const appointmentsRef = db.collection('appointments');
        const snapshot = await appointmentsRef.where("clientId", "==", clientId).get();

        if (snapshot.empty) {
            console.log("Nu exista programari", clientId);
            return res.status(404).json({ message: "Nu exista programari" });
        }

        const appointments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json({ appointments });

    } catch (err) {
        console.error("eroare get programari", err);
        res.status(500).json({ message: "eroare la get programari" });
    }
};






const deleteAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).json({ message: "nu exista id ul programarii" });
        }

        const appointmentRef = db.collection('appointments').doc(appointmentId);
        const doc = await appointmentRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Programarea nu exista" });
        }

        await appointmentRef.delete();
        res.status(200).json({ message: "programarea a fost stearsa cu success!!!" });

    } catch (err) {
        console.error("eroare la stergerea programarii:", err);
        res.status(500).json({ message: "eroare la stergerea prog" });
    }
};
const updateAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { date, timeSlot, barberId, serviceId, packageId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ message: "AppointmentId e necesar!!!!" });
        }

        const appointmentRef = db.collection('appointments').doc(appointmentId);
        const appointmentDoc = await appointmentRef.get();

        if (!appointmentDoc.exists) {
            return res.status(404).json({ message: "Programarea nu exista!!!!" });
        }

        let updatedData = {
            date,
            timeSlot,
            barberId,
            serviceId,
            packageId,
        };

        if (barberId) {
            const barberDoc = await db.collection('users').doc(barberId).get();
            if (barberDoc.exists) {
                const barberData = barberDoc.data();
                updatedData.barberName = `${barberData.firstName} ${barberData.lastName}`;
                updatedData.barberPhone = barberData.phoneNumber;
            } else {
                return res.status(400).json({ message: "Frizerul selectat nu exista" });
            }
        }

        let totalDuration = 0;
        let totalPrice = 0;
        if (serviceId) {
            const serviceDoc = await db.collection('services').doc(serviceId).get();
            if (serviceDoc.exists) {
                const serviceData = serviceDoc.data();
                updatedData.serviceName = serviceData.name;
                totalDuration = serviceData.duration;
                totalPrice = serviceData.price;
            } else {
                return res.status(400).json({ message: "Serviciul selectat nu exista" });
            }
        } else if (packageId) {
            const packageDoc = await db.collection('packages').doc(packageId).get();
            if (packageDoc.exists) {
                const packageData = packageDoc.data();
                updatedData.packageName = packageData.name;
                totalDuration = packageData.totalDuration;
                totalPrice = packageData.finalPrice;
            } else {
                return res.status(400).json({ message: "Pachetul selectat nu exista" });
            }
        }

        if (timeSlot) {
            const [hours, minutes] = timeSlot.split(":").map(Number);
            const finishTime = new Date(date);
            finishTime.setHours(hours);
            finishTime.setMinutes(minutes + totalDuration);
            updatedData.finishTime = finishTime.toTimeString().slice(0, 5);
        }

        updatedData.totalDuration = totalDuration;
        updatedData.totalPrice = totalPrice;

        await appointmentRef.update(updatedData);

        res.status(200).json({ message: "Programarea a fost actualizata cu success!!!", updatedData });

    } catch (err) {
        console.error("Eroare la actualizare!!!", err);
        res.status(500).json({ message: "Eroare la actualizarea programarii" });
    }
};



const generateAppointments = async (req, res) => {
    try {
        const count = req.body.count || 20; 
        const appointmentsRef = db.collection('appointments');
        const usersRef = db.collection('users');
        const servicesRef = db.collection('services');

        const barbersSnapshot = await usersRef.where("role", "==", "barber").get();
        const clientsSnapshot = await usersRef.where("role", "==", "client").get();
        const servicesSnapshot = await servicesRef.get();

        if (barbersSnapshot.empty || clientsSnapshot.empty || servicesSnapshot.empty) {
            return res.status(400).json({ message: "Nu exista frizeri sau clienti sau servicii in baza de date." });
        }

        const barbers = barbersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const clients = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log("Barbers list:", barbers);
        console.log("Clients list:", clients);
        console.log("Services list:", services);

        for (let i = 0; i < count; i++) {
            const randomBarber = faker.helpers.arrayElement(barbers);
            const randomClient = faker.helpers.arrayElement(clients);
            const randomService = faker.helpers.arrayElement(services);

            if (!randomBarber || !randomClient || !randomService) {
                console.error("Eroare nu sunt frizeri servicii sau clienti disponibili");
                continue;
            }

            const date = faker.date.future();
            const timeSlot = `${faker.number.int({ min: 9, max: 17 })}:${faker.helpers.arrayElement(["00", "30"])}`;

            const [hours, minutes] = timeSlot.split(":").map(Number);
            const finishTime = new Date(date);
            finishTime.setHours(hours);
            finishTime.setMinutes(minutes + randomService.duration);
            const formattedFinishTime = finishTime.toTimeString().slice(0, 5);

            const appointment = {
                clientId: randomClient.id,
                clientName: `${randomClient.firstName} ${randomClient.lastName}`,
                clientPhone: randomClient.phoneNumber,

                barberId: randomBarber.id,
                barberName: `${randomBarber.firstName} ${randomBarber.lastName}`,
                barberPhone: randomBarber.phoneNumber,

                serviceId: randomService.id,
                serviceName: randomService.name,
                packageId: null,
                packageName: null,

                date: date.toISOString().split("T")[0],
                timeSlot,
                finishTime: formattedFinishTime,
                totalPrice: randomService.price,
                totalDuration: randomService.duration,
                status: faker.helpers.arrayElement(["pending", "confirmed", "completed"]),
                createdAt: new Date().toISOString(),
            };

            await appointmentsRef.add(appointment);
        }

        res.status(201).json({ message: `${count} programari generate ` });
    } catch (err) {
        console.error("Eroare la generare programari:", err);
        res.status(500).json({ message: "Eroare la generare programari" });
    }
};



module.exports = { getAppointments,getAppointmentsByBarber,getAllAppointmentsForBarber, 
    addAppointments,getAppointmentsByClient,deleteAppointment,updateAppointment,generateAppointments };
