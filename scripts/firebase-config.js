// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyAVdOLPOoPUz8PEaP2xZCA5AGxBD81_NUU",
  authDomain: "study-room-application-alaa.firebaseapp.com",
  projectId: "study-room-application-alaa",
  storageBucket: "study-room-application-alaa.firebasestorage.app",
  messagingSenderId: "519686424338",
  appId: "1:519686424338:web:5caf1c4a302a5f4a4955cb",
  measurementId: "G-SPJBY7ZHPM",
  databaseURL: "https://study-room-application-alaa-default-rtdb.firebaseio.com/"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
