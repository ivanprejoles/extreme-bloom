import axios from "axios";
import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const cookieId = await axios.post('/api/login', {
            userId: user.uid,
            email: user.email,
            imageUrl: user.photoURL
        })

        return cookieId.data
    } catch (error) {
        console.error(`Error signin in:`, error)
        return 0
    }
};

export const doSignOut = () => {
    return auth.signOut();
};