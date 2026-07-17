import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function addOrder(userId, orderData) {
  const ordersRef = collection(db, "users", userId, "orders");

  const docRef = await addDoc(ordersRef, {
    ...orderData,
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

export async function getOrders(userId) {
  const ordersRef = collection(db, "users", userId, "orders");

  const q = query(
    ordersRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}