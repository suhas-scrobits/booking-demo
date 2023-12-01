// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAi_rhc-n0OkQOOyUBH7fZaz02Vm5IqnGs",
  authDomain: "booking-system-85680.firebaseapp.com",
  projectId: "booking-system-85680",
  storageBucket: "booking-system-85680.appspot.com",
  messagingSenderId: "187530538323",
  appId: "1:187530538323:web:40f0a67f0542de9f7185a6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase();
