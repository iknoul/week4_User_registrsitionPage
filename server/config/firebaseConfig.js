const admin = require('firebase-admin');
const serviceAccount = require('./../firebase-adminsdk.json'); // Replace with your service account key file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com' // Optional, replace with your project's URL
});

const auth = admin.auth();
module.exports = { auth }
