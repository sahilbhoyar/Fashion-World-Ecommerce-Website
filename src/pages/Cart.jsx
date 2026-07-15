import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'



export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const [checkoutStep, setCheckoutStep] = useState('cart')
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isCreatingAddress, setIsCreatingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: '',
    email: '',
    type: 'HOME',
    address: '',
    phone: '',
  })
  const [formError, setFormError] = useState('')
  const [confirmationData, setConfirmationData] = useState(null)
  //const shipping = subtotal >= 100 ? 0 : subtotal > 0 ? 9.99 : 0
  //const total = subtotal + shipping

  // Number of different products
  const totalProducts = items.length;

  // Total quantity of all products
  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Shipping Rule
  const shipping =
    totalProducts >= 2 || totalQuantity >= 2
      ? 0
      : subtotal > 0
        ? 99
        : 0;

  const total = subtotal + shipping;

  const showAddressStep = checkoutStep === 'address'
  const showConfirmationStep = checkoutStep === 'confirmation'

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <svg
          className="mx-auto h-16 w-16 text-brand-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h1 className="mt-6 font-display text-2xl font-semibold text-brand-950">
          Your cart is empty
        </h1>
        <p className="mt-2 text-brand-600">Looks like you haven&apos;t added anything yet.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full bg-brand-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-950">Shopping Cart</h1>
      <p className="mt-2 text-brand-600">{items.length} {items.length === 1 ? 'item' : 'items'}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-brand-200 rounded-2xl bg-white ring-1 ring-brand-200">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-4 p-4 sm:gap-6 sm:p-6"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-20 flex-shrink-0 rounded-lg object-cover sm:h-32 sm:w-24"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-brand-950">{item.name}</h3>
                      <p className="mt-1 text-sm text-brand-600">
                        {item.size} / {item.color}
                      </p>
                    </div>
                    <p className="font-semibold text-brand-800">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded border border-brand-300 text-brand-700 hover:bg-brand-50"
                      >
                        &minus;
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded border border-brand-300 text-brand-700 hover:bg-brand-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.size, item.color)}
                      className="text-sm text-brand-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-4 text-sm text-brand-500 hover:text-red-600"
          >
            Clear cart
          </button>
        </div>

        <div className="h-fit rounded-2xl bg-white p-6 ring-1 ring-brand-200">
          {showAddressStep ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-500">Delivery Address</p>
                  <h2 className="mt-2 text-2xl font-semibold text-brand-950">Select or add a new address</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutStep('cart')
                    setIsCreatingAddress(false)
                    setFormError('')
                  }}
                  className="rounded-full border border-brand-200 px-4 py-2 text-sm text-brand-700 transition hover:bg-brand-50"
                >
                  Back
                </button>
              </div>

              {isCreatingAddress ? (
                <div className="mt-6 space-y-4 rounded-3xl border border-brand-200 bg-brand-50 p-6 shadow-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-brand-700">
                      Name
                      <input
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                      />
                    </label>
                    <label className="block text-sm text-brand-700">
                      Email
                      <input
                        type="email"
                        value={newAddress.email}
                        onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-brand-700">
                      Phone
                      <input
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                      />
                    </label>
                    <label className="block text-sm text-brand-700">
                      Address Label
                      <select
                        value={newAddress.type}
                        onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                      >
                        <option>HOME</option>
                        <option>WORK</option>
                        <option>OTHER</option>
                      </select>
                    </label>
                  </div>
                  <label className="block text-sm text-brand-700">
                    Address
                    <textarea
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                    />
                  </label>
                  <div className="rounded-2xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-700">
                    Payment method: <strong>Pay on Delivery</strong>
                  </div>

                  {formError && <p className="text-sm text-red-600">{formError}</p>}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.address.trim() || !newAddress.email.trim()) {
                          setFormError('Please fill in all required fields.')
                          return
                        }
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if (!emailPattern.test(newAddress.email.trim())) {
                          setFormError('Please enter a valid email address.')
                          return
                        }
                        const nextId = addresses.length ? Math.max(...addresses.map((address) => address.id)) + 1 : 1
                        const savedAddress = { id: nextId, ...newAddress, paymentMethod: 'Pay on Delivery' }
                        setAddresses((current) => [...current, savedAddress])
                        setSelectedAddress(savedAddress.id)
                        setIsCreatingAddress(false)
                        setFormError('')
                        setNewAddress({
                          name: '',
                          email: '',
                          type: 'HOME',
                          address: '',
                          phone: '',
                        })
                      }}
                      className="w-full rounded-full bg-brand-950 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 sm:w-auto"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingAddress(false)
                        setFormError('')
                      }}
                      className="w-full rounded-full border border-brand-300 bg-white py-3 text-sm font-semibold text-brand-950 transition hover:bg-brand-50 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          className="flex cursor-pointer items-start gap-4 rounded-3xl border border-brand-200 bg-brand-50 p-6 shadow-sm"
                        >
                          <input
                            type="radio"
                            checked={selectedAddress === address.id}
                            onChange={() => setSelectedAddress(address.id)}
                            className="mt-1 h-4 w-4 text-brand-950 accent-brand-950"
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-semibold text-brand-950">{address.name}</span>
                              <span className="rounded-full border border-brand-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                                {address.type}
                              </span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-brand-700">{address.address}</p>
                            <p className="mt-4 text-sm text-brand-600">Mobile: {address.phone}</p>
                            <p className="mt-2 text-sm text-brand-600">Email: {address.email}</p>
                            <p className="mt-2 text-sm text-brand-600">Payment: Pay on Delivery</p>
                          </div>
                        </label>
                      ))}
                      <button
                        type="button"
                        onClick={() => setIsCreatingAddress(true)}
                        className="w-full rounded-full border border-brand-300 bg-white py-3 text-sm font-semibold text-brand-950 transition hover:bg-brand-50"
                      >
                        + Add Another Address
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setIsCreatingAddress(true)}
                        className="w-full rounded-full border border-brand-300 bg-white py-3 text-sm font-semibold text-brand-950 transition hover:bg-brand-50"
                      >
                        + Add Your Address
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  const selected = addresses.find((address) => address.id === selectedAddress)
                  if (!selected) {
                    setFormError('Please add and select an address before continuing.')
                    return
                  }
                  setConfirmationData({
                    email: selected.email,
                    address: selected.address,
                    name: selected.name,
                    phone: selected.phone,
                    paymentMethod: selected.paymentMethod,
                    total: formatPrice(total),
                    items: items.map((item) => ({
                      name: item.name,
                      quantity: item.quantity,
                      price: formatPrice(item.price * item.quantity),
                    })),
                  })
                  setCheckoutStep('confirmation')
                }}
                disabled={!selectedAddress}
                className="mt-6 w-full rounded-full bg-brand-950 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-brand-200"
              >
                Deliver to this address
              </button>
            </>
          ) : showConfirmationStep ? (
            <div>
              <div className="rounded-3xl border border-brand-200 bg-brand-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.32em] text-brand-500">Order Confirmed</p>
                <h2 className="mt-3 text-2xl font-semibold text-brand-950">Order placed successfully</h2>
                <p className="mt-4 text-sm leading-6 text-brand-700">
                  Your order has been confirmed. Order details are shown below and will be emailed to <strong>{confirmationData?.email}</strong> once email delivery is enabled.
                </p>
              </div>

              <div className="mt-6 space-y-4 rounded-3xl border border-brand-200 bg-white p-6 shadow-sm">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-500">Delivery Details</h3>
                  <p className="mt-3 text-sm text-brand-700">{confirmationData?.name}</p>
                  <p className="text-sm text-brand-700">{confirmationData?.phone}</p>
                  <p className="text-sm text-brand-700">{confirmationData?.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-500">Payment</h3>
                  <p className="mt-3 text-sm text-brand-700">{confirmationData?.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-500">Order summary</h3>
                  <ul className="mt-3 space-y-3 text-sm text-brand-700">
                    {confirmationData?.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between border-t border-brand-200 pt-4 text-base font-semibold text-brand-950">
                  <span>Total</span>
                  <span>{confirmationData?.total}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCheckoutStep('cart')
                  setConfirmationData(null)
                  setAddresses([])
                  setSelectedAddress(null)
                }}
                className="mt-6 w-full rounded-full bg-brand-950 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-brand-950">Order Summary</h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-brand-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-brand-700">
                  <span>Shipping</span>

                  {shipping === 0 ? (
                    <span className="font-semibold text-green-600">
                      FREE
                    </span>
                  ) : (
                    <span>{formatPrice(shipping)}</span>
                  )}
                </div>
                
                {shipping === 0 ? (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <span className="text-2xl">🎉</span>

                  <div>
                    <p className="font-semibold text-green-700">
                      Congratulations!
                    </p>

                    <p className="text-sm text-green-600">
                      You've unlocked FREE Shipping on your order.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                  <span className="text-2xl">🚚</span>

                  <div>
                    <p className="font-semibold text-yellow-700">
                      Free Shipping Available
                    </p>

                    <p className="text-sm text-yellow-600">
                      Add one more product or increase the quantity to enjoy FREE Shipping.
                    </p>
                  </div>
                </div>
              )}
                <div className="border-t border-brand-200 pt-3">
                  <div className="flex justify-between text-base font-semibold text-brand-950">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep('address')}
                className="mt-6 w-full rounded-full bg-brand-950 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/shop"
                className="mt-3 block text-center text-sm font-medium text-brand-700 hover:text-brand-900"
              >
                Continue Shopping
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
