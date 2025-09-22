<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useSeo } from 'src/composables/useSeo'
import { orgJsonLd, websiteJsonLd } from 'src/utils/seo'
import 'src/data/mockProducts.js'

const authStore = useAuthStore()

// SEO global
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:9000'

useSeo({
  title: 'KAMRI Marketplace',
  description: 'Marketplace moderne pour découvrir et acheter les produits tendance.',
  canonical: SITE_URL,
  image: '/og-default.jpg',
  jsonLd: [orgJsonLd(SITE_URL), websiteJsonLd(SITE_URL)],
})

onMounted(async () => {
  // Initialiser l'authentification au démarrage de l'application
  await authStore.initAuth()
})
</script>
