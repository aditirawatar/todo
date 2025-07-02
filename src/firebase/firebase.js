import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzsBu3c396iIhFg15WaWnHX-KxPEfGCus",
  authDomain: "do-to-4cab7.firebaseapp.com",
  projectId: "do-to-4cab7",
  storageBucket: "do-to-4cab7.firebasestorage.app",
  messagingSenderId: "1028305710016",
  appId: "1:1028305710016:web:bd288d96cafa34e76f7625"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider= new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, db ,googleProvider, storage};
