# ✅ Google Sign-In Feature – Study Room Application

This feature enables users to **sign in using their Google accounts** through Firebase Authentication.

## ✨ Feature Overview

- Allows users to log in with a single click using their Google account.
- Authentication is handled securely using **Firebase Authentication**.
- Integrates with the existing login system.
- Designed with a clean UI and responsive Google sign-in button.

---

## 🔧 Technologies Used

- **Firebase Authentication**
- JavaScript (ES6 Modules)
- HTML / CSS
- Firebase SDK v11.9.1

---

## 📁 Files Modified

- `firebase.js`  
  → Added Google Sign-In logic using `GoogleAuthProvider` and `signInWithPopup()`.

- `login.js`  
  → Added event listener for the Google login button and integrated with Firebase.

- `login.html`  
  → Added a **Google Sign-In button** and updated form handling logic.

- `login.css`  
  → Styled the Google Sign-In button to match the app design.

---

## 🚀 How to Run

1. **Clone the repo** (if not already):
   ```bash
   git clone https://github.com/MariamHasanat/Study-Room-Application.git
   cd Study-Room-Application
