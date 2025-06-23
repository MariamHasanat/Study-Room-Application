// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVdOLPOoPUz8PEaP2xZCA5AGxBD81_NUU",
  authDomain: "study-room-application-alaa.firebaseapp.com",
  projectId: "study-room-application-alaa",
  storageBucket: "study-room-application-alaa.firebasestorage.app",
  messagingSenderId: "519686424338",
  appId: "1:519686424338:web:5caf1c4a302a5f4a4955cb",
  measurementId: "G-SPJBY7ZHPM",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
