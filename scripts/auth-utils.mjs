import { auth, provider, firestore } from "./firebase-config.mjs";
import {
    doc,
    setDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

//  ( I Think this is the best way to do it )
export const loginAndSignup = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        localStorage.setItem(
            "userName",
            JSON.stringify({
                name: result.user.displayName,
                email: result.user.email,
            })
        );

        const userRef = doc(firestore, "users", result.user.uid);
        await setDoc(
            userRef,
            {
                name: result.user.displayName,
                email: result.user.email,
                createdAt: new Date().toISOString(),
            },
            { merge: true }
        );
        console.log("User signed in and data saved:", result.user);

        window.location.href = "../pages/home.html"; // Redirect to home page
    } catch (error) {
        console.error("Error during sign-up:", error);
        alert("Failed to sign in with Google. Please try again.");
    }
};
