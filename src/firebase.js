// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_7MPfckWbePmec-5_Jl5gF7jEQ-hiuJg",
  authDomain: "easy-budgets-2b8c6.firebaseapp.com",
  projectId: "easy-budgets-2b8c6",
  storageBucket: "easy-budgets-2b8c6.appspot.com",
  messagingSenderId: "741258166528",
  appId: "1:741258166528:web:3d43f7020d32a338e473e5",
  measurementId: "G-8QV5F98JHE"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const db = app.firestore();
