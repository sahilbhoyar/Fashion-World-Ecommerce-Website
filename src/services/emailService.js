import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendOrderNotification = async (orderData) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      orderData,
      PUBLIC_KEY
    );

    console.log("✅ Order email sent successfully:", response);

    return response;
  } catch (error) {
    console.error("❌ Failed to send order email:", error);
    throw error;
  }
};

export const createOrderStatusActionLinks = (userId, orderId) => {
  const baseUrl = `${window.location.origin}/order-status-update`;

  return {
    packed: `${baseUrl}?userId=${encodeURIComponent(userId)}&orderId=${encodeURIComponent(orderId)}&status=Packed`,
    shipped: `${baseUrl}?userId=${encodeURIComponent(userId)}&orderId=${encodeURIComponent(orderId)}&status=Shipped`,
    outForDelivery: `${baseUrl}?userId=${encodeURIComponent(userId)}&orderId=${encodeURIComponent(orderId)}&status=Out for delivery`,
    delivered: `${baseUrl}?userId=${encodeURIComponent(userId)}&orderId=${encodeURIComponent(orderId)}&status=Delivered`,
  };
};