<template>
  <q-page class="products-page">
    <!-- Mobile: Barre d'outils sticky -->
    <div v-if="$q.screen.lt.md" class="mobile-toolbar">
      <q-toolbar class="bg-white shadow-2">
        <q-btn
          flat
          round
          dense
          icon="filter_list"
          @click="showMobileFilters = true"
          aria-label="Ouvrir les filtres"
        />
        <q-space />
        <div class="text-caption text-grey-7">
          {{ catalog.total }} résultat{{ catalog.total > 1 ? 's' : '' }}
        </div>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="sort"
          @click="showMobileSort = true"
          aria-label="Ouvrir le tri"
        />
      </q-toolbar>
    </div>

    <div class="container">
      <div class="row q-col-gutter-lg">
        <!-- Sidebar Filtres (Desktop) -->
        <div v-if="$q.screen.gt.sm" class="col-3">
          <FiltersSidebar />
        </div>

        <!-- Zone Résultats -->
        <div class="col-12" :class="$q.screen.gt.sm ? 'col-9' : ''">
          <!-- Header Résultats -->
          <div class="results-header q-mb-lg">
            <div class="row items-center justify-between">
              <div class="col-auto">
                <h1 class="text-h5 q-mb-none">Produits</h1>
                <div class="text-caption text-grey-7">
                  {{ catalog.total }} résultat{{ catalog.total > 1 ? 's' : '' }}
                  <span v-if="catalog.hasActiveFilters">
                    ({{ catalog.activeFiltersCount }} filtre{{
                      catalog.activeFiltersCount > 1 ? 's' : ''
                    }}
                    actif{{ catalog.activeFiltersCount > 1 ? 's' : '' }})
                  </span>
                </div>
              </div>

              <div class="col-auto">
                <div class="row items-center q-gutter-sm">
                  <!-- Tri -->
                  <q-select
                    v-model="catalog.sort"
                    :options="sortOptions"
                    outlined
                    dense
                    label="Trier par"
                    @update:model-value="onSortChange"
                    class="sort-select"
                    aria-label="Trier les produits"
                  />

                  <!-- Toggle Vue (préparé pour le futur) -->
                  <q-btn-toggle
                    v-model="viewMode"
                    :options="viewOptions"
                    toggle-color="primary"
                    dense
                    aria-label="Mode d'affichage"
                  />
                </div>
              </div>
            </div>

            <!-- Chips Filtres Actifs -->
            <div v-if="catalog.hasActiveFilters" class="q-mt-md">
              <div class="row q-gutter-xs">
                <q-chip
                  v-for="filter in catalog.activeFilters"
                  :key="filter.key"
                  removable
                  color="primary"
                  text-color="white"
                  @remove="removeFilter(filter.key)"
                  :aria-label="`Supprimer le filtre ${filter.label}`"
                >
                  {{ filter.label }}
                </q-chip>
                <q-btn
                  flat
                  dense
                  color="primary"
                  label="Tout effacer"
                  @click="resetAllFilters"
                  class="q-ml-sm"
                />
              </div>
            </div>
          </div>

          <!-- Erreur -->
          <q-banner v-if="catalog.error" class="bg-negative text-white q-mb-md" rounded>
            <template #avatar>
              <q-icon name="error" />
            </template>
            {{ catalog.error }}
            <template #action>
              <q-btn flat color="white" label="Réessayer" @click="catalog.fetch()" />
            </template>
          </q-banner>

          <!-- Loading Skeleton -->
          <div v-if="catalog.loading && catalog.items.length === 0" class="q-mb-lg">
            <div class="row q-col-gutter-md">
              <div v-for="n in 12" :key="n" class="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCardSkeleton />
              </div>
            </div>
          </div>

          <!-- Grille Produits -->
          <div v-else-if="catalog.items.length > 0">
            <ProductGrid
              :products="catalog.items"
              :columns="$q.screen.gt.lg ? 5 : $q.screen.gt.md ? 4 : $q.screen.gt.sm ? 3 : 2"
            />

            <!-- Bouton Voir Plus -->
            <div v-if="catalog.hasMore" class="text-center q-mt-xl">
              <q-btn
                color="primary"
                outline
                size="lg"
                label="Voir plus de produits"
                :loading="catalog.loading"
                @click="loadMore"
                icon="expand_more"
              />
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state text-center q-pa-xl">
            <q-icon name="inventory_2" size="64px" color="grey-5" />
            <div class="text-h6 q-mt-md text-grey-7">
              Aucun produit ne correspond à vos critères
            </div>
            <div class="text-body2 text-grey-6 q-mt-sm">
              Essayez de modifier vos filtres ou de réinitialiser votre recherche
            </div>
            <q-btn
              color="primary"
              label="Réinitialiser les filtres"
              @click="resetAllFilters"
              class="q-mt-md"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: Drawer Filtres -->
    <q-drawer v-model="showMobileFilters" side="left" :width="300" overlay elevated>
      <div class="q-pa-md">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6">Filtres</div>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="showMobileFilters = false"
            aria-label="Fermer les filtres"
          />
        </div>
        <FiltersSidebar />
      </div>
    </q-drawer>

    <!-- Mobile: Dialog Tri -->
    <q-dialog v-model="showMobileSort">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Trier par</div>
        </q-card-section>
        <q-card-section>
          <q-option-group
            v-model="catalog.sort"
            :options="sortOptions"
            type="radio"
            @update:model-value="onSortChange"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Fermer" @click="showMobileSort = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogStore } from 'stores/catalog'
