<template>
  <div>
    <!-- Grille responsive avec Quasar -->
    <div class="row q-col-gutter-md">
      <div
        v-for="product in displayProducts"
        :key="product.id"
        class="col-6 col-md-4 col-lg-2"
      >
        <ProductCard :product="product" />
      </div>
    </div>

    <!-- Bouton Voir plus -->
    <div class="text-center q-mt-lg" v-if="products.length > 50">
      <q-btn flat color="primary" label="Voir plus" @click="goToAll" />
    </div>
  </div>
</template>

<script setup>
import ProductCard from 'components/ProductCard.vue'; /* <-- nouvel import */
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  products: { type: Array, default: () => [] }
})

const router = useRouter()

/* 10 lignes × 5 colonnes → 50 produits */
const displayProducts = computed(() => props.products.slice(0, 50))

function goToAll () {
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
