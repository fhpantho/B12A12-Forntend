import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase/firebase.init";
import UseAxiosSecure from "../hooks/UseAxiosSecure";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);
    const [myRequests, setMyRequests] = useState([]); 

  const axiosSecure = UseAxiosSecure();

  /* =====================
     AUTH FUNCTIONS
  ===================== */
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const singInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSingIN = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

 const logOut = async () => {
  setLoading(true);
  try {
    await signOut(auth);
    setDbUser(null);
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    setLoading(false);
  }
};


const updateUserInfo = async (profile) => {
  try {
    await updateProfile(auth.currentUser, profile);
    //  reload user to get fresh data
    await auth.currentUser.reload();
    return auth.currentUser;
  } catch (error) {
    console.error("Firebase profile update failed:", error);
    throw error;
  }
};

  /* =====================
     FIREBASE AUTH STATE
  ===================== */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* =====================
     FETCH USER FROM DB
  ===================== */
  useEffect(() => {
  if (loading || !user) return; // wait until Firebase is done loading user

  const fetchDbUser = async () => {
    try {
      setDbLoading(true);
      const res = await axiosSecure.get(`/user?email=${user.email}`);
      if (res.data?.length > 0) {
        setDbUser(res.data[0]);
      } else {
        setDbUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch DB user:", error);
      setDbUser(null);
    } finally {
      setDbLoading(false);
    }
  };

  fetchDbUser();
}, [loading, user, axiosSecure]);



  /* =====================
     CONTEXT VALUE
  ===================== */
  const authInfo = {
    registerUser,
    singInUser,
    googleSingIN,
    logOut,
    updateUserInfo,
    user,
    loading,
    setLoading,
    dbUser,
    dbLoading,
    myRequests,
    setMyRequests,
    setDbUser
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
