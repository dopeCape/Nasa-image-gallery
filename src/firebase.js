// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-auYZ4Cmk6CYMz44JapaziSWJvEVyIFQ",
  authDomain: "nasa-gal.firebaseapp.com",
  projectId: "nasa-gal",
  storageBucket: "nasa-gal.appspot.com",
  messagingSenderId: "392458130471",
  appId: "1:392458130471:web:c59c76f256696273e42a02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};
