import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMOlVGRnfwTCa83YpF4gUpbYYMu4jMnBA",
    authDomain: "study-room-application.firebaseapp.com",
    projectId: "study-room-application",
    storageBucket: "study-room-application.firebasestorage.app",
    messagingSenderId: "102691908238",
    appId: "1:102691908238:web:b4d54c3fb01d5e0ca077df",
    measurementId: "G-DW46LFLGB3",
    databaseURL: "https://study-room-application-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const firestore = getFirestore(app);
