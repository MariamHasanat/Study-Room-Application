// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd12tytbQ9LHOhsEgxqkp1TOQyaFfDV2o",
  authDomain: "basilfierbase.firebaseapp.com",
  projectId: "basilfierbase",
  storageBucket: "basilfierbase.firebasestorage.app",
  messagingSenderId: "4043824972",
  appId: "1:4043824972:web:87ca2a81c86066167279e9",
  databaseURL: "https://basilfierbase-default-rtdb.firebaseio.com/",
  measurementId: "G-3F5Z1V9K6E",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
