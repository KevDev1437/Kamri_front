<!-- src/pages/HomePage.vue -->
<template>
  <q-page class="bg-grey-1">

    <!-- Hero Banner -->
    <section class="hero-banner q-pa-xl text-center text-white" style="background:#2D3748">
      <div class="container q-px-md q-px-lg-none">
        <h1 class="text-h2 q-mb-md">Découvrez nos nouveautés exclusives</h1>
        <q-btn color="green" label="Découvrir" size="lg" />
      </div>
    </section>

    <!-- CONTENU PRINCIPAL -->
    <div class="container q-px-md q-px-lg-none q-py-xl">

      <!-- Style Quiz -->
      <StyleQuiz />

      <!-- Catégories -->
      <CategoryGrid :categories="categories" class="q-mt-xl" />

      <!-- Mobile -->
      <CategoryPills
        class="q-mb-md flex lg-hide"
        :categories="categories"
        @select="onSelectCat"
      />

      <!-- Desktop -->
      <div class="row justify-between q-gutter-lg gt-sm">
        <CategoryCard
          v-for="cat in categories.slice(0,12)"
          :key="cat.id"
          :category="cat"
        />
      </div>


      <!-- Produits -->
      <div class="q-mt-xl">
        <h2 class="text-h5 q-mb-md">Tendances pour vous</h2>
        <ProductGrid :products="featuredProducts" />
      </div>

      <!-- Live Shopping -->
      <section class="q-mt-xl">
        <LiveVideo :stream-url="liveStreamUrl" />
      </section>

      <!-- Gamification -->
      <GamificationControls class="q-mt-xl" />

      <!-- Magazine -->
      <MagazineSection :articles="magazineArticles" class="q-mt-xl" />
    </div>

  </q-page>
</template>


<script setup>
import { api } from 'boot/axios'
import CategoryGrid from 'components/CategoryGrid.vue'
import GamificationControls from 'components/GamificationControls.vue'
import LiveVideo from 'components/LiveVideo.vue'
import MagazineSection from 'components/MagazineSection.vue'
import StyleQuiz from 'components/StyleQuiz.vue'
import ProductGrid from 'src/components/ProductGrid.vue'
import { onMounted, ref } from 'vue'

// Data refs
const categories = ref([])
const featuredProducts = ref([])
const liveStreamUrl = ref('https://example.com/live')
const magazineArticles = ref([])

// Placeholder data for demo
categories.value = [
  { id: 1, name: 'Mode',    image: 'https://…/mode.jpg',    tag: 'TOP' },
  { id: 2, name: 'Maison',  image: 'https://…/home.jpg' },
  { id: 3, name: 'High-tech', image: 'https://…/tech.jpg' },
  { id: 4, name: 'Sport',   image: 'https://…/sport.jpg' }
]

