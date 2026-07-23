import { Link } from 'react-router-dom'
import { createOrderStatusActionLinks, sendOrderNotification } from "../services/emailService";
import { useState } from 'react'
import { useEffect } from "react";
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'
import { useAddress } from "../context/AddressContext";
import AddressModal from "../components/Address/AddressModal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const [checkoutStep, setCheckoutStep] = useState('cart')
  const {
  addresses,
  saveAddress,
  removeAddress,
  } = useAddress();

  const { saveOrder } = useOrder();
  const { user } = useAuth();

  const [selectedAddress, setSelectedAddress] = useState(null)

  useEffect(() => {
  if (addresses.length > 0 && !selectedAddress) {
    setSelectedAddress(addresses[0].id);
  }
  }, [addresses, selectedAddress]);

  const [isCreatingAddress, setIsCreatingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    // Customer Details
    name: "",
    email: "",
    phone: "",

    // Address Details
    flatHouse: "",
    areaStreet: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",

    // Complete Address (will be generated automatically later)
    address: "",

    // Address Type
    type: "HOME",

    // Default Address
    isDefault: false,

    // Payment
    paymentMethod: "Cash on Delivery",

    // Delivery Instructions
    instructions: {
      weekendSaturday: false,
      weekendSunday: false,
      note: "",
    },
  });
  const [formError, setFormError] = useState('')
  const [errors, setErrors] = useState({});
  const [confirmationData, setConfirmationData] = useState(null)
  const [selectedItemKeys, setSelectedItemKeys] = useState([])

  const getItemKey = (item) => `${item.id}-${item.size}-${item.color}`

  useEffect(() => {
    setSelectedItemKeys((prev) => {
      const currentKeys = items.map(getItemKey)
      if (currentKeys.length === 0) return []

      const validPrev = prev.filter((key) => currentKeys.includes(key))
      return validPrev
    })
  }, [items])
  //const shipping = subtotal >= 100 ? 0 : subtotal > 0 ? 9.99 : 0
  //const total = subtotal + shipping



  // Number of different products
  const totalProducts = items.length;

  // Total quantity of all products
  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const selectedItems = items.filter((item) => selectedItemKeys.includes(getItemKey(item)))

  const selectedProducts = selectedItems.length
  const selectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const selectedSubtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Shipping Rule
  const shipping =
    selectedProducts >= 2 || selectedQuantity >= 2
      ? 0
      : selectedSubtotal > 0
        ? 99
        : 0;

  const total = selectedSubtotal + shipping;

  const allSelected = items.length > 0 && selectedItems.length === items.length
  const hasSelectedItems = selectedItems.length > 0

  const toggleItemSelection = (item) => {
    const key = getItemKey(item)
    setSelectedItemKeys((prev) =>
      prev.includes(key) ? prev.filter((itemKey) => itemKey !== key) : [...prev, key]
    )
  }

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItemKeys([])
    } else {
      setSelectedItemKeys(items.map(getItemKey))
    }
  }

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
          <div className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-200 pb-4">
              <label className="flex items-center gap-3 text-sm font-medium text-brand-800">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-brand-300 text-brand-950 focus:ring-brand-950"
                />
                {allSelected ? 'Deselect all' : 'Select all'}
              </label>
              <span className="text-sm text-brand-600">
                {hasSelectedItems ? `${selectedItems.length} selected` : 'No items selected'}
              </span>
            </div>

            <div className="mt-4 divide-y divide-brand-200">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-4 py-4 sm:gap-6"
              >
                <input
                  type="checkbox"
                  checked={selectedItemKeys.includes(getItemKey(item))}
                  onChange={() => toggleItemSelection(item)}
                  className="mt-6 h-4 w-4 shrink-0 rounded border-brand-300 text-brand-950 focus:ring-brand-950"
                />
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
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeItem(item.id, item.size, item.color);
                          } else {
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            );
                          }
                        }}
                      >
                        -
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

              {!isCreatingAddress && (
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
                            <div className="mt-3 space-y-1 text-sm leading-6 text-brand-700">

                              {address.flatHouse && (
                                <p>{address.flatHouse}</p>
                              )}

                              {address.areaStreet && (
                                <p>{address.areaStreet}</p>
                              )}

                              {address.landmark && (
                                <p>Landmark: {address.landmark}</p>
                              )}

                              <p>
                                {address.city}, {address.state} - {address.pincode}
                              </p>

                              <p>{address.country}</p>

                            </div>
                            <p className="mt-4 text-sm text-brand-600">
                            Mobile: {address.phone}
                          </p>
                            <p className="mt-2 text-sm text-brand-600">Email: {address.email}</p>
                            <p className="mt-2 text-sm text-brand-600">
                              Payment: {address.paymentMethod}
                            </p>
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                await removeAddress(address.id);
                              }}
                              className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
                            >
                              Delete Address
                            </button>
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
                onClick={async () => {
                  const selected = addresses.find((address) => address.id === selectedAddress)
                  if (!selected) {
                    setFormError('Please add and select an address before continuing.')
                    return
                  }

                  if (!hasSelectedItems) {
                    setFormError('Please select at least one item before continuing.')
                    return
                  }

                  const orderId = await saveOrder({
                    customer: {
                      name: selected.name,
                      email: selected.email,
                      phone: selected.phone,
                      address: selected.address,
                    },

                    items: selectedItems,

                    subtotal: selectedSubtotal,

                    shipping,

                    total,

                    paymentMethod: selected.paymentMethod,

                    status: "Pending",
                    trackingSteps: ["Placed", "Packed", "In transit", "Out for delivery"],
                    trackingStatus: "Pending",
                    orderDate: new Date().toISOString(),
                  });

                  const statusLinks = createOrderStatusActionLinks(user?.uid || "", orderId);

                  await sendOrderNotification({
                    customer_name: selected.name,

                    customer_email: selected.email,

                    customer_phone: selected.phone,

                    customer_address: selected.address,

                    subtotal: selectedSubtotal,

                    shipping: shipping,

                    total: total,

                    payment_method: selected.paymentMethod,

                    order_date: new Date().toLocaleString(),

                    order_items: selectedItems
                      .map(
                        (item) =>
                          `${item.name}
                  Size: ${item.size}
                  Color: ${item.color}
                  Qty: ${item.quantity}
                  Price: ₹${item.price * item.quantity}`
                      )
                      .join("\n\n"),

                    action_packed: statusLinks.packed,
                    action_shipped: statusLinks.shipped,
                    action_out_for_delivery: statusLinks.outForDelivery,
                    action_delivered: statusLinks.delivered,
                  });

                  for (const item of selectedItems) {
                    await removeItem(item.id, item.size, item.color)
                  }

                  setConfirmationData({
                    email: selected.email,
                    address: selected.address,
                    name: selected.name,
                    phone: selected.phone,
                    paymentMethod: selected.paymentMethod,
                    total: formatPrice(total),
                    items: selectedItems.map((item) => ({
                      name: item.name,
                      quantity: item.quantity,
                      price: formatPrice(item.price * item.quantity),
                    })),
                  })
                  setCheckoutStep('confirmation')
                }}
                disabled={!selectedAddress || !hasSelectedItems}
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
                  <span>{formatPrice(selectedSubtotal)}</span>
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
                disabled={!hasSelectedItems}
                className="mt-6 w-full rounded-full bg-brand-950 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-brand-200"
              >
                {hasSelectedItems ? 'Proceed to Checkout' : 'Select items to continue'}
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
      <AddressModal
      open={isCreatingAddress}
      onClose={() => setIsCreatingAddress(false)}
    >

        <div className="mt-6 space-y-4 rounded-3xl border border-brand-200 bg-brand-50 p-6 shadow-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-brand-700">
                      Name <span className="text-red-500">*</span>
                      <input
                        value={newAddress.name}
                        onChange={(e) => {

                          const value = e.target.value;

                          if (/^[A-Za-z ]*$/.test(value)) {

                            setNewAddress({
                              ...newAddress,
                              name: value,
                            });

                            setErrors((prev) => ({
                              ...prev,
                              name: "",
                            }));

                          }

                        }}
                        className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:ring-1 ${
                          errors.name
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-brand-300 focus:border-brand-600 focus:ring-brand-600"
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </label>
                    <label className="block text-sm text-brand-700">
                      Email <span className="text-red-500">*</span>
                      <input
                        type="email"
                        value={newAddress.email}
                        onChange={(e) => {
                          setNewAddress({
                            ...newAddress,
                            email: e.target.value,
                          });

                          setErrors((prev) => ({
                            ...prev,
                            email: "",
                          }));
                        }}
                        className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:ring-1 ${
                          errors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-brand-300 focus:border-brand-600 focus:ring-brand-600"
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-brand-700">
                      Phone <span className="text-red-500">*</span>
                      <PhoneInput
                        country={"in"}
                        value={newAddress.phone}
                        onChange={(value) => {
                          setNewAddress({
                            ...newAddress,
                            phone: "+" + value,
                          });
                        }}
                        inputStyle={{
                          width: "100%",
                          height: "48px",
                          borderRadius: "12px",
                          border: "1px solid #D1D5DB",
                        }}
                        buttonStyle={{
                          border: "none",
                          background: "#fff",
                        }}
                        containerStyle={{
                          marginTop: "8px",
                        }}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
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
                  <div className="grid gap-4">

                  <label className="block text-sm text-brand-700">
                    Flat / House No. <span className="text-red-500">*</span>
                    <input
                      value={newAddress.flatHouse}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          flatHouse: e.target.value,
                        })
                      }
                      className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:ring-1 ${
                        errors.flatHouse
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-brand-300 focus:border-brand-600 focus:ring-brand-600"
                      }`}
                    />
                    {errors.flatHouse && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.flatHouse}
                      </p>
                    )}
                  </label>

                  <label className="block text-sm text-brand-700">
                    Area / Street <span className="text-red-500">*</span>
                    <input
                      value={newAddress.areaStreet}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          areaStreet: e.target.value,
                        })
                      }
                      className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:ring-1 ${
                        errors.areaStreet
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-brand-300 focus:border-brand-600 focus:ring-brand-600"
                      }`}
                    />
                    {errors.areaStreet && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.areaStreet}
                      </p>
                    )}
                  </label>

                  <label className="block text-sm text-brand-700">
                    Landmark
                    <input
                      value={newAddress.landmark}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          landmark: e.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-brand-300 bg-white px-4 py-3"
                    />
                  </label>

                </div>
                <div className="grid gap-4 sm:grid-cols-2">

                <label className="block text-sm text-brand-700">
                  Country <span className="text-red-500">*</span>
                  <select
                    value={newAddress.country}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        country: e.target.value,
                      })
                    }
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:ring-1 ${
                        errors.country
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-brand-300 focus:border-brand-600 focus:ring-brand-600"
                      }`}
                  >
                    <option value="India">India</option>
                  </select>
                  {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country}
                  </p>
                )}
                </label>
                

                <label className="block text-sm text-brand-700">
                  State <span className="text-red-500">*</span>
                  <select
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        state: e.target.value,
                      })
                    }
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:ring-1 ${
                        errors.state
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-brand-300 focus:border-brand-600 focus:ring-brand-600"
                      }`}
                  >
                    <option value="">Select State</option>

                    <option>Maharashtra</option>
                    <option>Delhi</option>
                    <option>Gujarat</option>
                    <option>Karnataka</option>
                    <option>Tamil Nadu</option>
                    <option>Madhya Pradesh</option>
                    <option>Rajasthan</option>
                    <option>Uttar Pradesh</option>
                    <option>Bihar</option>
                    <option>Punjab</option>
                    <option>Haryana</option>
                    <option>West Bengal</option>
                    <option>Kerala</option>
                    <option>Odisha</option>
                    <option>Telangana</option>
                    <option>Andhra Pradesh</option>
                    <option>Assam</option>
                    <option>Jharkhand</option>
                    <option>Chhattisgarh</option>
                    <option>Goa</option>
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.state}
                    </p>
                  )}
                </label>

              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">

                <label className="block text-sm text-brand-700">
                  City <span className="text-red-500">*</span>
                  <input
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        city: e.target.value,
                      })
                    }
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:ring-1 ${
                        errors.city
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-brand-300 focus:border-brand-600 focus:ring-brand-600"
                      }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city}
                    </p>
                  )}
                </label>

                <label className="block text-sm text-brand-700">
                  Pincode <span className="text-red-500">*</span>
                  <input
                    value={newAddress.pincode}
                    onChange={(e) => {

                      const value = e.target.value;

                      if (/^\d{0,6}$/.test(value)) {

                        setNewAddress({
                          ...newAddress,
                          pincode: value,
                        });

                        setErrors((prev) => ({
                          ...prev,
                          pincode: "",
                        }));

                      }

                    }}
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-950 outline-none focus:ring-1 ${
                        errors.pincode
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-brand-300 focus:border-brand-600 focus:ring-brand-600"
                      }`}
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pincode}
                    </p>
                  )}
                </label>

              </div>
                  <div className="rounded-2xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-700">
                    Payment method: <strong>Pay on Delivery</strong>
                  </div>

                  {formError && <p className="text-sm text-red-600">{formError}</p>}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                        const validationErrors = {};
                        if (!newAddress.name.trim()) {
                          validationErrors.name = "Name is required";
                        } else if (!/^[A-Za-z ]+$/.test(newAddress.name.trim())) {
                          validationErrors.name = "Name should contain only letters";
                        }

                        if (!newAddress.email.trim()) {
                          validationErrors.email = "Email is required";
                        } else if (
                          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                            newAddress.email
                          )
                        ) {
                          validationErrors.email = "Enter a valid email address";
                        }

                        if (!newAddress.phone.trim()) {
                          validationErrors.phone = "Phone number is required";
                        } else {
                          const phoneDigits = newAddress.phone.replace(/\D/g, "");

                          const nationalNumber = phoneDigits.slice(-10);

                          if (nationalNumber.length !== 10) {
                            validationErrors.phone = "Phone number must be exactly 10 digits";
                          }
                        }

                        if (!newAddress.flatHouse.trim()) {
                          validationErrors.flatHouse = "Flat / House No. is required";
                        }

                        if (!newAddress.areaStreet.trim()) {
                          validationErrors.areaStreet = "Area / Street is required";
                        }

                        if (!newAddress.country.trim()) {
                          validationErrors.country = "Country is required";
                        }

                        if (!newAddress.state.trim()) {
                          validationErrors.state = "State is required";
                        }

                        if (!newAddress.city.trim()) {
                          validationErrors.city = "City is required";
                        }

                        if (!newAddress.pincode.trim()) {
                          validationErrors.pincode = "Pincode is required";
                        } else if (!/^\d{6}$/.test(newAddress.pincode)) {
                          validationErrors.pincode = "Pincode must be exactly 6 digits";
                        }

                        if (Object.keys(validationErrors).length > 0) {
                          setErrors(validationErrors);
                          return;
                        }

                        setFormError("");
                        setErrors({});
                          console.log("Saving address...");

                          const fullAddress = [
                            newAddress.flatHouse,
                            newAddress.areaStreet,
                            newAddress.landmark,
                            newAddress.city,
                            newAddress.state,
                            newAddress.pincode,
                            newAddress.country,
                          ]
                            .filter(Boolean)
                            .join(", ");

                          const savedAddress = await saveAddress({
                            ...newAddress,
                            address: fullAddress,
                            paymentMethod: "Pay on Delivery",
                          });

                          if (savedAddress) {
                            setSelectedAddress(savedAddress.id);
                          }

                          setFormError("");

                          setTimeout(() => {
                              setIsCreatingAddress(false);
                          }, 100);

                          setNewAddress({
                          name:"",
                          email:"",
                          phone:"",
                          address:"",
                          country:"India",
                          state:"",
                          city:"",
                          pincode:"",
                          flatHouse:"",
                          areaStreet:"",
                          landmark:"",
                          type:"HOME",
                          isDefault:false,
                          paymentMethod:"Cash on Delivery",
                          instructions:{
                              weekendSaturday:false,
                              weekendSunday:false,
                              note:"",
                          }
                      })

                        } catch (err) {
                          console.error("SAVE ERROR:", err);
                        }
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
      

    </AddressModal>
    </div>
  )
}
