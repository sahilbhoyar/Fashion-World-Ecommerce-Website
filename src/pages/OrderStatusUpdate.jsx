import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { updateOrderStatus } from "../services/orderService";

export default function OrderStatusUpdate() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Updating your order status...");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const userId = searchParams.get("userId");
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");

    const runUpdate = async () => {
      if (!userId || !orderId || !status) {
        setMessage("Missing order information. Please use the link from your order email.");
        setIsSuccess(false);
        return;
      }

      try {
        await updateOrderStatus(userId, orderId, status);
        setMessage(`Order status updated to ${status}.`);
        setIsSuccess(true);
      } catch (error) {
        console.error("Failed to update order status", error);
        setMessage("We could not update the order status right now. Please try again.");
        setIsSuccess(false);
      }
    };

    runUpdate();
  }, [searchParams]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full rounded-3xl border border-brand-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-500">Order Tracking</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-brand-950">Status Update</h1>
        <p className={`mt-4 text-lg ${isSuccess ? "text-green-700" : "text-brand-700"}`}>
          {message}
        </p>
      </div>
    </div>
  );
}
