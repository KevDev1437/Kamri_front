// scripts/generate-sitemap.mjs
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.resolve(__dirname, '../public')

const SITE_URL = process.env.VITE_SITE_URL || 'http://localhost:9000'

function xmlEscape(s = '') {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function getAllProducts() {
  try {
    // TODO: adapter à ton API réelle (pagination !)
    const resp = await fetch('http://localhost:8000/api/products?perPage=1000')
    const data = await resp.json()
    return Array.isArray(data.items) ? data.items : []
  } catch (e) {
    console.warn('[sitemap] Impossible de charger /api/products, fallback vide.')
    return []
  }
}

async function getAllArticles() {
  try {
    const resp = await fetch('http://localhost:8000/api/magazine?perPage=1000')
    const data = await resp.json()
    return Array.isArray(data.items) ? data.items : []
  } catch (e) {
    return []
  }
}

function urlEntry(
  loc,
  changefreq = 'weekly',
  priority = '0.7',
  lastmod = new Date().toISOString(),
) {
  return `
  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function main() {
  const staticUrls = ['/', '/products', '/magazine'].map(
    (p) => `${SITE_URL.replace(/\/+$/, '')}${p}`,
  )

  const products = await getAllProducts()
  const productUrls = products.map((p) => `${SITE_URL.replace(/\/+$/, '')}/product/${p.id}`)

  const articles = await getAllArticles()
  const articleUrls = articles.map((a) => `${SITE_URL.replace(/\/+$/, '')}/magazine/${a.id}`)

  const urls = [...staticUrls, ...productUrls, ...articleUrls]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((u) => urlEntry(u, 'daily', '0.8')).join('\n')}
  </urlset>`

  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), body, 'utf-8')
  console.log(`[sitemap] Généré ${urls.length} URLs -> public/sitemap.xml`)
}

main().catch((err) => {
  console.error('[sitemap] Erreur:', err)
  process.exit(1)
})
