/* GeoProof — Firebase configuration (THE ONE FILE YOU EDIT).
   Paste your project's web-app config below. These values are PUBLIC and safe to
   ship in a website; access is controlled by Firebase security rules, not by hiding
   these keys. See FIREBASE-SETUP.md for step-by-step instructions.

   Firebase console -> Project settings -> "Your apps" -> Web app -> "SDK setup and
   configuration" -> Config. Copy the object into firebaseConfig below. */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey:            "AIzaSyB2YooHATeNcu_3lYzL7vOjTwpDDlP6I1U",
  authDomain:        "geoproof-a2db0.firebaseapp.com",
  projectId:         "geoproof-a2db0",
  storageBucket:     "geoproof-a2db0.firebasestorage.app",
  messagingSenderId: "504119803431",
  appId:             "1:504119803431:web:87f82a578f16367801d802",
  measurementId:     "G-E5PBLEKTGB"
};

// Nothing below needs editing.
export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// Flip to true only after you have pasted real keys above. While false, the site
// runs exactly as before (no login UI, no counter) so a missing config never breaks it.
export const FIREBASE_READY = true;
