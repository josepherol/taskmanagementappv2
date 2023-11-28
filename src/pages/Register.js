import React, { useContext, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth, provider } from "../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../hooks/MainContext";
import { onAuthStateChanged } from "firebase/auth";

function Register() {
  const navigate = useNavigate();
  const { setIsAuth } = useContext(MainContext);
  const userCollectionRef = collection(db, "users");

  useEffect(() => {
    // Use onAuthStateChanged to listen for authentication changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, you can handle this as needed.
        // For example, you can redirect the user to the home page.
        setIsAuth(true);
        localStorage.setItem("isAuth", true);
        localStorage.setItem("uid", user.uid);

        // Navigate to the home page when the user is authenticated
        navigate("/");
      } else {
        // User is not authenticated, you can handle this as needed.
        // For example, you can keep the user on the register page.
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [navigate, setIsAuth]);

  const signInWithGoogle = async () => {
    try {
      // Sign in with Google using Firebase's signInWithPopup
      const result = await signInWithPopup(auth, provider);

      // Add user data to Firestore
      const userData = {
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
      };
      await addDoc(userCollectionRef, userData);
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <div className="container">
      <button
        className="btn btn-outline-primary mt-5"
        onClick={signInWithGoogle}
      >
        Sign In With Google to Continue
      </button>
    </div>
  );
}

export default Register;
