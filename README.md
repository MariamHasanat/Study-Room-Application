# 🗑️ Remove Subject Feature

## ✅ Overview

A **"Remove Subject"** feature has been added to allow users to delete subjects they no longer wish to track.

---

## 🔧 How It Works

Each subject item now includes a small **delete button** 🗑️ positioned next to it.

When the user clicks this button:

1. **A confirmation dialog** appears to prevent accidental deletion.
2. Upon confirmation:
   - ✅ The subject is removed from the **UI**.
   - ✅ The subject is deleted from **Firestore** (under the current user).
   - ✅ The subject is also removed from **localStorage** for consistency.
3. If it was the last subject, the **empty state message** is shown again.

---

## 💡 Why This Feature?

This feature enhances the user experience by giving users full control over their study list.  
It helps them stay organized by removing irrelevant or outdated subjects as their study priorities change.


