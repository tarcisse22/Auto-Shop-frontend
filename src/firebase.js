import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZ3nteRytlxuRbf_JB-SkPV1xh6feqNV8",
  authDomain: "auto-shop-10d65.firebaseapp.com",
  projectId: "auto-shop-10d65",
  storageBucket: "auto-shop-10d65.firebasestorage.app",
  messagingSenderId: "138923599577",
  appId: "1:138923599577:web:47636c124f02ad557e40c8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
