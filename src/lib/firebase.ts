// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYDvtjw0n37ZnjU_jZOch55RHaNwb3jxY",
  authDomain: "sistemapuntosja.firebaseapp.com",
  projectId: "sistemapuntosja",
  storageBucket: "sistemapuntosja.firebasestorage.app",
  messagingSenderId: "327054959120",
  appId: "1:327054959120:web:efb17f300125fd1876e095",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
