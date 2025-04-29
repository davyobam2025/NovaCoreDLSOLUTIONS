// src/firebase/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuration officielle NovaCore
const firebaseConfig = {
  apiKey: "AIzaSyBkelgaG-5EPFDRmjEoRFn2sBGvxo0O7KU",
  authDomain: "novacore-36982.firebaseapp.com",
  projectId: "novacore-36982",
  storageBucket: "novacore-36982.appspot.com", // Correction ici: storageBucket (pas firebasestorage.app)
  messagingSenderId: "910416811852",
  appId: "1:910416811852:web:1ffa1157a323e0320e61e9",
  measurementId: "G-7535DCEBNT"
};

// Initialiser Firebase App
const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // Pour Next.js : éviter erreur SSR

export { auth, googleProvider, facebookProvider, analytics };
