import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function addOrder(userId, orderData) {
  const ordersRef = collection(db, "users", userId, "orders");

  const docRef = await addDoc(ordersRef, {
    ...orderData,
    createdAt: new Date().toISOString(),
    status: orderData.status || "Pending",
    trackingStatus: orderData.trackingStatus || "Pending",
  });

  return docRef.id;
}

export async function getOrders(userId) {
  const ordersRef = collection(db, "users", userId, "orders");

  const q = query(ordersRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

export async function updateOrderStatus(userId, orderId, status) {
  const orderRef = doc(db, "users", userId, "orders", orderId);

  await updateDoc(orderRef, {
    status,
    trackingStatus: status,
    updatedAt: new Date().toISOString(),
  });
}

export async function completePastOrders(userId, orders) {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const order of orders) {
    const createdAt = order.createdAt ? new Date(order.createdAt).getTime() : null;

    if (!createdAt) continue;

    if (createdAt < sevenDaysAgo && (order.status || "").toLowerCase() !== "delivered") {
      await updateOrderStatus(userId, order.id, "Delivered");
    }
  }
}