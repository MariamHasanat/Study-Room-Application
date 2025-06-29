🗑️ Feature: Remove Subject
We have implemented a "Remove Subject" feature that allows users to delete any subject they no longer need from their study list.

🔧 How It Works
Each subject item now includes a delete (🗑️) button next to it.

When the user clicks the delete button:

A confirmation popup appears to prevent accidental deletion.

If confirmed:

The subject is removed from the UI.

The subject is deleted from Firestore under the current user's document.

The subject is also removed from localStorage to keep the data in sync.

If the deleted subject was the last one, the "empty state" message or image will reappear to indicate there are no subjects added.

💡 Why This Feature?
This feature improves the user experience by giving users more control over their data, allowing them to clean up and manage their subjects list as their study needs change.