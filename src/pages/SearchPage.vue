<!-- src/pages/SearchPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="container">
      <!-- Header de recherche -->
      <div class="search-header q-mb-lg">
        <h1 class="text-h4 q-mb-md">
          Résultats de recherche
          <span v-if="searchQuery" class="text-primary">pour "{{ searchQuery }}"</span>
        </h1>

        <div class="row items-center justify-between q-mb-md">
          <div class="text-body2 text-grey-7">
            {{ totalResults }} produit{{ totalResults > 1 ? 's' : '' }} trouvé{{
              totalResults > 1 ? 's' : ''
            }}
          </div>

          <!-- Filtres de tri -->
          <q-select
            v-model="sortBy"
            :options="sortOptions"
            label="Trier par"
            outlined
            dense
            style="min-width: 200px"
            @update:model-value="onSortChange"
          />
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-dots size="50px" color="primary" />
        <div class="text-body2 q-mt-md">Recherche en cours...</div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center q-py-xl">
        <q-icon name="error_outline" size="50px" color="negative" />
        <div class="text-h6 q-mt-md text-negative">{{ error }}</div>
        <q-btn label="Réessayer" color="primary" @click="performSearch" class="q-mt-md" />
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="products.length === 0 && searchQuery" class="text-center q-py-xl">
        <q-icon name="search_off" size="50px" color="grey-5" />
        <div class="text-h6 q-mt-md">Aucun produit trouvé</div>
        <div class="text-body2 text-grey-7 q-mt-sm">
          Essayez avec d'autres mots-clés ou parcourez nos catégories
        </div>
        <q-btn label="Voir toutes les catégories" color="primary" flat to="/" class="q-mt-md" />
      </div>

      <!-- Résultats -->
      <div v-else>
        <ProductGrid :products="products" />

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="text-center q-mt-xl">
          <q-pagination
            v-model="currentPage"
            :max="pagination.last_page"
            :max-pages="7"
            boundary-numbers
            @update:model-value="onPageChange"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ProductGrid from 'components/ProductGrid.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from 'stores/products'

const route = useRoute()
const productsStore = useProductsStore()

// State
const currentPage = ref(1)
const sortBy = ref({ label: 'Plus récent', value: 'created_at:desc' })

// Computed
const searchQuery = computed(() => route.query.q || '')
const products = computed(() => productsStore.getProducts)
const loading = computed(() => productsStore.isLoading)
const error = computed(() => productsStore.error)
const pagination = computed(() => productsStore.getPagination)
const totalResults = computed(() => pagination.value.total || products.value.length)

// Options de tri
const sortOptions = [
  { label: 'Plus récent', value: 'created_at:desc' },
  { label: 'Plus ancien', value: 'created_at:asc' },
  { label: 'Prix croissant', value: 'price:asc' },
  { label: 'Prix décroissant', value: 'price:desc' },
  { label: 'Nom A-Z', value: 'name:asc' },
  { label: 'Nom Z-A', value: 'name:desc' },
]

// Methods
const performSearch = async () => {
  if (!searchQuery.value) return

  const [sortField, sortOrder] = sortBy.value.value.split(':')

  await productsStore.searchProducts(searchQuery.value, {
    page: currentPage.value,
    sort_by: sortField,
    sort_order: sortOrder,
  })
}

const onSortChange = () => {
  currentPage.value = 1
  performSearch()
}

const onPageChange = (page) => {
  currentPage.value = page
  performSearch()

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watchers
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery !== searchQuery.value) {
      currentPage.value = 1
      performSearch()
    }
  },
)

// Lifecycle
onMounted(() => {
  if (searchQuery.value) {
    performSearch()
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}
</style>
