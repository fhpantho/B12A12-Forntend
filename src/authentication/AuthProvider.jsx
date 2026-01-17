import React, { useEffect, useState, useCallback } from "react";
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
      await auth.currentUser.reload();
      return auth.currentUser;
    } catch (error) {
      console.error("Firebase profile update failed:", error);
      throw error;
    }
  };

  /* =====================
     REFRESH DB USER (MEMOIZED)
  ===================== */
  const refreshDbUser = useCallback(async () => {
    if (!auth.currentUser?.email) return;

    try {
      setDbLoading(true);
      const res = await axiosSecure.get(
        `/user?email=${auth.currentUser.email}`
      );
      setDbUser(res.data?.[0] || null);
    } catch (error) {
      console.error("DB fetch failed:", error);
      setDbUser(null);
    } finally {
      setDbLoading(false);
    }
  }, [axiosSecure]);

  /* =====================
     GOOGLE SIGN-IN (EMPLOYEE)
  ===================== */
  const googleEmployeeSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      if (!firebaseUser?.email) {
        throw new Error("Google account has no email");
      }

      const userData = {
        name: firebaseUser.displayName || "Employee",
        email: firebaseUser.email,
        role: "EMPLOYEE",
        photo: firebaseUser.photoURL || "",
        dateOfBirth: null,
      };

      await axiosSecure.post("/user", userData);
      await refreshDbUser();

      return firebaseUser;
    } catch (error) {
      console.error("Google Employee Sign-in failed:", error);

      // rollback Firebase user if DB fails
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
        } catch (err) {
          console.error("Rollback failed:", err);
        }
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };
  /* =====================
   GOOGLE SIGN-IN (HR)
===================== */
const googleHrSignIn = async () => {
  setLoading(true);
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    if (!firebaseUser?.email) {
      throw new Error("Google account has no email");
    }

    const userData = {
      name: firebaseUser.displayName || "HR",
      email: firebaseUser.email,
      role: "HR",
      companyName: "Not Provided",
      companyLogo: firebaseUser.photoURL || "",
      dateOfBirth: null,
    };

    await axiosSecure.post("/user", userData);
    await refreshDbUser();

    return firebaseUser;
  } catch (error) {
    console.error("Google HR Sign-in failed:", error);

    // 🔥 rollback Firebase user if DB fails
    if (auth.currentUser) {
      try {
        await auth.currentUser.delete();
      } catch (err) {
        console.error("Rollback failed:", err);
      }
    }

    throw error;
  } finally {
    setLoading(false);
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
     FETCH DB USER ON AUTH CHANGE
  ===================== */
  useEffect(() => {
    if (!user) {
      setDbUser(null);
      return;
    }
    refreshDbUser();
  }, [user, refreshDbUser]);

  /* =====================
     CONTEXT VALUE
  ===================== */
  const authInfo = {
    registerUser,
    singInUser,
    logOut,
    updateUserInfo,

    user,
    loading,
    setLoading,

    dbUser,
    setDbUser,
    dbLoading,
    refreshDbUser,

    myRequests,
    setMyRequests,
    googleHrSignIn,

    googleEmployeeSignIn,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
