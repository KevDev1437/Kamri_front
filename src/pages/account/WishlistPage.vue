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
          <!-- Header -->
          <div class="row items-center justify-between q-mb-lg">
            <div>
              <h2 class="text-h5 q-mb-none">Ma wishlist</h2>
              <div class="text-caption text-grey-7">
                {{ wishlistStore.count }} produit{{ wishlistStore.count > 1 ? 's' : '' }}
              </div>
            </div>
          </div>

          <!-- Toolbar -->
          <q-card class="q-mb-lg" v-if="!wishlistStore.isEmpty">
            <q-card-section>
              <div class="row items-center justify-between">
                <div class="text-subtitle1">
                  {{ wishlistStore.count }} produit{{ wishlistStore.count > 1 ? 's' : '' }} dans
                  votre wishlist
                </div>
                <div class="row q-gutter-sm">
                  <q-btn
                    color="primary"
                    label="Tout ajouter au panier"
                    icon="shopping_cart"
                    @click="addAllToCart"
                    :disable="wishlistStore.isEmpty"
                  />
                  <q-btn
                    outline
                    color="negative"
                    label="Tout supprimer"
                    icon="delete"
                    @click="clearWishlist"
                    :disable="wishlistStore.isEmpty"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Empty state -->
          <div v-if="wishlistStore.isEmpty" class="text-center q-py-xl">
            <q-icon name="favorite_border" size="64px" color="grey-5" />
            <div class="text-h6 q-mt-md text-grey-7">Votre wishlist est vide</div>
            <div class="text-body2 text-grey-6 q-mt-sm">
              Ajoutez des produits à votre wishlist en cliquant sur le cœur
            </div>
            <q-btn color="primary" label="Explorer les produits" to="/products" class="q-mt-md" />
          </div>

          <!-- Grille des produits -->
          <div v-else>
            <div class="row q-col-gutter-md">
              <div
                v-for="product in wishlistStore.items"
                :key="product.id"
                class="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <q-card class="product-card" flat bordered>
                  <div class="relative-position">
                    <q-img
                      :src="product.image"
                      :alt="product.name"
                      height="200px"
                      fit="cover"
                      class="rounded-borders"
                    />
                    <q-btn
                      flat
                      round
                      dense
                      icon="favorite"
                      color="red"
                      class="absolute-top-right q-ma-sm"
                      @click="removeFromWishlist(product.id)"
                      aria-label="Retirer de la wishlist"
                    />
                  </div>

                  <q-card-section>
                    <div class="text-subtitle2 ellipsis-2-lines q-mb-xs">
                      {{ product.name }}
                    </div>
                    <div
                      class="text-caption text-grey-6 q-mb-sm"
                      v-if="product.color || product.size"
                    >
                      <span v-if="product.color">Couleur: {{ product.color }}</span>
                      <span v-if="product.size" class="q-ml-sm">Taille: {{ product.size }}</span>
                    </div>
                    <div class="text-h6 text-primary text-weight-bold q-mb-md">
                      {{ formatPrice(product.price) }}
                    </div>

                    <div class="row q-gutter-sm">
                      <q-btn
                        color="primary"
                        label="Ajouter au panier"
                        icon="shopping_cart"
                        size="sm"
                        class="col"
                        @click="addToCart(product)"
                      />
                      <q-btn
                        flat
                        color="primary"
                        label="Voir"
                        icon="visibility"
                        size="sm"
                        :to="`/product/${product.id}`"
                      />
                    </div>
                  </q-card-section>
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
import { onMounted } from 'vue'
import { useWishlistStore } from 'stores/wishlist'
import { useCartStore } from 'stores/cart'
import { Notify } from 'quasar'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

// Méthodes
const addAllToCart = () => {
  wishlistStore.addAllToCart()
}

const clearWishlist = () => {
  wishlistStore.clear()
}

const removeFromWishlist = (id) => {
  wishlistStore.remove(id)
}

const addToCart = (product) => {
  cartStore.add(product, 1, {
    color: product.color,
    size: product.size,
  })
  Notify.create({
    type: 'positive',
    message: 'Produit ajouté au panier',
    position: 'top',
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

// Lifecycle
onMounted(() => {
  // Restaurer la wishlist depuis localStorage
  wishlistStore.restore()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.product-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.relative-position {
  position: relative;
}

.absolute-top-right {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
