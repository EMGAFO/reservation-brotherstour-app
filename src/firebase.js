/* // Import the functions you need from the SDKs you need
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

export { db }; */


// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as databaseRef, set as databaseSet, onValue } from "firebase/database";

// Tu configuración de Firebase (desde Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBXTPqtBqULa8x8FMT4djT8BKa4UwouBFY",
  authDomain: "tour-reservas-664ce.firebaseapp.com",
  databaseURL: "https://tour-reservas-664ce-default-rtdb.firebaseio.com ",
  projectId: "tour-reservas-664ce",
  storageBucket: "tour-reservas-664ce.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123xyz"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Inicializa los servicios que vas a usar
const db = getFirestore(app);         // Firestore
const auth = getAuth(app);           // Autenticación
const realTimeDb = getDatabase(app); // Realtime Database (opcional)

// Exporta las funciones y servicios que necesitas
export {
  app,
  db,
  auth,
  realTimeDb,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  databaseRef,
  databaseSet,
  onValue
};