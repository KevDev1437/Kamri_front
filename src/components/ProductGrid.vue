<template>
  <div class="product-grid-container">
    <!-- Grille CSS Grid -->
    <div class="product-grid" :class="{ loading }">
      <!-- Loading state avec skeletons -->
      <template v-if="loading">
        <ProductCardSkeleton v-for="i in skeletonCount" :key="'skeleton-' + i" />
      </template>

      <!-- Produits -->
      <ProductCard
        v-for="product in visibleItems"
        :key="product.id"
        :product="product"
        @click="goToProduct"
        @favorite="toggleFavorite"
        @add-to-cart="addToCart"
        @quick-view="quickView"
      />
    </div>

    <!-- Pagination "Voir plus" -->
    <div class="load-more-section" v-if="hasMore">
      <q-btn
        color="primary"
        label="Voir plus"
        icon="expand_more"
        no-caps
        rounded
        size="lg"
        :loading="loading"
        @click="loadMore"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from 'components/ProductCard.vue'
import ProductCardSkeleton from 'components/ProductCardSkeleton.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCartStore } from 'stores/cart'

const props = defineProps({
  products: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  pageSize: { type: Number, default: 50 },
})

const emit = defineEmits(['load-more', 'quick-view'])

const router = useRouter()
const $q = useQuasar()
const cart = useCartStore()

// État de pagination
const page = ref(1)

// Computed properties
const visibleCount = computed(() => page.value * props.pageSize)
const visibleItems = computed(() => props.products.slice(0, visibleCount.value))
const hasMore = computed(() => props.products.length > visibleCount.value)
const skeletonCount = computed(() => Math.min(15, props.pageSize))

function goToProduct(product) {
  router.push({ name: 'product', params: { id: product.id } })
}

function toggleFavorite(product) {
  // TODO: Implémenter la logique des favoris
  $q.notify({
    type: 'positive',
    message: `${product.name} ajouté aux favoris`,
    position: 'top',
  })
}

function addToCart(product) {
  cart.add({ id: product.id, name: product.name, price: product.price, image: product.image }, 1)
  $q.notify({
    type: 'positive',
    message: `${product.name} ajouté au panier`,
    position: 'top',
  })
}

function quickView(product) {
  emit('quick-view', product)
  // TODO: Ouvrir modal d'aperçu rapide
  $q.notify({
    type: 'info',
    message: `Aperçu rapide de ${product.name}`,
    position: 'top',
  })
}

function loadMore() {
  page.value++
  emit('load-more', { page: page.value, pageSize: props.pageSize })
}
</script>

<style lang="scss" scoped>
@use 'src/css/_tokens.scss' as *;

.product-grid-container {
  width: 100%;
}

.product-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
    max-width: 1200px;
    margin: 0 auto;
  }
}

.load-more-section {
  text-align: center;
  margin-top: 2rem;
  padding: 1.5rem 0;
}

.load-more-btn {
  min-width: 200px;
  height: 48px;
  font-weight: 600;
  border-radius: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-2;
  }
}
</style>
