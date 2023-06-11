
import { initializeApp } from "firebase/app";
import  {getFirestore, collection} from "firebase/firestore"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEvFWplibhuohPuKUKkVIsGRtgI9UO1ZA",
  authDomain: "react-notes-3fa50.firebaseapp.com",
  projectId: "react-notes-3fa50",
  storageBucket: "react-notes-3fa50.appspot.com",
  messagingSenderId: "679183168163",
  appId: "1:679183168163:web:94351039bffc30d07a8516"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");