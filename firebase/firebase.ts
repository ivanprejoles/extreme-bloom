// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
import { getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE,
  authDomain: "extreme-bloom.firebaseapp.com",
  projectId: "extreme-bloom",
  storageBucket: "extreme-bloom.appspot.com",
  messagingSenderId: "453005455762",
  appId: "1:453005455762:web:c7a1d2a74338a2f422514b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const storage = getStorage(app)

export {
    auth,
    storage
}
