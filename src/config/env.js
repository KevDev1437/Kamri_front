// Configuration des variables d'environnement
export const ENV_CONFIG = {
  // URL du site (pour SEO, sitemap, etc.)
  SITE_URL: import.meta.env.VITE_SITE_URL || 'http://localhost:9000',

  // API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',

  // Stripe
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,

  // Mode de développement
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
}
