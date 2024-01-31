// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-43c7e.firebaseapp.com",
  projectId: "mern-blog-43c7e",
  storageBucket: "mern-blog-43c7e.appspot.com",
  messagingSenderId: "171822062418",
  appId: "1:171822062418:web:72b7c2af247260710a388b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);