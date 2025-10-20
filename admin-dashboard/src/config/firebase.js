import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRG5ZrOJKV5V1sTgmxP3LhmFyIEqn08yM",
  authDomain: "gujarat-estate-agency-aa5ac.firebaseapp.com",
  projectId: "gujarat-estate-agency-aa5ac",
  storageBucket: "gujarat-estate-agency-aa5ac.firebasestorage.app",
  messagingSenderId: "2904123241",
  appId: "1:2904123241:web:cab38720968a644c82bff8",
  measurementId: "G-99ZYBEQ8HN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;