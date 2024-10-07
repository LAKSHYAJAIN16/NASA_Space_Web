// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDv5uNZD9Aa_19Dg4GqfyB2f1TRq7fS7s",
  authDomain: "exo-classroom.firebaseapp.com",
  projectId: "exo-classroom",
  storageBucket: "exo-classroom.appspot.com",
  messagingSenderId: "1074106430495",
  appId: "1:1074106430495:web:19201fd2069f0950ccd12a",
  measurementId: "G-YBT23J0K1C",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);