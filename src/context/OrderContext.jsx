import { createContext, useContext, useReducer } from "react";
import { useAuth } from "./AuthContext";
import { addOrder, getOrders } from "../services/orderService";

const OrderContext = createContext(null);

const orderReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_ORDERS":
      return {
        ...state,
        orders: action.payload,
      };

    default:
      return state;
  }
};

export function OrderProvider({ children }) {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(orderReducer, {
    orders: [],
  });

  const saveOrder = async (order) => {
    if (!user?.uid) return;

    await addOrder(user.uid, order);

    const orders = await getOrders(user.uid);

    dispatch({
      type: "LOAD_ORDERS",
      payload: orders,
    });
  };

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        saveOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used inside OrderProvider");
  }

  return context;
}