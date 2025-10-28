// Firebase configuration
// Replace these values with your Firebase project credentials
// Get them from: Firebase Console > Project Settings > General > Your apps

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Demo Firebase config - Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyAmoZxg1fI048GfHqwzl81zXJBuAfKyVOI",
  authDomain: "wolf-of-d-street.firebaseapp.com",
  projectId: "wolf-of-d-street",
  storageBucket: "wolf-of-d-street.firebasestorage.app",
  messagingSenderId: "768745636703",
  appId: "1:768745636703:web:0342edc4f65f54bbdd2cea",
  measurementId: "G-DWC1G7H2LP"
};


// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "demo-api-key" && 
         firebaseConfig.projectId !== "demo-project";
};

let app, auth, db, storage;

try {
  // Initialize Firebase only if properly configured
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    console.warn('Firebase not configured. Using local storage fallback.');
  }
} catch (error) {
  console.warn('Firebase initialization failed. Using local storage fallback.', error);
}

export { auth, db, storage };
export default app;
