<template>
  <q-page class="bg-grey-1">
    <div class="container-1200 q-px-md q-py-lg">
      <!-- Toolbar top (mobile) -->
      <div class="row items-center justify-between q-mb-md">
        <div class="row items-center q-gutter-sm">
          <q-btn
            class="lt-md"
            color="primary"
            icon="tune"
            label="Filtres"
            @click="drawerOpen = true"
            aria-label="Ouvrir les filtres"
          />
          <div class="text-caption text-grey-7 gt-sm">{{ total }} résultats</div>
        </div>

        <!-- Tri -->
        <div class="row items-center q-gutter-sm">
          <q-select
            v-model="sort"
            :options="sortOptions"
            dense
            outlined
            label="Trier"
            style="min-width: 190px"
            aria-label="Trier les produits"
          />
        </div>
      </div>

      <div class="row">
        <!-- Sidebar (desktop) -->
        <div class="col-3 gt-sm">
          <FiltersSidebar
            :model-value="filters"
            @update:model-value="onFiltersChange"
            @clear="clearAll"
          />
        </div>

        <!-- Content -->
        <div class="col-12 col-md-9">
          <!-- Chips filtres actifs -->
          <div v-if="activeChips.length" class="q-mb-sm">
            <q-chip
              v-for="chip in activeChips"
              :key="chip.key"
              removable
              @remove="removeChip(chip)"
              color="primary"
              text-color="white"
              class="q-mr-sm q-mb-sm"
            >
              {{ chip.label }}
            </q-chip>
            <q-btn flat size="sm" label="Effacer tout" @click="clearAll" />
          </div>

          <!-- Grille produits -->
          <ProductGrid :products="items" :loading="loading" :page-size="50" @load-more="loadMore" />

          <!-- Pagination simple (fallback si pas d'infinite) -->
          <div class="row justify-center q-mt-md" v-if="hasMore && !loading">
            <q-btn outline color="primary" label="Voir plus" @click="loadMore" />
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer filtres (mobile) -->
    <q-drawer v-model="drawerOpen" side="right" overlay bordered class="lt-md" :width="300">
      <q-toolbar>
        <q-toolbar-title>Filtres</q-toolbar-title>
        <q-btn flat round dense icon="close" @click="drawerOpen = false" aria-label="Fermer" />
      </q-toolbar>
      <q-separator />
      <FiltersSidebar
        :model-value="filters"
        @update:model-value="onFiltersChange"
        @clear="clearAll"
      />
    </q-drawer>
  </q-page>
</template>

<script setup>
import { useMeta } from 'quasar'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductGrid from 'components/ProductGrid.vue'
import FiltersSidebar from 'components/FiltersSidebar.vue'
import { useProductsStore } from 'stores/products'
import { toQuery, fromRoute, labelChips } from 'src/utils/query'

const route = useRoute()
const router = useRouter()
const drawerOpen = ref(false)

const sortOptions = [
  { label: 'Pertinence', value: 'relevance' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix décroissant', value: 'price_desc' },
  { label: 'Meilleures notes', value: 'rating_desc' },
  { label: 'Nouveautés', value: 'newest' },
]

const store = useProductsStore()
const loading = computed(() => store.loading)
const items = computed(() => store.items)
const total = computed(() => store.total)
const hasMore = computed(() => store.hasMore)

const { filters, sort, page } = reactive({
  filters: fromRoute(route),
  sort: route.query.sort || 'relevance',
  page: Number(route.query.page || 1),
})

const activeChips = computed(() => labelChips(filters))

function syncUrl(replace = false) {
  const query = toQuery({ ...filters, sort, page })
  router[replace ? 'replace' : 'push']({ path: '/products', query })
}

let t
watch(
  [() => ({ ...filters }), () => sort.value],
  () => {
    clearTimeout(t)
    t = setTimeout(async () => {
      page.value = 1
      syncUrl()
      await store.fetch({ filters, sort: sort.value, page: 1 })
    }, 300)
  },
  { deep: true },
)

watch(
  () => route.query,
  async (q) => {
    const f = fromRoute(route)
    Object.assign(filters, f)
    sort.value = q.sort || 'relevance'
    page.value = Number(q.page || 1)
    await store.fetch({ filters, sort: sort.value, page: page.value })
  },
)

function loadMore() {
  if (!hasMore.value || loading.value) return
  page.value += 1
  syncUrl(true)
  store.fetchMore({ filters, sort: sort.value, page: page.value })
}

function clearAll() {
  Object.assign(filters, {
    q: '',
    cat: '',
    priceMin: null,
    priceMax: null,
    rating: null,
    brand: [],
    color: [],
    size: [],
    inStock: false,
    eco: null,
  })
}

function removeChip(chip) {
  chip.remove(filters)
}

function onFiltersChange(newFilters) {
  Object.assign(filters, newFilters)
}

onMounted(async () => {
  useMeta(() => ({
    title: filters.q ? `Résultats pour "${filters.q}" | KAMRI` : 'Tous les produits | KAMRI',
    meta: [
      {
        name: 'description',
        content: 'Explorez les produits KAMRI Marketplace avec filtres et tri.',
      },
    ],
  }))
  await store.fetch({ filters, sort: sort.value, page: page.value })
})
</script>

<style scoped>
.container-1200 {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
