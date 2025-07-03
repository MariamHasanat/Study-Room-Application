// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { process as x } from "./secrets.env.mjs";
import {
    getAuth,
    GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: x.env.FIREBASE_API_KEY,
    authDomain: x.env.FIREBASE_AUTH_DOMAIN,
    projectId: x.env.FIREBASE_PROJECT_ID,
    storageBucket: x.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: x.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: x.env.FIREBASE_APP_ID,
    databaseURL: x.env.FIREBASE_DATABASE_URL,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app); // For Realtime Database - Time series database
export const firestore = getFirestore(app); // For Firestore Database - Document Database
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // For Google Authentication
