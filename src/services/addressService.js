import { addAddress } from "../firebase/addressService";
import { useAuth } from "../context/AuthContext";

import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

// =========================
// Add Address
// =========================
export const addAddress = async (userId, address) => {
  const addressId = crypto.randomUUID();

  const newAddress = {
    id: addressId,
    ...address,
  };

  await setDoc(
    doc(db, "users", userId, "addresses", addressId),
    {
      id: addressId,
      ...address,
      createdAt: new Date().toISOString(),
    }
  );

  return {
    id: addressId,
    ...address,
    createdAt: new Date().toISOString(),
  };
  };

// =========================
// Get All Addresses
// =========================
export const getAddresses = async (userId) => {
  const snapshot = await getDocs(
    collection(db, "users", userId, "addresses")
  );

  return snapshot.docs.map((doc) => doc.data());
};

// =========================
// Update Address
// =========================
export const updateAddress = async (
  userId,
  addressId,
  updatedData
) => {
  await updateDoc(
    doc(db, "users", userId, "addresses", addressId),
    updatedData
  );
};

// =========================
// Delete Address
// =========================
export const deleteAddress = async (
  userId,
  addressId
) => {
  await deleteDoc(
    doc(db, "users", userId, "addresses", addressId)
);
};