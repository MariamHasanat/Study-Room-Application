
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCckyD2uckeVLTahstOQHgTegvXt0FFR84",
    authDomain: "fir-bootcamp-26e6c.firebaseapp.com",
    projectId: "fir-bootcamp-26e6c",
    storageBucket: "fir-bootcamp-26e6c.firebasestorage.app",
    messagingSenderId: "1069259462287",
    appId: "1:1069259462287:web:c4134bef00abc0e52a82fa",
    measurementId: "G-KVCSJ7EF6R"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
