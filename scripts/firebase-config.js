// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDU2wGmk96T_R7wM96KlUVDBclDKSSmUJU",
  authDomain: "study-room-app-cff16.firebaseapp.com",
  projectId: "study-room-app-cff16",
  storageBucket: "study-room-app-cff16.firebasestorage.app",
  messagingSenderId: "839006387796",
  appId: "1:839006387796:web:efdcc8e98d7d6c480877c1",
  measurementId: "G-H8PMGT8GNY",
  databaseURL: "https://study-room-app-cff16-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);