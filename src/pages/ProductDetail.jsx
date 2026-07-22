import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { products, formatPrice, getProductPriceDisplay } from '../data/products'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, items } = useCart()

  const product = products.find((p) => p.id === Number(id))

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  const variantInCart =
    Boolean(selectedSize && selectedColor) &&
    items.some(
      (item) =>
        item.id === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    )

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-brand-950">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-brand-700 hover:text-brand-900">
          Back to shop
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (variantInCart) {
      navigate('/cart')
      return
    }

    if (!selectedSize || !selectedColor) return
    addItem(product, selectedSize, selectedColor, quantity)
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-brand-600">
        <Link to="/shop" className="hover:text-brand-900">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-brand-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-brand-100">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-brand-500">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-brand-950">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-2xl font-semibold text-brand-800">
              {formatPrice(getProductPriceDisplay(product).displayPrice)}
            </p>
            {getProductPriceDisplay(product).hasOffer && (
              <>
                <span className="text-base text-brand-500 line-through">
                  {formatPrice(getProductPriceDisplay(product).originalPrice)}
                </span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                  Offer
                </span>
              </>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-brand-700">{product.description}</p>

          {/* Size */}
          <div className="mt-8">
            <label className="text-sm font-semibold text-brand-900">Size</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3rem] rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    selectedSize === size
                      ? 'border-brand-950 bg-brand-950 text-white'
                      : 'border-brand-300 text-brand-800 hover:border-brand-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-brand-900">Color</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    selectedColor === color
                      ? 'border-brand-950 bg-brand-950 text-white'
                      : 'border-brand-300 text-brand-800 hover:border-brand-500'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-brand-900">Quantity</label>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-300 text-brand-800 hover:bg-brand-100"
              >
                &minus;
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-300 text-brand-800 hover:bg-brand-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
              className="w-full rounded-full bg-brand-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {variantInCart ? 'Go to Cart' : 'Add to Cart'}
            </button>
          </div>

          {(!selectedSize || !selectedColor) && (
            <p className="mt-3 text-sm text-brand-500">Please select a size and color</p>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-brand-950">You May Also Like</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-200 transition hover:shadow-md"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="aspect-[3/4] w-full object-cover transition group-hover:scale-105"
                />
                <div className="p-4">
                  <h3 className="font-medium text-brand-950">{p.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-semibold text-brand-700">
                      {formatPrice(getProductPriceDisplay(p).displayPrice)}
                    </p>
                    {getProductPriceDisplay(p).hasOffer && (
                      <span className="text-xs text-brand-500 line-through">
                        {formatPrice(getProductPriceDisplay(p).originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
