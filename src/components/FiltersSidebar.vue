<template>
  <div class="filters-sidebar">
    <q-form @submit.prevent="applyFilters" class="q-gutter-md">
      <!-- Recherche -->
      <q-expansion-item
        icon="search"
        label="Recherche"
        :default-opened="!!catalog.q"
        header-class="text-weight-medium"
      >
        <q-input
          v-model="localFilters.q"
          label="Rechercher dans les produits"
          outlined
          dense
          clearable
          :debounce="300"
          @update:model-value="onSearchChange"
          aria-label="Rechercher dans les produits"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-expansion-item>

      <!-- Catégorie -->
      <q-expansion-item
        icon="category"
        label="Catégorie"
        :default-opened="!!catalog.category"
        header-class="text-weight-medium"
      >
        <q-option-group
          v-model="localFilters.category"
          :options="categoryOptions"
          type="radio"
          @update:model-value="onFilterChange"
        />
      </q-expansion-item>

      <!-- Prix -->
      <q-expansion-item
        icon="euro"
        label="Prix"
        :default-opened="catalog.price.min > 0 || catalog.price.max < 1000"
        header-class="text-weight-medium"
      >
        <div class="q-gutter-sm">
          <q-range
            v-model="localFilters.price"
            :min="0"
            :max="1000"
            :step="10"
            label
            @update:model-value="onPriceChange"
            aria-label="Plage de prix"
          />
          <div class="row q-gutter-xs">
            <q-input
              v-model.number="localFilters.price.min"
              type="number"
              label="Min (€)"
              outlined
              dense
              :min="0"
              :max="localFilters.price.max"
              @update:model-value="onPriceInputChange"
              class="col"
            />
            <q-input
              v-model.number="localFilters.price.max"
              type="number"
              label="Max (€)"
              outlined
              dense
              :min="localFilters.price.min"
              :max="1000"
              @update:model-value="onPriceInputChange"
              class="col"
            />
          </div>
        </div>
      </q-expansion-item>

      <!-- Marques -->
      <q-expansion-item
        icon="business"
        label="Marques"
        :default-opened="catalog.brands.length > 0"
        header-class="text-weight-medium"
      >
        <q-input
          v-model="brandSearch"
          label="Rechercher une marque"
          outlined
          dense
          clearable
          class="q-mb-sm"
          aria-label="Rechercher une marque"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-option-group
          v-model="localFilters.brands"
          :options="filteredBrandOptions"
          type="checkbox"
          @update:model-value="onFilterChange"
        />
      </q-expansion-item>

      <!-- Note minimale -->
      <q-expansion-item
        icon="star"
        label="Note minimale"
        :default-opened="catalog.ratingMin > 0"
        header-class="text-weight-medium"
      >
        <div class="q-gutter-sm">
          <q-rating
            v-model="localFilters.ratingMin"
            :max="5"
            size="2em"
            @update:model-value="onFilterChange"
            aria-label="Note minimale"
          />
          <div class="text-caption text-grey-6">
            {{
              localFilters.ratingMin > 0 ? `${localFilters.ratingMin}+ étoiles` : 'Toutes les notes'
            }}
          </div>
        </div>
      </q-expansion-item>

      <!-- Disponibilité -->
      <q-expansion-item
        icon="inventory"
        label="Disponibilité"
        :default-opened="catalog.inStock"
        header-class="text-weight-medium"
      >
        <q-toggle
          v-model="localFilters.inStock"
          label="En stock seulement"
          @update:model-value="onFilterChange"
        />
      </q-expansion-item>

      <!-- Éco-score -->
      <q-expansion-item
        icon="eco"
        label="Éco-score"
        :default-opened="catalog.ecoMin > 0"
        header-class="text-weight-medium"
      >
        <div class="q-gutter-sm">
          <q-slider
            v-model="localFilters.ecoMin"
            :min="0"
            :max="100"
            :step="10"
            label
            label-always
            @update:model-value="onFilterChange"
            aria-label="Éco-score minimum"
          />
          <div class="text-caption text-grey-6">
            {{
              localFilters.ecoMin > 0 ? `Éco-score ${localFilters.ecoMin}+` : 'Tous les éco-scores'
            }}
          </div>
        </div>
      </q-expansion-item>

      <!-- Promo -->
      <q-expansion-item
        icon="local_offer"
        label="Promotions"
        :default-opened="catalog.promo"
        header-class="text-weight-medium"
      >
        <q-toggle
          v-model="localFilters.promo"
          label="En promo seulement"
          @update:model-value="onFilterChange"
        />
      </q-expansion-item>

      <!-- Actions -->
      <div class="q-pt-md">
        <q-btn
          color="primary"
          label="Appliquer les filtres"
          class="full-width"
          @click="applyFilters"
          :loading="catalog.loading"
        />
        <q-btn
          v-if="catalog.hasActiveFilters"
          flat
          color="grey-7"
          label="Réinitialiser tout"
          class="full-width q-mt-sm"
          @click="resetFilters"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCatalogStore } from 'stores/catalog'
