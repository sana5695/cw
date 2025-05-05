// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOxReF6ALj4b356wlU0w1DETrTydN1caI",
    authDomain: "constwatch-b4c09.firebaseapp.com",
    projectId: "constwatch-b4c09",
    storageBucket: "constwatch-b4c09.firebasestorage.app",
    messagingSenderId: "229552092276",
    appId: "1:229552092276:web:2ba831897971cb48cecd21",
    measurementId: "G-E8E35LKL48"
  };
  

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Получаем доступ к Firestore
export const db = getFirestore(app);

export default app; 