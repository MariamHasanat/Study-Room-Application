// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ3W8NAM1ePgfafB_NHN_aWs0bjTdSJ9A",
  authDomain: "study-room-5d477.firebaseapp.com",
  projectId: "study-room-5d477",
  storageBucket: "study-room-5d477.firebasestorage.app",
  messagingSenderId: "302360508606",
  appId: "1:302360508606:web:0afe20f1b51e34cb6246ef",
  measurementId: "G-E4XNF0J924"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);