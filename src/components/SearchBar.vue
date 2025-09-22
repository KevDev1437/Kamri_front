<!-- src/components/SearchBar.vue -->
<template>
  <div class="search-bar-wrapper q-py-xl">
    <div class="search-container">
      <q-input
        dense
        outlined
        rounded
        placeholder="Rechercher des produits..."
        v-model="searchTerm"
        @keyup.enter="onSearch"
        @focus="showSuggestions = searchResults.length > 0"
        class="search-input"
        style="width: 100%; min-height: 40px"
      >
        <template #append>
          <div class="row items-center">
            <q-icon name="camera_alt" @click="onCameraClick" class="cursor-pointer q-mr-sm" />
            <q-separator vertical color="grey-5" class="q-mx-sm" />
            <q-icon name="search" @click="onSearch" class="cursor-pointer" />
          </div>
        </template>
      </q-input>

      <!-- Suggestions de recherche -->
      <q-menu v-model="showSuggestions" fit no-parent-event class="search-suggestions">
        <q-list>
          <q-item
            v-for="product in searchResults"
            :key="product.id"
            clickable
            v-ripple
            @click="selectSuggestion(product)"
          >
            <q-item-section avatar>
              <q-avatar square size="40px">
                <img :src="product.image" :alt="product.name" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ product.name }}</q-item-label>
              <q-item-label caption>{{ product.price }}€</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from 'stores/products'
import { debounce } from 'quasar'

const router = useRouter()
const productsStore = useProductsStore()
const searchTerm = ref('')
const showSuggestions = ref(false)
const searchResults = ref([])

// Recherche avec debounce pour éviter trop d'appels API
const debouncedSearch = debounce(async (query) => {
  if (query.length > 2) {
    try {
      await productsStore.searchProducts(query)
      searchResults.value = productsStore.getProducts.slice(0, 5) // Limiter à 5 suggestions
      showSuggestions.value = true
    } catch (error) {
      console.error('Erreur de recherche:', error)
    }
  } else {
    searchResults.value = []
    showSuggestions.value = false
  }
}, 300)

// Observer les changements du terme de recherche
watch(searchTerm, (newValue) => {
  if (newValue.trim()) {
    debouncedSearch(newValue)
  } else {
    showSuggestions.value = false
    searchResults.value = []
  }
})

function onSearch() {
  if (!searchTerm.value.trim()) return
  showSuggestions.value = false
  router.push({
    path: '/products',
    query: { q: searchTerm.value },
  })
}

function selectSuggestion(product) {
  showSuggestions.value = false
  router.push({
    path: `/product/${product.id}`,
    params: { id: product.id },
  })
}

function onCameraClick() {
  // À implémenter : logique pour la fonctionnalité de caméra
  console.log('Camera clicked - Recherche visuelle à venir')
}
</script>

<style scoped>
/* Wrapper adds vertical padding */
.search-bar-wrapper {
  width: 100%;
}

.search-container {
  position: relative;
  width: 100%;
}

:deep(.q-field__append) {
  padding-right: 8px;
}

.search-suggestions {
  max-height: 300px;
  overflow-y: auto;
}

.search-suggestions .q-item {
  min-height: 60px;
}

.search-suggestions .q-item:hover {
  background-color: #f5f5f5;
}
</style>
