<!-- src/pages/CategoryPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="container">
      <!-- Header de catégorie -->
      <div v-if="category" class="category-header q-mb-lg">
        <div class="row items-center q-mb-md">
          <div class="col">
            <h1 class="text-h4">{{ category.name }}</h1>
            <p v-if="category.description" class="text-body1 text-grey-7">
              {{ category.description }}
            </p>
          </div>
          <div class="col-auto">
            <q-img
              v-if="category.image"
              :src="category.image"
              :alt="category.name"
              style="width: 100px; height: 100px"
              class="rounded-borders"
            />
          </div>
        </div>

        <div class="row items-center justify-between">
          <div class="text-body2 text-grey-7">
            {{ totalProducts }} produit{{ totalProducts > 1 ? 's' : '' }} dans cette catégorie
          </div>

          <!-- Filtres et tri -->
          <div class="row q-gutter-md">
            <q-select
              v-model="sortBy"
              :options="sortOptions"
              label="Trier par"
              outlined
              dense
              style="min-width: 200px"
              @update:model-value="onSortChange"
            />

            <q-select
              v-model="priceRange"
              :options="priceRangeOptions"
              label="Prix"
              outlined
              dense
              style="min-width: 150px"
              @update:model-value="onPriceChange"
              clearable
            />
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-dots size="50px" color="primary" />
        <div class="text-body2 q-mt-md">Chargement des produits...</div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center q-py-xl">
        <q-icon name="error_outline" size="50px" color="negative" />
        <div class="text-h6 q-mt-md text-negative">{{ error }}</div>
        <q-btn label="Réessayer" color="primary" @click="fetchProducts" class="q-mt-md" />
      </div>

      <!-- Aucun produit -->
      <div v-else-if="products.length === 0" class="text-center q-py-xl">
        <q-icon name="inventory_2" size="50px" color="grey-5" />
        <div class="text-h6 q-mt-md">Aucun produit dans cette catégorie</div>
        <div class="text-body2 text-grey-7 q-mt-sm">
          Revenez bientôt pour découvrir nos nouveautés
        </div>
        <q-btn label="Voir toutes les catégories" color="primary" flat to="/" class="q-mt-md" />
      </div>

      <!-- Produits -->
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

      <!-- Sous-catégories -->
      <div v-if="category?.children && category.children.length > 0" class="subcategories q-mt-xl">
        <q-separator class="q-mb-lg" />
        <h3 class="text-h6 q-mb-md">Sous-catégories</h3>
        <div class="row q-col-gutter-md">
          <div v-for="subcat in category.children" :key="subcat.id" class="col-6 col-sm-4 col-md-3">
            <q-card
              class="cursor-pointer hover-lift"
              @click="$router.push({ name: 'category', params: { id: subcat.id } })"
            >
              <q-img
                :src="subcat.image || 'https://via.placeholder.com/200x150'"
                :alt="subcat.name"
                ratio="4/3"
              />
              <q-card-section>
                <div class="text-subtitle2">{{ subcat.name }}</div>
              </q-card-section>
            </q-card>
          </div>
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
import { api } from 'boot/axios'

const route = useRoute()
const productsStore = useProductsStore()

// State
const category = ref(null)
const currentPage = ref(1)
const sortBy = ref({ label: 'Plus récent', value: 'created_at:desc' })
const priceRange = ref(null)
const loading = ref(false)
const error = ref(null)

// Computed
const categoryId = computed(() => route.params.id)
const products = computed(() => productsStore.getProducts)
const pagination = computed(() => productsStore.getPagination)
const totalProducts = computed(() => pagination.value.total || products.value.length)

// Options
const sortOptions = [
  { label: 'Plus récent', value: 'created_at:desc' },
  { label: 'Plus ancien', value: 'created_at:asc' },
  { label: 'Prix croissant', value: 'price:asc' },
  { label: 'Prix décroissant', value: 'price:desc' },
  { label: 'Nom A-Z', value: 'name:asc' },
  { label: 'Nom Z-A', value: 'name:desc' },
]

const priceRangeOptions = [
  { label: 'Moins de 25€', value: '0-25' },
  { label: '25€ - 50€', value: '25-50' },
  { label: '50€ - 100€', value: '50-100' },
  { label: '100€ - 200€', value: '100-200' },
  { label: 'Plus de 200€', value: '200-999999' },
]

// Methods
const fetchCategory = async () => {
  try {
    const response = await api.get(`/api/categories/${categoryId.value}`)
    category.value = response.data
  } catch (err) {
    console.error('Error fetching category:', err)
    error.value = 'Catégorie non trouvée'
  }
}

const fetchProducts = async () => {
  const [sortField, sortOrder] = sortBy.value.value.split(':')

  const params = {
    category_id: categoryId.value,
    page: currentPage.value,
    sort_by: sortField,
    sort_order: sortOrder,
  }

  // Ajouter le filtre de prix si sélectionné
  if (priceRange.value) {
    const [minPrice, maxPrice] = priceRange.value.split('-')
    params.min_price = minPrice
    params.max_price = maxPrice
  }

  await productsStore.fetchProducts(params)
}

const onSortChange = () => {
  currentPage.value = 1
  fetchProducts()
}

const onPriceChange = () => {
  currentPage.value = 1
  fetchProducts()
}

const onPageChange = (page) => {
  currentPage.value = page
  fetchProducts()

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watchers
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      currentPage.value = 1
      sortBy.value = { label: 'Plus récent', value: 'created_at:desc' }
      priceRange.value = null
      fetchCategory()
      fetchProducts()
    }
  },
)

// Lifecycle
onMounted(() => {
  fetchCategory()
  fetchProducts()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.category-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.hover-lift {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>
