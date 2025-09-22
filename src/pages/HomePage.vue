<!-- src/pages/HomePage.vue -->
<template>
  <q-page class="kamri-homepage">
    <!-- Hero Section avec gradient premium -->
    <section class="hero-section">
      <div class="hero-banner">
        <div class="container-1200 q-px-md q-px-lg-none">
          <div class="hero-content">
            <div class="hero-text">
              <h1 class="hero-title">DÉCOUVREZ LES NOUVEAUTÉS AUTOMNALES</h1>
              <p class="hero-subtitle">Jusqu'à -70% sur des milliers d'articles</p>
              <div class="hero-actions">
                <q-btn
                  class="hero-btn"
                  size="lg"
                  label="Découvrir"
                  color="secondary"
                  unelevated
                  no-caps
                  rounded
                  to="/products"
                />
              </div>
            </div>
            <div class="hero-image">
              <div class="product-showcase">
                <div class="product-item">
                  <q-icon name="shopping_bag" size="60px" color="white" />
                </div>
                <div class="product-item">
                  <q-icon name="phone" size="60px" color="white" />
                </div>
                <div class="product-item">
                  <q-icon name="watch" size="60px" color="white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Éléments décoratifs flottants -->
        <div class="hero-decoration">
          <q-icon name="auto_awesome" size="40px" color="white" class="float-slow decoration-1" />
          <q-icon name="star" size="32px" color="white" class="float-slow decoration-2" />
          <q-icon name="favorite" size="28px" color="white" class="float-slow decoration-3" />
        </div>
      </div>
    </section>

    <!-- Contenu Principal avec rythme vertical -->
    <!-- Style Quiz -->
    <section class="section">
      <div class="container-1200 q-px-md q-px-lg-none">
        <StyleQuiz />
      </div>
    </section>

    <!-- Catégories Populaires -->
    <section class="section section--alt">
      <div class="container-1200 q-px-md q-px-lg-none">
        <div class="section-header">
          <h2 class="section-title">CATÉGORIES POPULAIRES</h2>
          <p class="section-subtitle">Découvrez nos meilleures collections</p>
        </div>
        <CategoryGrid :categories="categories" />
      </div>
    </section>

    <!-- Produits Tendances -->
    <section class="section">
      <div class="container-1200 q-px-md q-px-lg-none">
        <div class="section-header">
          <h2 class="section-title">TENDANCES DU MOMENT</h2>
          <p class="section-subtitle">Les produits les plus vendus</p>
        </div>
        <ProductGrid :products="featuredProducts" />
      </div>
    </section>

    <!-- Live Shopping -->
    <section class="section section--dark">
      <div class="container-1200 q-px-md q-px-lg-none">
        <LiveVideo :stream-url="liveStreamUrl" />
      </div>
    </section>

    <!-- Gamification -->
    <section class="section section--alt">
      <div class="container-1200 q-px-md q-px-lg-none">
        <GamificationControls />
      </div>
    </section>

    <!-- Magazine -->
    <section class="section">
      <div class="container-1200 q-px-md q-px-lg-none">
        <div class="section-header">
          <h2 class="section-title">MAGAZINE KAMRI</h2>
          <p class="section-subtitle">Conseils, tendances et inspirations</p>
        </div>
        <MagazineSection :articles="magazineArticles" />
      </div>
    </section>
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
import { useRoute } from 'vue-router'
import { useProductsStore } from 'stores/products'
import { useCategoriesStore } from 'stores/categories'
import { useMagazineStore } from 'stores/magazine'
import { useLiveStore } from 'stores/live'
import { useSeo } from 'src/composables/useSeo'
import { buildCanonical, breadcrumbJsonLd } from 'src/utils/seo'

// Stores
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const magazineStore = useMagazineStore()
const liveStore = useLiveStore()

// SEO
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:9000'
const route = useRoute()

useSeo({
  title: 'KAMRI – Nouveautés exclusives',
  description: 'Découvrez nos meilleures sélections : mode, high-tech, maison et plus.',
  canonical: buildCanonical(SITE_URL, route.fullPath),
  image: '/og-default.jpg',
  jsonLd: [breadcrumbJsonLd(SITE_URL, [{ name: 'Accueil', path: '/' }])],
})

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

<style lang="scss" scoped>
@use 'src/css/_tokens.scss' as *;

.kamri-homepage {
  background: $bg-soft;
}

// === HERO SECTION ===
.hero-section {
  position: relative;
  overflow: hidden;
}

.hero-banner {
  @extend %grad-hero;
  min-height: 70vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 3rem 0;

  // Fine vignette pour la profondeur
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
    pointer-events: none;
  }
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}

.hero-text {
  text-align: center;
  color: white;

  @media (min-width: 1024px) {
    text-align: left;
  }
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 4rem;
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.4;
  margin-bottom: 2rem;
  opacity: 0.95;
  font-weight: 600;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 1024px) {
    margin-left: 0;
    margin-right: 0;
  }
}

.hero-actions {
  display: flex;
  justify-content: center;

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
}

.hero-btn {
  min-width: 220px;
  height: 60px;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: $shadow-2;

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      $shadow-2,
      0 0 30px rgba(249, 115, 22, 0.4);
  }
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-showcase {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.product-item {
  width: 130px;
  height: 130px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: float 4s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 0 0.5rem;

  &:nth-child(2) {
    animation-delay: 1s;
  }

  &:nth-child(3) {
    animation-delay: 2s;
  }
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.decoration-1 {
  position: absolute;
  top: 15%;
  left: 10%;
  opacity: 0.25;
}

.decoration-2 {
  position: absolute;
  top: 25%;
  right: 15%;
  opacity: 0.25;
  animation-delay: 2s;
}

.decoration-3 {
  position: absolute;
  bottom: 20%;
  left: 20%;
  opacity: 0.25;
  animation-delay: 4s;
}

// === SECTIONS ===
.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: $dark;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: -0.01em;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
}
</style>
