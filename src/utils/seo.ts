// src/utils/seo.ts
export function truncate(str = '', max = 160) {
  const s = String(str).replace(/\s+/g, ' ').trim()
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

export function absoluteUrl(base: string, path = '') {
  if (!base) return path || '/'
  const cleanBase = base.replace(/\/+$/, '')
  const cleanPath = (path || '/').replace(/^\/+/, '/')
  return cleanBase + cleanPath
}

export function buildCanonical(siteUrl: string, fullPath: string) {
  return absoluteUrl(siteUrl, fullPath)
}

export function productOgImage(product?: { image?: string }) {
  return product?.image || '/og-default.jpg'
}

export function defaultOgImage() {
  return '/og-default.jpg'
}

export function orgJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KAMRI Marketplace',
    url: siteUrl,
    logo: absoluteUrl(siteUrl, '/logo.png'),
    sameAs: [],
  }
}

export function websiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KAMRI Marketplace',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(siteUrl: string, items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: absoluteUrl(siteUrl, it.path),
    })),
  }
}

export function productJsonLd(siteUrl: string, p: any) {
  // p: { id, name, description, image, price, oldPrice?, currency?, brand?, rating?, reviewsCount?, inStock? }
  const offer = {
    '@type': 'Offer',
    url: absoluteUrl(siteUrl, `/product/${p?.id}`),
    priceCurrency: p?.currency || 'EUR',
    price: p?.price ?? 0,
    availability: p?.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  }
  const ratings = p?.rating
    ? {
        '@type': 'AggregateRating',
        ratingValue: p.rating,
        reviewCount: p.reviewsCount || 0,
      }
    : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p?.name || '',
    image: [productOgImage(p)],
    description: truncate(p?.description || ''),
    brand: p?.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    aggregateRating: ratings,
    offers: offer,
  }
}

export function itemListJsonLd(siteUrl: string, items: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (items || []).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(siteUrl, `/product/${p?.id}`),
    })),
  }
}

export function articleJsonLd(siteUrl: string, a: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a?.title || '',
    description: truncate(a?.excerpt || a?.description || ''),
    image: [a?.image || defaultOgImage()],
    datePublished: a?.date || new Date().toISOString(),
    author: a?.author
      ? { '@type': 'Person', name: a.author }
      : { '@type': 'Organization', name: 'KAMRI Marketplace' },
    mainEntityOfPage: absoluteUrl(siteUrl, `/magazine/${a?.id || ''}`),
  }
}
