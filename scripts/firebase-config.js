// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDU2wGmk96T_R7wM96KlUVDBclDKSSmUJU",
  authDomain: "study-room-app-cff16.firebaseapp.com",
  projectId: "study-room-app-cff16",
  storageBucket: "study-room-app-cff16.firebasestorage.app",
  messagingSenderId: "839006387796",
  appId: "1:839006387796:web:efdcc8e98d7d6c480877c1",
  measurementId: "G-H8PMGT8GNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);