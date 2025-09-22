export function fromRoute(route) {
  const q = route.query || {}
  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : [])
  return {
    q: q.q || '',
    cat: q.cat || '',
    priceMin: q.priceMin ? Number(q.priceMin) : null,
    priceMax: q.priceMax ? Number(q.priceMax) : null,
    rating: q.rating ? Number(q.rating) : null,
    brand: arr(q.brand),
    color: arr(q.color),
    size: arr(q.size),
    inStock: q.inStock === 'true' || q.inStock === true,
    eco: q.eco || null,
  }
}

export function toQuery({
  q,
  cat,
  priceMin,
  priceMax,
  rating,
  brand,
  color,
  size,
  inStock,
  eco,
  sort,
  page,
}) {
  const query = {
    ...(q ? { q } : {}),
    ...(cat ? { cat } : {}),
    ...(priceMin != null ? { priceMin } : {}),
    ...(priceMax != null ? { priceMax } : {}),
    ...(rating != null ? { rating } : {}),
    ...(brand && brand.length ? { brand } : {}),
    ...(color && color.length ? { color } : {}),
    ...(size && size.length ? { size } : {}),
    ...(inStock ? { inStock: true } : {}),
    ...(eco ? { eco } : {}),
    ...(sort ? { sort } : {}),
    ...(page ? { page } : {}),
  }
  return query
}

export function buildParams(filters, sort, page, pageSize) {
  return {
    ...toQuery({ ...filters, sort, page }),
    pageSize,
  }
}

export function labelChips(f) {
  const chips = []
  if (f.q) chips.push({ key: 'q', label: `Recherche: "${f.q}"`, remove: (obj) => (obj.q = '') })
  if (f.cat)
    chips.push({ key: 'cat', label: `Catégorie: ${f.cat}`, remove: (obj) => (obj.cat = '') })
  if (f.priceMin != null || f.priceMax != null) {
    chips.push({
      key: 'price',
      label: `Prix: ${f.priceMin ?? 0}–${f.priceMax ?? 'max'}`,
      remove: (obj) => {
        obj.priceMin = null
        obj.priceMax = null
      },
    })
  }
  if (f.rating != null)
    chips.push({ key: 'rating', label: `Note ≥ ${f.rating}★`, remove: (o) => (o.rating = null) })
  ;(f.brand || []).forEach((b, i) =>
    chips.push({
      key: `brand-${i}`,
      label: `Marque: ${b}`,
      remove: (o) => (o.brand = o.brand.filter((v) => v !== b)),
    }),
  )
  ;(f.color || []).forEach((c, i) =>
    chips.push({
      key: `color-${i}`,
      label: `Couleur: ${c}`,
      remove: (o) => (o.color = o.color.filter((v) => v !== c)),
    }),
  )
  ;(f.size || []).forEach((s, i) =>
    chips.push({
      key: `size-${i}`,
      label: `Taille: ${s}`,
      remove: (o) => (o.size = o.size.filter((v) => v !== s)),
    }),
  )
  if (f.inStock)
    chips.push({ key: 'inStock', label: 'En stock', remove: (o) => (o.inStock = false) })
  if (f.eco) chips.push({ key: 'eco', label: `Éco-score: ${f.eco}`, remove: (o) => (o.eco = null) })
  return chips
}

// Fallback client (optionnel ; peut être remplacé par ton API plus tard)
export async function applyClientFilterAndSort(filters, sort, page, pageSize) {
  const src = window.__MOCK_PRODUCTS__ || []
  let arr = [...src]

  // filtres (exemples)
  if (filters.q)
    arr = arr.filter((p) => (p.name || '').toLowerCase().includes(filters.q.toLowerCase()))
  if (filters.cat) arr = arr.filter((p) => p.category === filters.cat)
  if (filters.priceMin != null) arr = arr.filter((p) => p.price >= filters.priceMin)
  if (filters.priceMax != null) arr = arr.filter((p) => p.price <= filters.priceMax)
  if (filters.rating != null) arr = arr.filter((p) => (p.rating || 0) >= filters.rating)
  if (filters.brand?.length) arr = arr.filter((p) => filters.brand.includes(p.brand))
  if (filters.color?.length) arr = arr.filter((p) => filters.color.includes(p.color))
  if (filters.size?.length) arr = arr.filter((p) => p.sizes?.some((s) => filters.size.includes(s)))
  if (filters.inStock) arr = arr.filter((p) => p.stock > 0)

  // tri
  const sorters = {
    relevance: () => 0,
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    rating_desc: (a, b) => (b.rating || 0) - (a.rating || 0),
    newest: (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
  }
  arr.sort(sorters[sort] || sorters.relevance)

  const total = arr.length
  const start = (page - 1) * pageSize
  const data = arr.slice(start, start + pageSize)
  return { data, total }
}
