<template>
  <div>
    <!-- Grille responsive avec Quasar -->
    <div class="row q-col-gutter-md">
      <div v-for="product in displayProducts" :key="product.id" class="col-6 col-md-4 col-lg-2">
        <ProductCard
          :product="product"
          @click="goToProduct"
          @favorite="toggleFavorite"
          @add-to-cart="addToCart"
        />
      </div>
    </div>

    <!-- Bouton Voir plus -->
    <div class="text-center q-mt-lg" v-if="products.length > 50">
      <q-btn flat color="primary" label="Voir plus" @click="goToAll" />
    </div>
  </div>
</template>

<script setup>
import ProductCard from 'components/ProductCard.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const props = defineProps({
  products: { type: Array, default: () => [] },
})

const router = useRouter()
const $q = useQuasar()

/* 10 lignes × 5 colonnes → 50 produits */
const displayProducts = computed(() => props.products.slice(0, 50))

function goToProduct(product) {
  router.push({ name: 'product', params: { id: product.id } })
}

function toggleFavorite() {
  // TODO: Implémenter la logique des favoris
  $q.notify({
    type: 'positive',
    message: 'Produit ajouté aux favoris',
    position: 'top',
  })
}

function addToCart(product) {
  // TODO: Implémenter l'ajout au panier
  $q.notify({
    type: 'positive',
    message: `${product.name} ajouté au panier`,
    position: 'top',
  })
}

function goToAll() {
  router.push('/products')
}
</script>

<style scoped>
.product-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
}
</style>
