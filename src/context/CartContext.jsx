import { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'

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
    if (!user?.id) {
      dispatch({ type: 'CLEAR_CART' })
      return
    }

    const saved = localStorage.getItem(getCartKey(user.id))
    if (saved) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) })
      } catch {
        localStorage.removeItem(getCartKey(user.id))
      }
    } else {
      dispatch({ type: 'CLEAR_CART' })
    }
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return
    localStorage.setItem(getCartKey(user.id), JSON.stringify(state.items))
  }, [state.items, user?.id])

  const addItem = (product, size, color, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        color,
        quantity,
      },
    })
  }

  const removeItem = (id, size, color) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, size, color } })
  }

  const updateQuantity = (id, size, color, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, color, quantity } })
  }

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
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
