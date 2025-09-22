<template>
  <q-page class="bg-grey-1">
    <div class="container q-py-xl">
      <!-- SKELETONS -->
      <div v-if="loading" class="row q-col-gutter-lg">
        <div class="col-12 col-md-7">
          <q-skeleton type="rect" height="400px" class="rounded-borders" />
          <div class="row q-col-gutter-sm q-mt-sm">
            <div v-for="n in 5" :key="n" class="col">
              <q-skeleton type="rect" height="70px" class="rounded-borders" />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-5">
          <q-skeleton type="text" class="text-h5" />
          <q-skeleton type="text" width="60%" />
          <q-skeleton type="text" width="40%" />
          <q-skeleton type="rect" height="120px" class="q-mt-md rounded-borders" />
        </div>
      </div>

      <!-- 404 -->
      <div v-else-if="notFound" class="text-center q-py-xl">
        <q-icon name="error_outline" size="56px" color="negative" />
        <div class="text-h6 q-mt-sm">Produit introuvable</div>
        <q-btn class="q-mt-md" color="primary" label="Retour à l'accueil" to="/" />
      </div>

      <!-- CONTENU -->
      <div v-else class="row q-col-gutter-xl items-start">
        <!-- Galerie -->
        <div class="col-12 col-md-7">
          <q-img
            :src="activeImage"
            :alt="`Image ${activeIndex + 1} — ${product.name}`"
            ratio="16/9"
            class="main-img"
            @error="onMainImgError"
          >
            <div
              class="absolute-bottom-right q-pa-sm text-caption text-white bg-black bg-opacity-50"
            >
              {{ activeIndex + 1 }} / {{ images.length }}
            </div>
          </q-img>

          <div class="row q-col-gutter-sm q-mt-sm">
            <div v-for="(img, idx) in images" :key="img" class="col-auto">
              <q-img
                :src="img"
                :alt="`Miniature ${idx + 1}`"
                width="72px"
                height="72px"
                class="thumb"
                :class="{ active: idx === activeIndex }"
                @click="setActive(idx)"
                @keyup.enter.space="setActive(idx)"
                tabindex="0"
                role="button"
                aria-label="Voir l'image"
              />
            </div>
          </div>
        </div>

        <!-- Panneau droit -->
        <div class="col-12 col-md-5">
          <div class="text-h5 text-weight-bold">{{ product.name }}</div>

          <div class="row items-center q-mt-xs">
            <div class="text-h6 text-primary">{{ priceFormatted }}</div>
            <div
              v-if="product.oldPrice && product.oldPrice > product.price"
              class="q-ml-sm text-grey-7"
            >
              <s>{{ formatPrice(product.oldPrice) }}</s>
              <q-badge color="negative" text-color="white" class="q-ml-xs"
                >-{{ discount }}%</q-badge
              >
            </div>
          </div>

          <div class="text-caption text-teal-8 q-mt-xs" v-if="product.stock > 0">
            En stock — livraison estimée {{ estimatedDelivery }}
          </div>
          <div class="text-caption text-negative q-mt-xs" v-else>Rupture de stock</div>

          <!-- Variantes -->
          <div v-if="hasColors" class="q-mt-lg">
            <div class="text-subtitle2 q-mb-xs">Couleur</div>
            <q-btn-toggle
              v-model="selectedColor"
              :options="colorOptions"
              toggle-color="primary"
              rounded
              glossy
              dense
              aria-label="Choisir une couleur"
            />
          </div>

          <div v-if="hasSizes" class="q-mt-md">
            <div class="text-subtitle2 q-mb-xs">Taille</div>
            <q-option-group
              v-model="selectedSize"
              :options="sizeOptions"
              type="radio"
              inline
              dense
              color="primary"
              aria-label="Choisir une taille"
            />
          </div>

          <div class="q-mt-lg">
            <q-btn
              :disable="product.stock <= 0"
              color="primary"
              label="Ajouter au panier"
              icon="shopping_cart"
              class="full-width"
              size="lg"
              @click="addToCart"
            />
          </div>

          <!-- Onglets -->
          <q-tabs
            v-model="tab"
            class="q-mt-xl"
            dense
            active-color="primary"
            indicator-color="primary"
            narrow-indicator
          >
            <q-tab name="description" label="Description" />
            <q-tab name="details" label="Détails" />
            <q-tab name="reviews" :label="`Avis (${reviewsStore.total})`" />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="description">
              <div class="text-body1" v-html="product.description || 'Aucune description.'"></div>
            </q-tab-panel>

            <q-tab-panel name="details">
              <q-list dense bordered class="rounded-borders">
                <q-item v-for="(val, key) in product.details" :key="key">
                  <q-item-section
                    ><span class="text-weight-medium">{{ key }}</span></q-item-section
                  >
                  <q-item-section side class="text-grey-8">{{ val }}</q-item-section>
                </q-item>
                <q-item v-if="!product.details || Object.keys(product.details).length === 0" dense>
                  <q-item-section>Aucun détail fourni.</q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="reviews">
              <div class="q-gutter-lg">
                <!-- Résumé des notes -->
                <RatingsSummary
                  :average="reviewsStore.average"
                  :counts="reviewsStore.counts"
                  :total="reviewsStore.total"
                  :rating="reviewsStore.rating"
                  :with-photos="reviewsStore.withPhotos"
                  @update:rating="onRatingChange"
                  @update:with-photos="onWithPhotosChange"
                />

                <!-- Formulaire d'avis -->
                <ReviewForm
                  :can-post="canPost"
                  :loading="reviewsStore.loading"
                  @submit="onSubmitReview"
                />

                <!-- Liste des avis -->
                <ReviewList
                  :items="reviewsStore.items"
                  :total="reviewsStore.total"
                  :loading="reviewsStore.loading"
                  :error="reviewsStore.error"
                  :sort="reviewsStore.sort"
                  :rating="reviewsStore.rating"
                  :with-photos="reviewsStore.withPhotos"
                  @load-more="onLoadMore"
                  @update:sort="onSortChange"
                  @update:rating="onRatingChange"
                  @update:with-photos="onWithPhotosChange"
                  @remove-filter="onRemoveFilter"
                  @reset-filters="onResetFilters"
                  @retry="onRetry"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>

    <!-- Sticky buy bar (mobile) -->
    <q-page-sticky position="bottom" :offset="[16, 16]" class="lt-md">
      <q-card class="q-pa-sm shadow-2 sticky-buy">
        <div class="row items-center justify-between no-wrap">
          <div class="col">
            <div class="text-subtitle2 ellipsis">{{ product?.name }}</div>
            <div class="text-body2 text-primary">{{ priceFormatted }}</div>
          </div>
          <q-btn
            color="primary"
            icon="shopping_cart"
            label="Ajouter"
            @click="addToCart"
            :disable="!product || product.stock <= 0"
          />
        </div>
      </q-card>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useCartStore } from 'stores/cart'
