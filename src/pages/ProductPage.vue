<!-- src/pages/ProductPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="container">
      <!-- Loading state -->
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-dots size="50px" color="primary" />
        <div class="text-body2 q-mt-md">Chargement du produit...</div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center q-py-xl">
        <q-icon name="error_outline" size="50px" color="negative" />
        <div class="text-h6 q-mt-md text-negative">{{ error }}</div>
        <q-btn label="Retour à l'accueil" color="primary" to="/" class="q-mt-md" />
      </div>

      <!-- Product details -->
      <div v-else-if="product" class="row q-col-gutter-lg">
        <!-- Images du produit -->
        <div class="col-12 col-md-6">
          <div class="product-images">
            <div class="main-image q-mb-md">
              <q-img
                :src="selectedImage"
                :alt="product.name"
                ratio="1"
                class="rounded-borders"
                style="max-width: 500px"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                    <q-icon name="broken_image" size="50px" />
                  </div>
                </template>
              </q-img>
            </div>

            <!-- Miniatures -->
            <div
              v-if="product.images && product.images.length > 1"
              class="thumbnails row q-gutter-sm"
            >
              <div
                v-for="(image, index) in product.images"
                :key="index"
                class="thumbnail"
                :class="{ active: selectedImage === image }"
                @click="selectedImage = image"
              >
                <q-img
                  :src="image"
                  :alt="`${product.name} ${index + 1}`"
                  ratio="1"
                  class="rounded-borders cursor-pointer"
                  style="width: 80px; height: 80px"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Informations du produit -->
        <div class="col-12 col-md-6">
          <div class="product-info">
            <!-- Nom et prix -->
            <h1 class="text-h4 q-mb-md">{{ product.name }}</h1>

            <div class="price-section q-mb-lg">
              <div v-if="product.is_on_sale" class="price-sale">
                <span class="current-price text-h5 text-primary">{{ product.sale_price }}€</span>
                <span class="original-price text-body1 text-strike text-grey-6 q-ml-sm"
                  >{{ product.price }}€</span
                >
                <q-chip color="red" text-color="white" size="sm" class="q-ml-sm">
                  -{{ Math.round((1 - product.sale_price / product.price) * 100) }}%
                </q-chip>
              </div>
              <div v-else class="price-normal">
                <span class="text-h5 text-primary">{{ product.price }}€</span>
              </div>
            </div>

            <!-- Description courte -->
            <div v-if="product.short_description" class="q-mb-lg">
              <p class="text-body1">{{ product.short_description }}</p>
            </div>

            <!-- Stock -->
            <div class="stock-info q-mb-lg">
              <div v-if="product.stock_quantity > 0" class="text-positive">
                <q-icon name="check_circle" /> En stock ({{ product.stock_quantity }} disponible{{
                  product.stock_quantity > 1 ? 's' : ''
                }})
              </div>
              <div v-else class="text-negative"><q-icon name="cancel" /> Rupture de stock</div>
            </div>

            <!-- Actions -->
            <div class="actions q-mb-lg">
              <div class="row q-gutter-md">
                <!-- Quantité -->
                <div class="quantity-selector">
                  <q-input
                    v-model.number="quantity"
                    type="number"
                    :min="1"
                    :max="product.stock_quantity"
                    outlined
                    dense
                    style="width: 80px"
                    label="Qté"
                  />
                </div>

                <!-- Ajouter au panier -->
                <q-btn
                  color="primary"
                  size="lg"
                  :disable="product.stock_quantity === 0"
                  @click="addToCart"
                  icon="shopping_cart"
                  label="Ajouter au panier"
                  class="flex-1"
                />

                <!-- Favoris -->
                <q-btn
                  flat
                  round
                  color="red"
                  icon="favorite_border"
                  @click="toggleFavorite"
                  size="lg"
                >
                  <q-tooltip>Ajouter aux favoris</q-tooltip>
                </q-btn>
              </div>
            </div>

            <!-- Informations supplémentaires -->
            <div class="additional-info">
              <q-list>
                <q-item v-if="product.category">
                  <q-item-section avatar>
                    <q-icon name="category" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Catégorie</q-item-label>
                    <q-item-label caption>{{ product.category.name }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item v-if="product.sku">
                  <q-item-section avatar>
                    <q-icon name="qr_code" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Référence</q-item-label>
                    <q-item-label caption>{{ product.sku }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="local_shipping" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Livraison</q-item-label>
                    <q-item-label caption>Gratuite dès 35€</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>

        <!-- Description complète -->
        <div v-if="product.description" class="col-12 q-mt-xl">
          <q-separator class="q-mb-lg" />
          <h3 class="text-h6 q-mb-md">Description</h3>
          <div class="text-body1" v-html="product.description"></div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useSeo } from 'src/composables/useSeo'
import {
  buildCanonical,
  productJsonLd,
  productOgImage,
  breadcrumbJsonLd,
  truncate,
} from 'src/utils/seo'

const route = useRoute()
const $q = useQuasar()

// SEO
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:9000'

// State
const product = ref(null)
const loading = ref(false)
const error = ref(null)
const selectedImage = ref('')
const quantity = ref(1)

// Computed
const productId = computed(() => route.params.id)

// SEO computed
const title = computed(() => (product.value ? `${product.value.name} – KAMRI` : 'Produit – KAMRI'))
const desc = computed(() =>
  truncate(product.value?.description || product.value?.name || 'Voir produit', 160),
)
const img = computed(() => productOgImage(product.value))

// SEO watcher pour mettre à jour quand le produit est chargé
watch(
  () => product.value,
  (newProduct) => {
    if (newProduct) {
      useSeo({
        title: title.value,
        description: desc.value,
        canonical: buildCanonical(SITE_URL, route.fullPath),
        image: img.value,
        jsonLd: [
          breadcrumbJsonLd(SITE_URL, [
            { name: 'Accueil', path: '/' },
            { name: 'Catalogue', path: '/products' },
            { name: newProduct.name || 'Produit', path: route.fullPath },
          ]),
          productJsonLd(SITE_URL, newProduct),
        ],
      })
    }
  },
  { immediate: true },
)

// Methods
const fetchProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get(`/api/products/${productId.value}`)
    product.value = response.data

    // Set default selected image
    if (product.value.images && product.value.images.length > 0) {
      selectedImage.value = product.value.images[0]
    } else if (product.value.image) {
      selectedImage.value = product.value.image
    }
  } catch (err) {
    error.value = 'Produit non trouvé'
    console.error('Error fetching product:', err)
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  // TODO: Implémenter l'ajout au panier
  $q.notify({
    type: 'positive',
    message: `${quantity.value} x ${product.value.name} ajouté(s) au panier`,
    position: 'top',
  })
}

const toggleFavorite = () => {
  // TODO: Implémenter les favoris
  $q.notify({
    type: 'positive',
    message: 'Produit ajouté aux favoris',
    position: 'top',
  })
}

// Lifecycle
onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.thumbnail {
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
}

.thumbnail.active {
  border-color: var(--q-primary);
}

.thumbnail:hover {
  border-color: var(--q-primary);
  opacity: 0.8;
}

.price-sale .current-price {
  font-weight: bold;
}

.quantity-selector {
  min-width: 80px;
}

.actions {
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 0;
}

.additional-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
}
</style>
