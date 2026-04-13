// src/lib/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCwMdgeHlbOYlhRKvNZlZe9nt4KkSM-qFE",
  authDomain: "certifverify.firebaseapp.com",
  projectId: "certifverify",
  storageBucket: "certifverify.firebasestorage.app",
  messagingSenderId: "105461820063",
  appId: "1:105461820063:web:c26c43ddfbbcbd087810aa",
  measurementId: "G-7G87MDF3GV"
};

const app = initializeApp(firebaseConfig);

// 🔥 Firestore
export const db = getFirestore(app);

// 📊 Analytics (optionnel et sans casser Vite/SSR)
isSupported().then((ok) => {
  if (ok) getAnalytics(app);
});

export default app;