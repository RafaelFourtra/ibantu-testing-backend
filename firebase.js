// firebaseClient.js
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCzL8DkP70Cc1T6PEM1Nf0qwTrS0L-UaG0",
  authDomain: "employmentcareconsultanc-d5063.firebaseapp.com",
  projectId: "employmentcareconsultanc-d5063",
  storageBucket: "employmentcareconsultanc-d5063.appspot.com",
  messagingSenderId: "709009011512",
  appId: "1:709009011512:web:b5c83b8be18ad6f0a487cd",
  measurementId: "G-YC92RTFXST"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Ekspor Auth dan Firestore jika dibutuhkan
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { app, auth, db };
