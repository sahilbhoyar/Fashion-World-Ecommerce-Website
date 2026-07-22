import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { itemCount } = useCart()
  const { isAuthenticated, user, logout, openLoginModal } = useAuth()

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-brand-600 ${
      isActive ? 'text-brand-700' : 'text-brand-800'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-brand-200 bg-brand-50/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-brand-950">
          Fashion World
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          <NavLink to="/shop?category=Men" className={linkClass}>
            Men
          </NavLink>
          <NavLink to="/shop?category=Women" className={linkClass}>
            Women
          </NavLink>
          <NavLink to="/orders" className={linkClass}>
            Orders
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-brand-800 sm:block">
                Hi, {user?.name || 'there'}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-brand-300 px-4 py-2 text-sm font-medium text-brand-800 transition hover:bg-brand-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openLoginModal('/')}
              className="rounded-full bg-brand-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800"
            >
              Login
            </button>
          )}

          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-800 transition hover:bg-brand-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
