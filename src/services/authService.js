import { auth } from "../firebase/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";


const googleProvider = new GoogleAuthProvider();

/**
 * Register User
 */
export const registerUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: name,
  });

  return userCredential.user;
};

/**
 * Login User
 */
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

/**
 * Logout User
 */
export const logoutUser = () => {
  return signOut(auth);
};

/**
 * Forgot Password
 */
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

/**
 * Listen for Auth Changes
 */
export const subscribeToAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Login with Google
 */
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);

  return result.user;
};