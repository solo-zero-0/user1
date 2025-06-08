import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhlOS0AtaAXHpUmCsBh3VvIx6WqxeJcYQ",
  authDomain: "intweb-182af.firebaseapp.com",
  projectId: "intweb-182af",
  storageBucket: "intweb-182af.firebasestorage.app",
  messagingSenderId: "33622301257",
  appId: "1:33622301257:web:466c6d0757739df5be3d98",
  measurementId: "G-LWCBQDJY47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
