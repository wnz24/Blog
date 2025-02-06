import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // ✅ Correct way for Vite
  authDomain: "blog-7d1c6.firebaseapp.com",
  projectId: "blog-7d1c6",
  storageBucket: "blog-7d1c6.appspot.com", // ✅ Fixed Storage Bucket
  messagingSenderId: "647406781197",
  appId: "1:647406781197:web:9b0cd6a301be55a0fba644"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
