import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLEC2OQHQZXvfqY9z1kjlK6oOOtvLDeWs",
  authDomain: "fashion-world-website.firebaseapp.com",
  projectId: "fashion-world-website",
  storageBucket: "fashion-world-website.firebasestorage.app",
  messagingSenderId: "5540058613",
  appId: "1:5540058613:web:dcd107559444b02343fcbc",
};

const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;