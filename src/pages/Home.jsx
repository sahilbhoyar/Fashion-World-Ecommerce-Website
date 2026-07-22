import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import { products } from '../data/products'

export default function Home() {
  const { openLoginModal, isAuthenticated, user } = useAuth()
  const featured = products.filter((p) => p.featured)
  const newArrivals = products.filter((p) => p.new)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1483985988350-763728e1935b?w=1600&h=900&fit=crop"
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-brand-300">
              New Season Collection
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Style That Defines You
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-brand-200">
              Discover premium clothing crafted for comfort and confidence.
              Fashion World brings timeless pieces to your everyday wardrobe.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-brand-950 transition hover:bg-brand-100"
              >
                Shop Collection
              </Link>
              <Link
                to="/shop?new=true"
                className="rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                New Arrivals
              </Link>
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => openLoginModal('/')}
                  className="rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Login / Join
                </button>
              ) : (
                <div className="rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white">
                  Welcome, {user?.name || 'Guest'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            to="/shop?category=Women"
            className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop"
              alt="Women's collection"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h2 className="font-display text-2xl font-semibold text-white">Women</h2>
              <p className="mt-1 text-sm text-brand-200">Explore the collection</p>
            </div>
          </Link>
          <Link
            to="/shop?category=Men"
            className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
          >
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=600&fit=crop"
              alt="Men's collection"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h2 className="font-display text-2xl font-semibold text-white">Men</h2>
              <p className="mt-1 text-sm text-brand-200">Explore the collection</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold text-brand-950">Featured</h2>
              <p className="mt-2 text-brand-600">Handpicked favorites from our collection</p>
            </div>
            <Link to="/shop" className="hidden text-sm font-medium text-brand-700 hover:text-brand-900 sm:block">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-brand-950">New Arrivals</h2>
            <p className="mt-2 text-brand-600">Fresh styles just landed</p>
          </div>
          <Link to="/shop?new=true" className="hidden text-sm font-medium text-brand-700 hover:text-brand-900 sm:block">
            View all &rarr;
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="bg-brand-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold">Free Shipping on Orders Over ₹1000</h2>
          <p className="mx-auto mt-4 max-w-lg text-brand-200">
            Join Fashion World today and enjoy complimentary shipping on qualifying orders.
            Quality fashion, delivered to your door.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-brand-950 transition hover:bg-brand-100"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  )
}
