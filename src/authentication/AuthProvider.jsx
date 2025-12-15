import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from './firebase/firebase.init';

const GoogleProvider = new GoogleAuthProvider;

    

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading , setLoading] = useState(true);

    const registerUser = (email,password)=> {
        return createUserWithEmailAndPassword(auth,email, password)
    }
    const singInUser = (email,password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const googleSingIN = ()=> {

        return signInWithPopup(auth, GoogleProvider)

        
    }

    const logOut = () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        })
        return () => {
            unsubscribe()
        }

    },[])

    const authInfo = {
        registerUser,
        singInUser,
        googleSingIN,
        logOut,
        user,
        loading

    }
    return (
        <AuthContext value = {authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;