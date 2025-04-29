import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkelgaG-5EPFDRmjEoRFn2sBGvxo0O7KU",
  authDomain: "novacore-36982.firebaseapp.com",
  projectId: "novacore-36982",
  storageBucket: "novacore-36982.appspot.com",
  messagingSenderId: "910416811852",
  appId: "1:910416811852:web:1ffa1157a323e0320e61e9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
