// src/composables/useSeo.ts
import { useMeta } from 'quasar'

type MetaInput = {
  title?: string
  description?: string
  canonical?: string
  image?: string
  noindex?: boolean
  jsonLd?: any[] // tableau de schémas JSON-LD
  hreflangs?: Array<{ lang: string; href: string }> // alternatives linguistiques
}

export function useSeo(input: MetaInput) {
  const {
    title = 'KAMRI Marketplace',
    description = 'Découvrez nos nouveautés exclusives',
    canonical,
    image = '/og-default.jpg',
    noindex = false,
    jsonLd = [],
    hreflangs = [],
  } = input

  useMeta(() => {
    const metaArr: any[] = [
      { name: 'description', content: description },

      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },

      // Twitter card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ]

    if (noindex) {
      metaArr.push({ name: 'robots', content: 'noindex,nofollow' })
    }

    const linkArr: any[] = []
    if (canonical) {
      linkArr.push({ rel: 'canonical', href: canonical })
    }

    // Hreflang alternatives
    hreflangs.forEach(({ lang, href }) => {
      linkArr.push({ rel: 'alternate', hreflang: lang, href })
    })

    // JSON-LD scripts
    const scriptArr: any[] = (jsonLd || []).map((schema) => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema),
    }))

    return {
      title,
      meta: metaArr,
      link: linkArr,
      script: scriptArr,
    }
  })
}
