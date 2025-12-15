import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateCurrentUser, updateProfile } from 'firebase/auth';
import { auth } from './firebase/firebase.init';

const GoogleProvider = new GoogleAuthProvider;

    

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading , setLoading] = useState(true);

    const registerUser = (email,password)=> {
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email, password)
    }
    const singInUser = (email,password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    const googleSingIN = ()=> {
        setLoading(true);

        return signInWithPopup(auth, GoogleProvider)

        
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth)
    }

    const updateUserInfo = (profile) => {
        setLoading(true);
        return updateProfile(auth.currentUser, profile)
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
        updateUserInfo,
        user,
        loading,
        setLoading

    }
    return (
        <AuthContext value = {authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;