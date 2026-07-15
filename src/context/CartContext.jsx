import { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'
import {
  addCartItem,
  getCartItems,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";

const CartContext = createContext(null)
const CART_KEY_PREFIX = 'fashion-world-cart-'

function getCartKey(userId) {
  return `${CART_KEY_PREFIX}${userId}`
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.id === action.payload.id &&
              item.size === action.payload.size &&
              item.color === action.payload.color
            )
        ),
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter((item) => item.quantity > 0),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'LOAD_CART':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
  const loadCart = async () => {
    if (!user?.uid) {
      dispatch({ type: "CLEAR_CART" });
      return;
    }

    try {
      const items = await getCartItems(user.uid);

      dispatch({
        type: "LOAD_CART",
        payload: items,
      });
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  loadCart();
}, [user?.uid]);

  /*
  useEffect(() => {
    if (!user?.id) return
    localStorage.setItem(getCartKey(user.id), JSON.stringify(state.items))
  }, [state.items, user?.id])
  */

  const addItem = async (product, size, color, quantity = 1) => {
  const item = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    size,
    color,
    quantity,
  };

  dispatch({
    type: "ADD_ITEM",
    payload: item,
  });

  if (user?.uid) {
    try {
      await addCartItem(user.uid, item);
    } catch (error) {
      console.error("Error adding cart item:", error);
    }
  }
};

 const removeItem = async (id, size, color) => {
  dispatch({
    type: "REMOVE_ITEM",
    payload: { id, size, color },
  });

  if (user?.uid) {
    try {
      await removeCartItem(user.uid, id, size, color);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }
};

  const updateQuantity = async (
  id,
  size,
  color,
  quantity
) => {

  if (quantity <= 0) {

    dispatch({
      type: "REMOVE_ITEM",
      payload: { id, size, color },
    });

    if (user?.uid) {
      try {
        await removeCartItem(
          user.uid,
          id,
          size,
          color
        );
      } catch (error) {
        console.error(error);
      }
    }

    return;
  }

  dispatch({
    type: "UPDATE_QUANTITY",
    payload: { id, size, color, quantity },
  });

  if (user?.uid) {
    try {
      await updateCartItem(
        user.uid,
        id,
        size,
        color,
        quantity
      );
    } catch (error) {
      console.error(error);
    }
  }
};

  const clearCart = async () => {

  if (user?.uid) {

    for (const item of state.items) {

      await removeCartItem(
        user.uid,
        item.id,
        item.size,
        item.color
      );

    }

  }

  dispatch({
    type: "CLEAR_CART",
  });

};

  const itemCount = state.items.length;
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
