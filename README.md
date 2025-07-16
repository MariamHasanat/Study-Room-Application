# Study Room Application - Delete Subject

## Overview

This feature allows users to **delete a subject** from their subject list directly on the website. The deletion affects both the local state (localStorage) and the remote database (Firestore), ensuring data consistency.

---

## Features

- **Delete subject item**: Users can click the trash icon next to a subject to remove it.
- **Sync with Firestore**: The deleted subject is removed from the Firestore database.
- **Update localStorage**: The local storage is updated immediately to reflect the deletion.
- **UI update**: The subject list updates dynamically without page reload, including the total time recalculation and empty state handling.

---

## How it Works

1. The delete icon (`trash-solid.svg`) is added next to each subject in the list.
2. When clicked, an event listener triggers:
   - The subject is filtered out from the subjects array.
   - The Firestore document is updated using `updateDoc` to remove the subject.
   - localStorage is updated accordingly.
   - The UI list item (`<li>`) is removed.
   - The total time display is recalculated.
   - The empty state message is shown if no subjects remain.
