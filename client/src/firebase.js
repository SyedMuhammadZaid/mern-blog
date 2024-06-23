// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-blog-dcd75.firebaseapp.com",
  projectId: "mern-blog-dcd75",
  storageBucket: "mern-blog-dcd75.appspot.com",
  messagingSenderId: "924915577252",
  appId: "1:924915577252:web:2c1f02a6d6f807ef991131"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);