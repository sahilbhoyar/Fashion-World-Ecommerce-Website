import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

// Add Item
export const addCartItem = async (userId, item) => {
  const cartItemId = `${item.id}_${item.size}_${item.color}`;

  const cartRef = doc(db, "users", userId, "cart", cartItemId);

  await setDoc(cartRef, item);
};

// Get cart
export const getCartItems = async (userId) => {
  const snapshot = await getDocs(
    collection(db, "users", userId, "cart")
  );

  return snapshot.docs.map((doc) => doc.data());
};

// Update quantity
export const updateCartItem = async (
  userId,
  productId,
  size,
  color,
  quantity
) => {
  const cartItemId = `${productId}_${size}_${color}`;

  await updateDoc(
    doc(db, "users", userId, "cart", cartItemId),
    {
      quantity,
    }
  );
};

// Remove item
export const removeCartItem = async (
  userId,
  productId,
  size,
  color
) => {
  const cartItemId = `${productId}_${size}_${color}`;

  await deleteDoc(
    doc(db, "users", userId, "cart", cartItemId)
  );
};