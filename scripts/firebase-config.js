// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsZ1kECnwN7UeR3Z30faVC0KcCs1U3D5E",
  authDomain: "study-room-ea8ca.firebaseapp.com",
  projectId: "study-room-ea8ca",
  storageBucket: "study-room-ea8ca.firebasestorage.app",
  messagingSenderId: "35516750398",
  appId: "1:35516750398:web:8edd38791d1213d00c0f6f",
  measurementId: "G-3Z1F5K7E4H",
  databaseURL: "https://study-room-ea8ca-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export default app;