import { debounce } from 'quasar'
import ProductGrid from 'components/ProductGrid.vue'
import FiltersSidebar from 'components/FiltersSidebar.vue'
import ProductCardSkeleton from 'components/ProductCardSkeleton.vue'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()

// State
const showMobileFilters = ref(false)
const showMobileSort = ref(false)
const viewMode = ref('grid')

// Options de tri
const sortOptions = [
  { label: 'Pertinence', value: 'relevance' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix décroissant', value: 'price_desc' },
  { label: 'Nouveautés', value: 'new' },
  { label: 'Meilleures notes', value: 'rating_desc' },
]

// Options de vue (préparé pour le futur)
const viewOptions = [
  { label: 'Grille', value: 'grid', icon: 'grid_view' },
  { label: 'Liste', value: 'list', icon: 'view_list' },
]

// Fonction pour mettre à jour l'URL avec debounce
const updateURL = debounce(() => {
  const query = catalog.toQuery()
  router.replace({ query })
}, 300)

// Fonction pour charger plus de produits
const loadMore = () => {
  catalog.fetchNext()
}

// Fonction pour supprimer un filtre
const removeFilter = (filterKey) => {
  catalog.removeFilter(filterKey)
  updateURL()
}

// Fonction pour réinitialiser tous les filtres
const resetAllFilters = () => {
  catalog.resetFilters()
  updateURL()
}

// Fonction pour gérer le changement de tri
const onSortChange = () => {
  updateURL()
}

// Watchers pour synchroniser avec l'URL
watch(
  () => catalog.q,
  () => updateURL(),
  { deep: true },
)

watch(
  () => catalog.category,
  () => updateURL(),
)

watch(
  () => catalog.brands,
  () => updateURL(),
  { deep: true },
)

watch(
  () => catalog.price,
  () => updateURL(),
  { deep: true },
)

watch(
  () => catalog.ratingMin,
  () => updateURL(),
)

watch(
  () => catalog.inStock,
  () => updateURL(),
)

watch(
  () => catalog.ecoMin,
  () => updateURL(),
)

watch(
  () => catalog.promo,
  () => updateURL(),
)

watch(
  () => catalog.sort,
  () => updateURL(),
)

watch(
  () => catalog.page,
  () => updateURL(),
)

// Lifecycle
onMounted(async () => {
  // Hydrater les filtres depuis l'URL
  catalog.fromRoute(route.query)

  // Charger les produits
  await catalog.fetch()
})

// Watcher pour les changements de route
watch(
  () => route.query,
  (newQuery) => {
    catalog.fromRoute(newQuery)
    catalog.fetch()
  },
  { deep: true },
)
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.mobile-toolbar {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.results-header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sort-select {
  min-width: 180px;
}

.empty-state {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .results-header {
    padding: 15px;
  }
}
</style>
