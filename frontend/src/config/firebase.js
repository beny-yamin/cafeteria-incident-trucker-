import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDCB4EuBUxBRGss6m43bvuJX1PlaZB7jlU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jaaamin-rox.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jaaamin-rox",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jaaamin-rox.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "858861626056",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:858861626056:web:ed35fb24c2e6166bca3bfd"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