import { useReviewsStore } from 'stores/reviews'
import { useAuthStore } from 'stores/auth'
import { debounce } from 'quasar'
import RatingsSummary from 'components/reviews/RatingsSummary.vue'
import ReviewForm from 'components/reviews/ReviewForm.vue'
import ReviewList from 'components/reviews/ReviewList.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const cart = useCartStore()
const reviewsStore = useReviewsStore()
const authStore = useAuthStore()

const loading = ref(true)
const notFound = ref(false)
const product = ref(null)
const tab = ref('description')

// Galerie
const activeIndex = ref(0)
const fallbackImage = 'https://via.placeholder.com/1200x675?text=Image+indisponible'
const images = computed(() =>
  Array.isArray(product.value?.images) && product.value.images.length
    ? product.value.images
    : [fallbackImage],
)
const activeImage = computed(() => images.value[activeIndex.value] ?? fallbackImage)

// Variantes
const selectedColor = ref(null)
const selectedSize = ref(null)
const hasColors = computed(
  () => Array.isArray(product.value?.colors) && product.value.colors.length > 0,
)
const hasSizes = computed(
  () => Array.isArray(product.value?.sizes) && product.value.sizes.length > 0,
)
const colorOptions = computed(() =>
  (product.value?.colors ?? []).map((c) => ({ label: c, value: c })),
)
const sizeOptions = computed(() =>
  (product.value?.sizes ?? []).map((s) => ({ label: s, value: s })),
)

const priceFormatted = computed(() => formatPrice(product.value?.price))
const discount = computed(() => {
  const p = product.value
  if (p?.oldPrice && p.price < p.oldPrice) {
    return Math.round(100 - (p.price / p.oldPrice) * 100)
  }
  return null
})
const estimatedDelivery = computed(() => {
  const today = new Date()
  const inDays = 3 + Math.floor(Math.random() * 5) // démo
  const eta = new Date(today.getTime() + inDays * 24 * 3600 * 1000)
  return eta.toLocaleDateString()
})

