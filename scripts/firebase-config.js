import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Your Firebase configuration using environment variables
export const firebaseConfig = {
    apiKey: "AIzaSyAXiDstBAV2CeXZIJeA0qwgUNk4F82HS2s",
    authDomain: "study-app-3450d.firebaseapp.com",
    projectId: "study-app-3450d",
    storageBucket: "study-app-3450d.firebasestorage.app",
    messagingSenderId: "81852673427",
    appId: "1:81852673427:web:6eeece40baabefc4c88c66",
    measurementId: "G-FZ038C29WJ",
    databaseURL: "https://study-app-3450d-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
