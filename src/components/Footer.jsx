import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-brand-200 bg-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-display text-xl font-semibold text-brand-950">Fashion World</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-700">
              Curated clothing for the modern wardrobe. Quality fabrics, timeless designs,
              and styles that move with you.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-900">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-brand-700">
              <li><Link to="/shop" className="hover:text-brand-900">All Products</Link></li>
              <li><Link to="/shop?category=Men" className="hover:text-brand-900">Men</Link></li>
              <li><Link to="/shop?category=Women" className="hover:text-brand-900">Women</Link></li>
              <li><Link to="/shop?new=true" className="hover:text-brand-900">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-900">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-brand-700">
              <li><span className="cursor-default">Contact Us</span></li>
              <li><span className="cursor-default">Shipping Info</span></li>
              <li><span className="cursor-default">Returns</span></li>
              <li><span className="cursor-default">Size Guide</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-200 pt-8 text-center text-sm text-brand-600">
          &copy; {new Date().getFullYear()} Fashion World. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