featuredProducts.value = [
  { id: 1, image: 'https://via.placeholder.com/200x150', name: 'Produit A', price: 29.99 },
  { id: 2, image: 'https://via.placeholder.com/200x150', name: 'Produit B', price: 49.99 },
  { id: 3, image: 'https://via.placeholder.com/200x150', name: 'Produit C', price: 19.99 },
  { id: 4, image: 'https://via.placeholder.com/200x150', name: 'Produit D', price: 39.99 },
  { id: 5, image: 'https://via.placeholder.com/200x150', name: 'Produit E', price: 59.99 },
  { id: 6, image: 'https://via.placeholder.com/200x150', name: 'Produit F', price: 24.99 },
  { id: 7, image: 'https://via.placeholder.com/200x150', name: 'Produit G', price: 34.99 },
  { id: 8, image: 'https://via.placeholder.com/200x150', name: 'Produit H', price: 44.99 },
  { id: 9, image: 'https://via.placeholder.com/200x150', name: 'Produit I', price: 54.99 },
  { id: 10, image: 'https://via.placeholder.com/200x150', name: 'Produit J', price: 64.99 },
  { id: 11, image: 'https://via.placeholder.com/200x150', name: 'Produit K', price: 74.99 },
  { id: 12, image: 'https://via.placeholder.com/200x150', name: 'Produit L', price: 84.99 },
  { id: 13, image: 'https://via.placeholder.com/200x150', name: 'Produit M', price: 94.99 },
  { id: 14, image: 'https://via.placeholder.com/200x150', name: 'Produit N', price: 104.99 },
  { id: 15, image: 'https://via.placeholder.com/200x150', name: 'Produit O', price: 114.99 },
  { id: 16, image: 'https://via.placeholder.com/200x150', name: 'Produit P', price: 124.99 },
  { id: 17, image: 'https://via.placeholder.com/200x150', name: 'Produit Q', price: 134.99 },
  { id: 18, image: 'https://via.placeholder.com/200x150', name: 'Produit R', price: 144.99 },
  { id: 19, image: 'https://via.placeholder.com/200x150', name: 'Produit S', price: 154.99 },
  { id: 20, image: 'https://via.placeholder.com/200x150', name: 'Produit T', price: 164.99 },
  { id: 21, image: 'https://via.placeholder.com/200x150', name: 'Produit U', price: 174.99 },
  { id: 22, image: 'https://via.placeholder.com/200x150', name: 'Produit V', price: 184.99 },
  { id: 23, image: 'https://via.placeholder.com/200x150', name: 'Produit W', price: 194.99 },
  { id: 24, image: 'https://via.placeholder.com/200x150', name: 'Produit X', price: 204.99 },
  { id: 25, image: 'https://via.placeholder.com/200x150', name: 'Produit Y', price: 214.99 },
  { id: 26, image: 'https://via.placeholder.com/200x150', name: 'Produit Z', price: 224.99 },
  { id: 27, image: 'https://via.placeholder.com/200x150', name: 'Produit AA', price: 234.99 },
  { id: 28, image: 'https://via.placeholder.com/200x150', name: 'Produit AB', price: 244.99 },
  { id: 29, image: 'https://via.placeholder.com/200x150', name: 'Produit AC', price: 254.99 },
  { id: 30, image: 'https://via.placeholder.com/200x150', name: 'Produit AD', price: 264.99 },
  { id: 31, image: 'https://via.placeholder.com/200x150', name: 'Produit AE', price: 274.99 },
  { id: 32, image: 'https://via.placeholder.com/200x150', name: 'Produit AF', price: 284.99 },
  { id: 33, image: 'https://via.placeholder.com/200x150', name: 'Produit AG', price: 294.99 },
  { id: 34, image: 'https://via.placeholder.com/200x150', name: 'Produit AH', price: 304.99 },
  { id: 35, image: 'https://via.placeholder.com/200x150', name: 'Produit AI', price: 314.99 },
  { id: 36, image: 'https://via.placeholder.com/200x150', name: 'Produit AJ', price: 324.99 },
  { id: 37, image: 'https://via.placeholder.com/200x150', name: 'Produit AK', price: 334.99 },
  { id: 38, image: 'https://via.placeholder.com/200x150', name: 'Produit AL', price: 344.99 },
  { id: 39, image: 'https://via.placeholder.com/200x150', name: 'Produit AM', price: 354.99 },
  { id: 40, image: 'https://via.placeholder.com/200x150', name: 'Produit AN', price: 364.99 },
  { id: 41, image: 'https://via.placeholder.com/200x150', name: 'Produit AO', price: 374.99 },
  { id: 42, image: 'https://via.placeholder.com/200x150', name: 'Produit AP', price: 384.99 },
  { id: 43, image: 'https://via.placeholder.com/200x150', name: 'Produit AQ', price: 394.99 },
  { id: 44, image: 'https://via.placeholder.com/200x150', name: 'Produit AR', price: 404.99 },
  { id: 45, image: 'https://via.placeholder.com/200x150', name: 'Produit AS', price: 414.99 },
  { id: 46, image: 'https://via.placeholder.com/200x150', name: 'Produit AT', price: 424.99 },
  { id: 47, image: 'https://via.placeholder.com/200x150', name: 'Produit AU', price: 434.99 },
  { id: 48, image: 'https://via.placeholder.com/200x150', name: 'Produit AV', price: 444.99 },
  { id: 49, image: 'https://via.placeholder.com/200x150', name: 'Produit AW', price: 454.99 },
  { id: 50, image: 'https://via.placeholder.com/200x150', name: 'Produit AX', price: 464.99 },
  { id: 51, image: 'https://via.placeholder.com/200x150', name: 'Produit AY', price: 474.99 }
  ]

liveStreamUrl.value = 'https://via.placeholder.com/800x450';
magazineArticles.value = [
  { id: 1, title: 'Lookbook Été 2025', date: 'June 1, 2025', excerpt: 'Découvrez les dernières tendances.', image: 'https://via.placeholder.com/300x200' },
  { id: 2, title: 'Guide Mode Automne', date: 'September 10, 2024', excerpt: 'Préparez votre garde-robe.', image: 'https://via.placeholder.com/300x200' },
  { id: 3, title: 'Guide Mode Automne', date: 'September 10, 2024', excerpt: 'Préparez votre garde-robe.', image: 'https://via.placeholder.com/300x200' },
  { id: 4, title: 'Guide Mode Automne', date: 'September 10, 2024', excerpt: 'Préparez votre garde-robe.', image: 'https://via.placeholder.com/300x200' }
];
magazineArticles.value = [
  { id: 1, title: 'Lookbook Été 2025', date: 'June 1, 2025', excerpt: 'Découvrez les dernières tendances.', image: 'https://via.placeholder.com/300x200' },
  { id: 2, title: 'Guide Mode Automne', date: 'September 10, 2024', excerpt: 'Préparez votre garde-robe.', image: 'https://via.placeholder.com/300x200' },
  { id: 3, title: 'Guide Mode Automne', date: 'September 10, 2024', excerpt: 'Préparez votre garde-robe.', image: 'https://via.placeholder.com/300x200' },
  { id: 4, title: 'Guide Mode Automne', date: 'September 10, 2024', excerpt: 'Préparez votre garde-robe.', image: 'https://via.placeholder.com/300x200' }
];

onMounted(async () => {
  try {
    const [catRes, featRes, liveRes, magRes] = await Promise.all([
      api.get('/api/categories'),
      api.get('/api/products/featured'),
      api.get('/api/live'),
      api.get('/api/magazine')
    ])
    if (Array.isArray(catRes.data) && catRes.data.length) categories.value = catRes.data
    if (Array.isArray(featRes.data) && featRes.data.length) featuredProducts.value = featRes.data
    if (liveRes.data?.url) liveStreamUrl.value = liveRes.data.url
    if (Array.isArray(magRes.data) && magRes.data.length) magazineArticles.value = magRes.data
  } catch (err) {
    console.error('Erreur fetching home data:', err)
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}
.hero-banner {
  border-radius: 8px;
}
</style>
