import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
// @ts-ignore - getReactNativePersistence exists but types may not be exported correctly
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDptWOjYh9pcqOKIPn3crS5LNfGUnjGwiI",
  authDomain: "where-to-watch-a4321.firebaseapp.com",
  projectId: "where-to-watch-a4321",
  storageBucket: "where-to-watch-a4321.firebasestorage.app",
  messagingSenderId: "1008255536768",
  appId: "1:1008255536768:web:7f27e0d49d4b7b4b59e065",
  measurementId: "G-B1SMN1K5Q7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);
