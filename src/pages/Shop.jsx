import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data/products'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'All'
  const showNewOnly = searchParams.get('new') === 'true'

  const filtered = useMemo(() => {
    let result = products
    if (category !== 'All') {
      result = result.filter((p) => p.category === category)
    }
    if (showNewOnly) {
      result = result.filter((p) => p.new)
    }
    return result
  }, [category, showNewOnly])

  const setCategory = (cat) => {
    const params = new URLSearchParams(searchParams)
    if (cat === 'All') {
      params.delete('category')
    } else {
      params.set('category', cat)
    }
    setSearchParams(params)
  }

  const title = showNewOnly
    ? 'New Arrivals'
    : category === 'All'
      ? 'All Products'
      : `${category}'s Collection`

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-brand-950">{title}</h1>
        <p className="mt-2 text-brand-600">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              category === cat
                ? 'bg-brand-950 text-white'
                : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams)
            if (showNewOnly) {
              params.delete('new')
            } else {
              params.set('new', 'true')
            }
            setSearchParams(params)
          }}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            showNewOnly
              ? 'bg-brand-950 text-white'
              : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
          }`}
        >
          New Only
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-brand-600">No products found.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
