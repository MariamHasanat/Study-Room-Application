import { auth, firestore, GoogleAuthProvider } from './firebase-init.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
  const provider = new GoogleAuthProvider();
  const googleBtn = document.getElementById("google-btn");

  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(firestore, "users", user.uid); // استخدم UID بدلاً من الإيميل لتفادي المشاكل
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString()
        }, { merge: true });

        localStorage.setItem('user', JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }));

        window.location.href = "../pages/home.html";
      } catch (error) {
        console.error("Google sign-in failed:", error);
        alert("فشل تسجيل الدخول بحساب Google: " + error.message);
      }
    });
  } else {
    console.warn("زر تسجيل دخول Google غير موجود في الصفحة.");
  }
});