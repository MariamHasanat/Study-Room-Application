  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCjo5M4c309ftV8RJu0auey4JiVJ7Wmclc",
    authDomain: "fir-bootcamp-80fbf.firebaseapp.com",
    projectId: "fir-bootcamp-80fbf",
    storageBucket: "fir-bootcamp-80fbf.firebasestorage.app",
    messagingSenderId: "800186260248",
    appId: "1:800186260248:web:7a553d12979dc717449c6d",
    measurementId: "G-G9S92GR74Y"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
 export const analytics = getAnalytics(app);
