
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAEtUtjxJ2N5mmnEe0z8RQZ-BO0hrhI_LY",
    authDomain: "fir-bootcamp-2b328.firebaseapp.com",
    projectId: "fir-bootcamp-2b328",
    storageBucket: "fir-bootcamp-2b328.firebasestorage.app",
    messagingSenderId: "600889231577",
    appId: "1:600889231577:web:bca5d126208f4a2833d6c8",
    measurementId: "G-46G8VWPKW1"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const analytics = getAnalytics(app);