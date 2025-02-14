// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBym81Lm5hN-msHXkuO57Ftcv8nXCJ17H4",
    authDomain: "ai-travel-planner-84368.firebaseapp.com",
    projectId: "ai-travel-planner-84368",
    storageBucket: "ai-travel-planner-84368.firebasestorage.app",
    messagingSenderId: "740483262732",
    appId: "1:740483262732:web:3bc9324a4a0418e981c129",
    measurementId: "G-4STKLGHK3S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)


// const analytics = getAnalytics(app);