// Computed pour les avis
const canPost = computed(() => {
  // Si pas connecté, ne peut pas poster
  if (!authStore.isAuthenticated) return false

  // TODO: Vérifier si l'utilisateur a acheté ce produit
  // Pour l'instant, on autorise tous les utilisateurs connectés
  return true
})

function formatPrice(val) {
  if (typeof val !== 'number') return ''
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
}

function setActive(idx) {
  activeIndex.value = idx
}

function onMainImgError(e) {
  e.target?.setAttribute('src', fallbackImage)
}

async function fetchProduct() {
  try {
    loading.value = true
    notFound.value = false
    const id = route.params.id
    const { data } = await api.get(`/api/products/${id}`)
    if (!data || typeof data !== 'object') {
      notFound.value = true
      return
    }
    product.value = {
      id: data.id,
      name: data.name,
      images: data.images ?? [],
      price: data.price,
      oldPrice: data.oldPrice,
      stock: data.stock ?? 0,
      colors: data.colors ?? [],
      sizes: data.sizes ?? [],
      description: data.description ?? '',
      details: data.details ?? {},
      reviews: data.reviews ?? [],
    }
    if (hasColors.value) selectedColor.value = product.value.colors[0]
    if (hasSizes.value) selectedSize.value = product.value.sizes[0]
  } catch (err) {
    notFound.value = true
    console.error('fetchProduct failed', err)
  } finally {
    loading.value = false
  }
}

function addToCart() {
  if (!product.value) return
  const p = product.value
  cart.add({ id: p.id, name: p.name, price: p.price, image: p.images?.[0] || '' }, 1, {
    color: selectedColor.value,
    size: selectedSize.value,
  })
  $q.notify({
    type: 'positive',
    message: 'Produit ajouté au panier',
    caption: `${p.name} — ${priceFormatted.value}`,
  })
}

// Méthodes pour les avis
const onRatingChange = (rating) => {
  reviewsStore.rating = rating
  reviewsStore.page = 1
  updateURL()
  reviewsStore.fetch(product.value.id)
}

const onWithPhotosChange = (withPhotos) => {
  reviewsStore.withPhotos = withPhotos
  reviewsStore.page = 1
  updateURL()
  reviewsStore.fetch(product.value.id)
}

const onSortChange = (sort) => {
  reviewsStore.sort = sort
  reviewsStore.page = 1
  updateURL()
  reviewsStore.fetch(product.value.id)
}

const onLoadMore = () => {
  reviewsStore.fetchNext()
}

const onRemoveFilter = (key) => {
  reviewsStore.removeFilter(key)
  updateURL()
  reviewsStore.fetch(product.value.id)
}

const onResetFilters = () => {
  reviewsStore.resetFilters()
  updateURL()
  reviewsStore.fetch(product.value.id)
}

const onRetry = () => {
  reviewsStore.fetch(product.value.id)
}

const onSubmitReview = async (reviewData) => {
  const result = await reviewsStore.post(reviewData)
  if (result.success) {
    // Recharger les avis
    await reviewsStore.fetch(product.value.id)
  }
}

// Debounce pour la mise à jour de l'URL
const updateURL = debounce(() => {
  const query = reviewsStore.toQuery()
  router.replace({ query })
}, 300)

// Lifecycle
onMounted(async () => {
  await fetchProduct()

  if (product.value) {
    // Hydrater les filtres depuis l'URL
    reviewsStore.fromRoute(route.query)

    // Charger les avis
    await reviewsStore.fetch(product.value.id)
  }
})

// Watchers
watch(
  () => route.query,
  (newQuery) => {
    if (product.value) {
      reviewsStore.fromRoute(newQuery)
      reviewsStore.fetch(product.value.id)
    }
  },
  { deep: true },
)

watch(
  () => tab.value,
  (newTab) => {
    if (newTab === 'reviews' && product.value && reviewsStore.items.length === 0) {
      reviewsStore.fetch(product.value.id)
    }
  },
)
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Zoom léger sur l'image principale */
.main-img :deep(img) {
  transition: transform 0.2s ease;
}
.main-img:hover :deep(img) {
  transform: scale(1.02);
}

/* Miniatures accessibles */
.thumb {
  border-radius: 8px;
  cursor: pointer;
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.thumb.active,
.thumb:focus {
  outline-color: var(--q-primary);
}

/* Sticky buy bar mobile */
.sticky-buy {
  min-width: calc(100vw - 32px);
  border-radius: 12px;
}
</style>
