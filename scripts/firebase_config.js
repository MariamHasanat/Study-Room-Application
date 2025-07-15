import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkf3OZ4EbtKxQIAI3G7rcUVqmo4vuqDrY",
  authDomain: "food-delivery-app-5ff8e.firebaseapp.com",
  databaseURL: "https://food-delivery-app-5ff8e-default-rtdb.firebaseio.com",
  projectId: "food-delivery-app-5ff8e",
  storageBucket: "food-delivery-app-5ff8e.appspot.com",
  messagingSenderId: "686763843590",
  appId: "1:686763843590:web:707f001cd9528980b02387",
  measurementId: "G-5NPKN1SML3"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);