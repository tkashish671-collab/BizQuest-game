import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYX3hgvqgqaa69LPQrVwcRxwK2fsw_h60",
  authDomain: "bizquest-55b0d.firebaseapp.com",
  projectId: "bizquest-55b0d",
  storageBucket: "bizquest-55b0d.firebasestorage.app",
  messagingSenderId: "304737132876",
  appId: "1:304737132876:web:d94e80b6fe4e94e6e1efe9",
  measurementId: "G-5CPWH0PMY6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);