// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-1f3c2.firebaseapp.com",
    projectId: "mern-estate-1f3c2",
    storageBucket: "mern-estate-1f3c2.appspot.com",
    messagingSenderId: "806441196237",
    appId: "1:806441196237:web:5698313808e707d799e784",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
