To add **Firebase Authentication** (using Firebase Auth) for user sign-up and login, you need to:

1. **Enable Authentication in Firebase Console**  
   - Go to your Firebase project > Authentication > Sign-in method.
   - Enable "Email/Password".

2. **Update your frontend code to use Firebase Auth methods**  
   - Use `createUserWithEmailAndPassword` for sign-up.
   - Use `signInWithEmailAndPassword` for login.

---

## Example: Add Firebase Auth to Your App

### 1. Import Auth SDK in your JS files

```javascript
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { app } from "./firebase-config.js";
const auth = getAuth(app);
```

---

### 2. Update signup.js

Replace your Firestore-only sign-up logic with:

```javascript
// ...existing code...
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { app, firestore } from "./firebase-config.js";
const auth = getAuth(app);

// In your form submit handler:
try {
  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Optionally, store extra info in Firestore
  const userRef = doc(firestore, "users", email);
  await setDoc(userRef, {
    name,
    email,
    createdAt: new Date().toISOString()
  });
  alert("Account created successfully.");
  window.location.href = "../pages/login.html";
} catch (error) {
  alert(error.message);
}
```

---

### 3. Update login.js

Replace your Firestore-only login logic with:

```javascript
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { app, firestore } from "./firebase-config.js";
const auth = getAuth(app);

// In your form submit handler:
try {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  // Optionally, fetch user profile from Firestore
  const userRef = doc(firestore, "users", email);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    localStorage.setItem('userName', JSON.stringify(userSnap.data()));
  }
  alert("Login successful!");
  window.location.href = "../pages/home.html";
} catch (error) {
  alert("Login failed: " + error.message);
}
```

---

## **Advantages of Using Firebase Auth**
- Passwords are securely managed by Firebase (not stored in your Firestore).
- Built-in support for password reset, email verification, and more.
- More secure and scalable for real-world apps.

---

**If you want, I can update your signup.js and login.js for you! Just say the word.**

---

To add **Sign in with Google** using Firebase Authentication, follow these steps:

---

### 1. **Enable Google Sign-In in Firebase Console**
- Go to your Firebase project > Authentication > Sign-in method.
- Enable the "Google" provider and save.

---

### 2. **Import Google Auth Provider in Your JS**

```javascript
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { app, firestore } from "./firebase-config.js";
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
```

---

### 3. **Add a Google Sign-In Button to Your HTML**

```html
<button id="google-signin-btn">Sign in with Google</button>
```

---

### 4. **Handle Google Sign-In in Your JS**

```javascript
document.getElementById("google-signin-btn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Optionally, store user info in Firestore
    const userRef = doc(firestore, "users", user.email);
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString()
    }, { merge: true });
    // Save to localStorage if needed
    localStorage.setItem('userName', JSON.stringify({
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    }));
    window.location.href = "../pages/home.html";
  } catch (error) {
    alert("Google sign-in failed: " + error.message);
  }
});
```

---

## **Summary**
- Enable Google sign-in in Firebase Console.
- Add a button and use `signInWithPopup(auth, provider)` in your JS.
- Optionally, store user info in Firestore and localStorage.

If you want, I can add this code to your project for you!