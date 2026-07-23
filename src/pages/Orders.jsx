import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../data/products'
import { db } from '../firebase/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { completePastOrders } from '../services/orderService'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) {
      setOrders([])
      setLoading(false)
      return
    }

    const ordersRef = collection(db, 'users', user.uid, 'orders')
    const q = query(ordersRef, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const nextOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      if (user?.uid) {
        await completePastOrders(user.uid, nextOrders)
      }

      setOrders(nextOrders)
      setLoading(false)
    })

    return unsubscribe
  }, [user?.uid])

  const getTrackingSteps = (status) => {
    const normalized = (status || 'Pending').toLowerCase()

    if (normalized.includes('delivered')) {
      return ['Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered']
    }

    if (normalized.includes('out for delivery')) {
      return ['Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered']
    }

    if (normalized.includes('shipped')) {
      return ['Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered']
    }

    if (normalized.includes('packed')) {
      return ['Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered']
    }

    return ['Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered']
  }

  const formatOrderDate = (value) => {
    if (!value) return 'Recently placed'
    try {
      return new Date(value).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return value
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold text-brand-950">Your Orders</h1>
        <p className="mt-3 text-brand-600">Please log in to view your order history.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-brand-950 px-6 py-3 text-sm font-semibold text-white">
          Go Home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-500">Your Orders</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-brand-950">Order History</h1>
        </div>
        <Link to="/shop" className="rounded-full border border-brand-300 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50">
          Continue Shopping
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 rounded-2xl border border-brand-200 bg-white p-8 text-center text-brand-600">
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-brand-200 bg-white p-8 text-center text-brand-600">
          No orders yet. Your completed purchases will appear here.
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => {
            const steps = getTrackingSteps(order.status)
            const currentStep = steps.findIndex((step) => step.toLowerCase() === (order.status || 'Pending').toLowerCase())
            const safeCurrentStep = currentStep >= 0 ? currentStep : 1

            return (
              <div key={order.id} className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 border-b border-brand-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-500">Order #{order.id.slice(0, 8)}</p>
                    <p className="mt-2 text-sm text-brand-600">Placed on {formatOrderDate(order.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
                      {order.status || 'Pending'}
                    </span>
                    <span className="text-sm font-semibold text-brand-900">
                      Total: {formatPrice(order.total || order.subtotal || 0)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <h2 className="text-lg font-semibold text-brand-950">Items</h2>
                    <div className="mt-3 space-y-3">
                      {(order.items || []).map((item, index) => (
                        <div key={`${order.id}-${index}`} className="flex items-center justify-between rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-brand-950">Tracking</h2>
                    <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4">
                      <div className="flex items-center justify-between text-sm text-brand-700">
                        <span>Current status</span>
                        <span className="font-semibold text-brand-900">{order.status || 'Pending'}</span>
                      </div>
                      <div className="mt-4 space-y-3">
                        {steps.map((step, index) => {
                          const isActive = index <= safeCurrentStep
                          return (
                            <div key={step} className="flex items-center gap-3">
                              <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-brand-950' : 'bg-brand-300'}`} />
                              <span className={`text-sm ${isActive ? 'font-semibold text-brand-900' : 'text-brand-600'}`}>{step}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
