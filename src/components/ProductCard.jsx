import { Link } from 'react-router-dom'
import { formatPrice, getProductPriceDisplay } from '../data/products'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-200 transition hover:shadow-md hover:ring-brand-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.new && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-950 px-3 py-1 text-xs font-medium text-white">
            New
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-500">
          {product.category}
        </p>
        <h3 className="mt-1 font-medium text-brand-950 group-hover:text-brand-700">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-sm font-semibold text-brand-800">
            {formatPrice(getProductPriceDisplay(product).displayPrice)}
          </p>
          {getProductPriceDisplay(product).hasOffer && (
            <>
              <span className="text-xs text-brand-500 line-through">
                {formatPrice(getProductPriceDisplay(product).originalPrice)}
              </span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green-700">
                Offer
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
