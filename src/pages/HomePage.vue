<!-- src/pages/HomePage.vue -->
<template>
  <q-page class="bg-grey-1">
    <!-- Hero Banner -->
    <section class="hero-banner q-pa-xl text-center text-white" style="background: #2d3748">
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
      <div class="q-mt-xl">
        <h2 class="text-h5 q-mb-lg">Nos catégories</h2>
        <CategoryGrid :categories="categories" />
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
import CategoryGrid from 'components/CategoryGrid.vue'
import GamificationControls from 'components/GamificationControls.vue'
import LiveVideo from 'components/LiveVideo.vue'
import MagazineSection from 'components/MagazineSection.vue'
import StyleQuiz from 'components/StyleQuiz.vue'
import ProductGrid from 'src/components/ProductGrid.vue'
import { onMounted, computed } from 'vue'
import { useProductsStore } from 'stores/products'
import { useCategoriesStore } from 'stores/categories'
import { useMagazineStore } from 'stores/magazine'
import { useLiveStore } from 'stores/live'

// Stores
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const magazineStore = useMagazineStore()
const liveStore = useLiveStore()

// Computed properties
const categories = computed(() => categoriesStore.getAllCategories)
const featuredProducts = computed(() => productsStore.getFeaturedProducts)
const liveStreamUrl = computed(
  () => liveStore.getCurrentStream?.url || 'https://via.placeholder.com/800x450',
)
const magazineArticles = computed(() => magazineStore.getRecentArticles)

onMounted(async () => {
  try {
    // Charger toutes les données en parallèle
    await Promise.all([
      categoriesStore.fetchCategories(),
      productsStore.fetchFeaturedProducts(),
      liveStore.fetchCurrentStream(),
      magazineStore.fetchArticles(4),
    ])
  } catch (err) {
    console.error('Erreur lors du chargement des données:', err)
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
