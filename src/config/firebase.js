// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABVVNOynO7cjsSyEYVnQB_PpInTJeEiwM",
  authDomain: "airnav-manado-database-teknik.firebaseapp.com",
  databaseURL: "https://airnav-manado-database-teknik-default-rtdb.firebaseio.com",
  projectId: "airnav-manado-database-teknik",
  storageBucket: "airnav-manado-database-teknik.firebasestorage.app",
  messagingSenderId: "511838046173",
  appId: "1:511838046173:web:d037e603b5856f9ae99834",
  measurementId: "G-SYG99VL9RX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
