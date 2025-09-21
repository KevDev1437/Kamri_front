<!-- src/pages/account/WishlistPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="container">
      <div class="row">
        <!-- Sidebar navigation -->
        <div class="col-12 col-md-3 q-mb-md">
          <q-list>
            <q-item clickable v-ripple to="/account/profile">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>Mon profil</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/account/orders">
              <q-item-section avatar>
                <q-icon name="shopping_bag" />
              </q-item-section>
              <q-item-section>Mes commandes</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/account/wishlist" active-class="bg-primary text-white">
              <q-item-section avatar>
                <q-icon name="favorite" />
              </q-item-section>
              <q-item-section>Ma liste d'envies</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Main content -->
        <div class="col-12 col-md-9">
          <div class="row items-center justify-between q-mb-lg">
            <h2 class="text-h5 q-ma-none">Ma liste d'envies</h2>
            <div class="text-body2 text-grey-7">
              {{ wishlist.length }} article{{ wishlist.length > 1 ? 's' : '' }}
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="text-center q-py-xl">
            <q-spinner-dots size="50px" color="primary" />
            <div class="text-body2 q-mt-md">Chargement de votre liste d'envies...</div>
          </div>

          <!-- Empty state -->
          <div v-else-if="wishlist.length === 0" class="text-center q-py-xl">
            <q-icon name="favorite_border" size="50px" color="grey-5" />
            <div class="text-h6 q-mt-md">Votre liste d'envies est vide</div>
            <div class="text-body2 text-grey-7 q-mt-sm">
              Ajoutez des articles à votre liste d'envies pour les retrouver facilement
            </div>
            <q-btn label="Découvrir nos produits" color="primary" to="/" class="q-mt-md" />
          </div>

          <!-- Wishlist items -->
          <div v-else>
            <div class="row q-col-gutter-md">
              <div
                v-for="item in wishlist"
                :key="item.id"
                class="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <q-card class="wishlist-item">
                  <div class="item-image">
                    <q-img :src="item.image" :alt="item.name" ratio="1" class="rounded-borders">
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                          <q-icon name="broken_image" size="30px" />
                        </div>
                      </template>
                    </q-img>

                    <!-- Remove from wishlist button -->
                    <q-btn
                      flat
                      round
                      dense
                      icon="favorite"
                      color="red"
                      class="remove-btn"
                      @click="removeFromWishlist(item)"
                    >
                      <q-tooltip>Retirer de la liste d'envies</q-tooltip>
                    </q-btn>
                  </div>

                  <q-card-section class="q-pa-sm">
                    <div class="text-subtitle2 ellipsis-2-lines q-mb-sm">
                      {{ item.name }}
                    </div>

                    <div class="price-section q-mb-sm">
                      <div v-if="item.sale_price" class="price-sale">
                        <span class="current-price text-primary">{{
                          formatPrice(item.sale_price)
                        }}</span>
                        <span class="original-price text-strike text-grey-6 q-ml-sm">{{
                          formatPrice(item.price)
                        }}</span>
                      </div>
                      <div v-else class="price-normal">
                        <span class="text-primary">{{ formatPrice(item.price) }}</span>
                      </div>
                    </div>

                    <div class="stock-info q-mb-sm">
                      <div v-if="item.stock_quantity > 0" class="text-positive text-caption">
                        <q-icon name="check_circle" size="12px" /> En stock
                      </div>
                      <div v-else class="text-negative text-caption">
                        <q-icon name="cancel" size="12px" /> Rupture de stock
                      </div>
                    </div>

                    <div class="actions">
                      <q-btn
                        color="primary"
                        size="sm"
                        label="Voir"
                        :to="{ name: 'product', params: { id: item.id } }"
                        class="full-width q-mb-xs"
                      />
                      <q-btn
                        color="green"
                        size="sm"
                        label="Ajouter au panier"
                        icon="shopping_cart"
                        :disable="item.stock_quantity === 0"
                        @click="addToCart(item)"
                        class="full-width"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Clear all button -->
            <div class="text-center q-mt-lg">
              <q-btn
                color="negative"
                outline
                label="Vider la liste d'envies"
                icon="delete_sweep"
                @click="clearWishlist"
                :disable="wishlist.length === 0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// State
const loading = ref(false)
const wishlist = ref([])

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

const removeFromWishlist = (item) => {
  $q.dialog({
    title: 'Confirmer',
    message: `Voulez-vous retirer "${item.name}" de votre liste d'envies ?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    const index = wishlist.value.findIndex((w) => w.id === item.id)
    if (index > -1) {
      wishlist.value.splice(index, 1)
      $q.notify({
        type: 'positive',
        message: "Article retiré de votre liste d'envies",
        position: 'top',
      })
    }
  })
}

const addToCart = (item) => {
  // TODO: Implémenter l'ajout au panier
  $q.notify({
    type: 'positive',
    message: `${item.name} ajouté au panier`,
    position: 'top',
  })
}

const clearWishlist = () => {
  $q.dialog({
    title: 'Confirmer',
    message: "Voulez-vous vider complètement votre liste d'envies ?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    wishlist.value = []
    $q.notify({
      type: 'positive',
      message: "Liste d'envies vidée",
      position: 'top',
    })
  })
}

const fetchWishlist = async () => {
  loading.value = true

  try {
    // TODO: Implémenter l'appel API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulation

    // Données de test
    wishlist.value = [
      {
        id: 1,
        name: "Robe d'été fleurie",
        price: 49.99,
        sale_price: 39.99,
        image: 'https://picsum.photos/300/300?random=1',
        stock_quantity: 5,
      },
      {
        id: 2,
        name: 'T-shirt coton bio',
        price: 19.99,
        image: 'https://picsum.photos/300/300?random=2',
        stock_quantity: 12,
      },
      {
        id: 3,
        name: 'Jean slim taille haute',
        price: 79.99,
        image: 'https://picsum.photos/300/300?random=3',
        stock_quantity: 0,
      },
      {
        id: 4,
        name: 'Baskets blanches',
        price: 89.99,
        sale_price: 69.99,
        image: 'https://picsum.photos/300/300?random=4',
        stock_quantity: 8,
      },
    ]
  } catch (error) {
    console.error('Error fetching wishlist:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchWishlist()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.wishlist-item {
  height: 100%;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.wishlist-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  position: relative;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

.price-sale .current-price {
  font-weight: bold;
}

.actions {
  margin-top: 8px;
}
</style>
