const admin=require("firebase-admin");

const serviceAccount=require("./haos-barbershop-firebase-adminsdk-fbsvc-89007e0901.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:"https://haos-barbershop.firebaseio.com" 
});

const db=admin.firestore();

module.exports=db;