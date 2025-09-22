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
          <h2 class="text-h5 q-mb-lg">Ma liste d'envies</h2>

          <!-- Loading state -->
          <div v-if="loading" class="text-center q-py-xl">
            <q-spinner-dots color="primary" size="40px" />
            <div class="text-grey q-mt-sm">Chargement de vos favoris...</div>
          </div>

          <!-- Empty state -->
          <div v-else-if="favorites.length === 0" class="text-center q-py-xl">
            <q-icon name="favorite_border" size="64px" color="grey-5" />
            <div class="text-h6 q-mt-md text-grey-7">Aucun favori</div>
            <div class="text-body2 text-grey-6 q-mt-sm">
              Vous n'avez pas encore ajouté de produits à vos favoris.
            </div>
            <q-btn color="primary" label="Découvrir nos produits" to="/products" class="q-mt-md" />
          </div>

          <!-- Favorites grid -->
          <div v-else>
            <div class="row q-col-gutter-md">
              <div
                v-for="product in favorites"
                :key="product.id"
                class="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <q-card class="favorite-card">
                  <q-img :src="product.image" :alt="product.name" ratio="4/3" class="product-image">
                    <template #error>
                      <div class="absolute-full flex flex-center bg-grey-3">
                        <q-icon name="image" size="48px" color="grey-5" />
                      </div>
                    </template>
                  </q-img>

                  <q-card-section class="q-pa-sm">
                    <div class="text-subtitle2 text-weight-medium ellipsis-2-lines">
                      {{ product.name }}
                    </div>
                    <div class="text-h6 text-primary q-mt-xs">
                      {{ formatPrice(product.price) }}
                    </div>
                  </q-card-section>

                  <q-card-actions class="q-pa-sm">
                    <q-btn
                      flat
                      color="primary"
                      label="Voir"
                      size="sm"
                      @click="viewProduct(product)"
                    />
                    <q-space />
                    <q-btn
                      flat
                      round
                      color="red"
                      icon="favorite"
                      @click="removeFavorite(product)"
                      aria-label="Retirer des favoris"
                    />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const router = useRouter()

// State
const loading = ref(true)
const favorites = ref([])

// Methods
const viewProduct = (product) => {
  router.push(`/product/${product.id}`)
}

const removeFavorite = async (product) => {
  try {
    // TODO: Implémenter l'API de suppression des favoris
    // await api.delete(`/api/favorites/${product.id}`)

    // Suppression locale pour la démo
    favorites.value = favorites.value.filter((p) => p.id !== product.id)

    Notify.create({
      type: 'positive',
      message: `${product.name} retiré de vos favoris`,
      position: 'top',
    })
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Erreur lors de la suppression',
      position: 'top',
    })
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

// Lifecycle
onMounted(async () => {
  try {
    // TODO: Remplacer par un appel API réel
    // const response = await api.get('/api/favorites')
    // favorites.value = response.data

    // Données mock pour la démo
    favorites.value = [
      {
        id: 1,
        name: 'T-shirt Premium',
        price: 29.99,
        image: 'https://via.placeholder.com/300x400?text=T-shirt+Premium',
      },
      {
        id: 2,
        name: 'Smartphone Galaxy',
        price: 599.99,
        image: 'https://via.placeholder.com/300x400?text=Smartphone+Galaxy',
      },
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des favoris:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.favorite-card {
  height: 100%;
  transition: transform 0.2s ease;
}

.favorite-card:hover {
  transform: translateY(-2px);
}

.product-image {
  border-radius: 8px 8px 0 0;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
