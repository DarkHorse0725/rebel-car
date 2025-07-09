import * as admin from "firebase-admin"

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "pit-storage.firebasestorage.app"

});

export default admin;