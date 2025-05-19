// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase (obtenida desde Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBXTPqtBqULa8x8FMT4djT8BKa4UwouBFY",
  authDomain: "tour-reservas-664ce.firebaseapp.com",
  databaseURL: "https://tour-reservas-664ce-default-rtdb.firebaseio.com",
  projectId: "tour-reservas-664ce",
  storageBucket: "tour-reservas-664ce.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123xyz"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore y obtén la referencia al servicio
const db = getFirestore(app);

export { db };