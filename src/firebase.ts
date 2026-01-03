import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// 1. Get these values from your Firebase Console -> Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyDzftWdPmJUAhudT6Jj928dGG1-URN9Oc8",
    authDomain: "schmiedaplang.firebaseapp.com",
    projectId: "schmiedaplang",
    storageBucket: "schmiedaplang.firebasestorage.app",
    messagingSenderId: "480552245020",
    appId: "1:480552245020:web:4df0b8736a90b6cc76ccd9",
    measurementId: "G-6CYN81V2ZS"
};

// 2. Initialize the App
const app = initializeApp(firebaseConfig);

// 3. Export the services we need
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