import { debounce } from 'quasar'

const catalog = useCatalogStore()

// State local pour éviter les mises à jour trop fréquentes
const localFilters = ref({
  q: '',
  category: null,
  brands: [],
  price: { min: 0, max: 1000 },
  ratingMin: 0,
  inStock: false,
  ecoMin: 0,
  promo: false,
})

const brandSearch = ref('')

// Options pour les catégories (à remplacer par des données du backend)
const categoryOptions = ref([
  { label: 'Toutes les catégories', value: null },
  { label: 'Vêtements', value: 'clothing' },
  { label: 'Chaussures', value: 'shoes' },
  { label: 'Accessoires', value: 'accessories' },
  { label: 'Électronique', value: 'electronics' },
  { label: 'Maison & Jardin', value: 'home' },
  { label: 'Sport', value: 'sport' },
  { label: 'Beauté', value: 'beauty' },
])

// Options pour les marques (à remplacer par des données du backend)
const brandOptions = ref([
  { label: 'Nike', value: 'nike' },
  { label: 'Adidas', value: 'adidas' },
  { label: 'Zara', value: 'zara' },
  { label: 'H&M', value: 'hm' },
  { label: 'Uniqlo', value: 'uniqlo' },
  { label: 'Apple', value: 'apple' },
  { label: 'Samsung', value: 'samsung' },
  { label: 'Sony', value: 'sony' },
  { label: 'Dyson', value: 'dyson' },
  { label: 'Philips', value: 'philips' },
])

// Marques filtrées par recherche
const filteredBrandOptions = computed(() => {
  if (!brandSearch.value) return brandOptions.value

  return brandOptions.value.filter((brand) =>
    brand.label.toLowerCase().includes(brandSearch.value.toLowerCase()),
  )
})

// Synchroniser les filtres locaux avec le store
const syncLocalFilters = () => {
  localFilters.value = {
    q: catalog.q,
    category: catalog.category,
    brands: [...catalog.brands],
    price: { ...catalog.price },
    ratingMin: catalog.ratingMin,
    inStock: catalog.inStock,
    ecoMin: catalog.ecoMin,
    promo: catalog.promo,
  }
}

// Appliquer les filtres
const applyFilters = () => {
  catalog.q = localFilters.value.q
  catalog.category = localFilters.value.category
  catalog.brands = [...localFilters.value.brands]
  catalog.price = { ...localFilters.value.price }
  catalog.ratingMin = localFilters.value.ratingMin
  catalog.inStock = localFilters.value.inStock
  catalog.ecoMin = localFilters.value.ecoMin
  catalog.promo = localFilters.value.promo
  catalog.page = 1
}

// Réinitialiser les filtres
const resetFilters = () => {
  catalog.resetFilters()
  syncLocalFilters()
}

// Gestionnaires d'événements avec debounce
const onSearchChange = debounce(() => {
  onFilterChange()
}, 300)

const onPriceChange = debounce(() => {
  onFilterChange()
}, 500)

const onPriceInputChange = debounce(() => {
  // S'assurer que min <= max
  if (localFilters.value.price.min > localFilters.value.price.max) {
    localFilters.value.price.min = localFilters.value.price.max
  }
  if (localFilters.value.price.max < localFilters.value.price.min) {
    localFilters.value.price.max = localFilters.value.price.min
  }
  onFilterChange()
}, 500)

const onFilterChange = debounce(() => {
  applyFilters()
}, 300)

// Émettre les événements
const emit = defineEmits(['update:filters', 'reset', 'apply'])

// Watchers pour émettre les événements
watch(
  () => localFilters.value,
  () => {
    emit('update:filters', localFilters.value)
  },
  { deep: true },
)

// Lifecycle
onMounted(() => {
  syncLocalFilters()
})
</script>

<style scoped>
.filters-sidebar {
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.q-expansion-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
}

.q-expansion-item:last-child {
  margin-bottom: 0;
}
</style>
