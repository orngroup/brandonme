/* ============================================================
   FIREBASE CONFIG
   1. Create a Firebase project at console.firebase.google.com
   2. Enable Authentication (Email/Password) and Firestore
   3. Paste your config below (Project settings > Your apps > Web)
   4. Run seed-users.js instructions in README to create the 4 logins
   ============================================================ */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/* The four initial users to create in Firebase Auth (Email/Password):
   ajay.kawa@brandonhall.portal          →  BHAK...  (min 6 chars, e.g. BHAK01)
   raj.kumar@brandonhall.portal          →  BHRK...
   alia.taub@brandonhall.portal          →  BHAT...
   nicola.cartwright@brandonhall.portal  →  BHNC...

   NOTE: Firebase requires passwords of at least 6 characters, so the
   4-char codes (BHAK etc.) are padded — see README for the exact
   passwords, or use the login-code mapping in index.html which lets
   staff type just "BHAK" and maps it to the real Firebase password. */
