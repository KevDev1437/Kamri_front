<template>
  <q-drawer
    v-model="cart.isOpen"
    side="right"
    overlay
    bordered
    :width="380"
    content-class="bg-white"
  >
    <q-toolbar>
      <q-toolbar-title>Panier</q-toolbar-title>
      <q-btn flat round dense icon="close" @click="cart.close()" aria-label="Fermer le panier" />
    </q-toolbar>
    <q-separator />

    <!-- Vide -->
    <div v-if="cart.list.length === 0" class="q-pa-md">
      <div class="text-center text-grey q-my-lg">Votre panier est vide.</div>
      <q-btn
        outline
        color="primary"
        label="Continuer vos achats"
        class="full-width"
        @click="cart.close()"
      />
    </div>

    <!-- Items -->
    <q-list v-else class="q-pa-sm">
      <q-item v-for="item in cart.list" :key="cart.keyOf(item)" class="q-mb-sm">
        <q-item-section avatar>
          <q-img
            :src="item.image"
            :alt="item.name"
            width="64px"
            height="64px"
            ratio="1"
            class="rounded-borders"
            placeholder-src="https://via.placeholder.com/64"
          />
        </q-item-section>

        <q-item-section>
          <div class="text-body1 ellipsis-2-lines">{{ item.name }}</div>
          <div class="text-caption text-grey-7" v-if="item.color || item.size">
            <span v-if="item.color">Couleur: {{ item.color }}</span>
            <span v-if="item.size" class="q-ml-sm">Taille: {{ item.size }}</span>
          </div>

          <div class="row items-center q-gutter-xs q-mt-xs" aria-label="Quantité">
            <q-btn
              dense
              round
              flat
              icon="remove"
              @click="decQty(item)"
              aria-label="Diminuer la quantité"
            />
            <q-input
              dense
              outlined
              type="number"
              style="width: 72px"
              v-model.number="qtyBuffer[cart.keyOf(item)]"
              @update:model-value="onQtyInput(item)"
              min="1"
              aria-label="Quantité"
            />
            <q-btn
              dense
              round
              flat
              icon="add"
              @click="incQty(item)"
              aria-label="Augmenter la quantité"
            />
          </div>
        </q-item-section>

        <q-item-section side top>
          <div class="text-weight-bold">{{ formatPrice(item.price * item.qty) }}</div>
          <div class="row q-gutter-xs">
            <q-btn
              flat
              round
              dense
              icon="favorite"
              color="primary"
              @click="saveForLater(item)"
              aria-label="Garder pour plus tard"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click="removeItem(item)"
              aria-label="Retirer l'article"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator v-if="cart.list.length" />

    <!-- Totaux -->
    <div v-if="cart.list.length" class="q-pa-md">
      <div class="row justify-between q-mb-xs">
        <div class="text-caption text-grey-7">Total HT</div>
        <div class="text-caption">{{ formatPrice(cart.totalHT) }}</div>
      </div>
      <div class="row justify-between q-mb-xs">
        <div class="text-caption text-grey-7">TVA (21%)</div>
        <div class="text-caption">{{ formatPrice(cart.tva) }}</div>
      </div>
      <div class="row justify-between items-center q-mt-sm">
        <div class="text-subtitle1 text-weight-bold">Total</div>
        <div class="text-subtitle1 text-primary">{{ formatPrice(cart.totalTTC) }}</div>
      </div>

      <q-btn
        color="primary"
        class="full-width q-mt-md"
        label="Commander"
        icon="shopping_bag"
        to="/checkout"
      />
      <q-btn
        flat
        class="full-width q-mt-xs"
        label="Vider le panier"
        color="negative"
        @click="cart.clear()"
      />
    </div>

    <!-- Section "À garder pour plus tard" -->
    <div v-if="wishlistStore.count > 0" class="q-pa-md">
      <q-separator class="q-mb-md" />
      <div class="text-subtitle2 q-mb-md">À garder pour plus tard ({{ wishlistStore.count }})</div>

      <q-list dense>
        <q-item v-for="item in wishlistStore.items.slice(0, 3)" :key="item.id" class="q-mb-sm">
          <q-item-section avatar>
            <q-img
              :src="item.image"
              :alt="item.name"
              width="40px"
              height="40px"
              ratio="1"
              class="rounded-borders"
            />
          </q-item-section>

          <q-item-section>
            <div class="text-caption ellipsis">{{ item.name }}</div>
            <div class="text-caption text-primary">{{ formatPrice(item.price) }}</div>
          </q-item-section>

          <q-item-section side>
            <q-btn
              flat
              round
              dense
              icon="shopping_cart"
              color="primary"
              @click="moveToCart(item)"
              aria-label="Déplacer au panier"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <div v-if="wishlistStore.count > 3" class="text-center q-mt-sm">
        <q-btn flat dense label="Voir tout" color="primary" to="/account/wishlist" />
      </div>

      <q-btn
        v-if="wishlistStore.count > 1"
        outline
        color="primary"
        class="full-width q-mt-sm"
        label="Tout déplacer au panier"
        @click="moveAllToCart"
      />
    </div>
  </q-drawer>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useCartStore } from 'stores/cart'
import { useWishlistStore } from 'stores/wishlist'
import { Notify } from 'quasar'

const cart = useCartStore()
const wishlistStore = useWishlistStore()
const qtyBuffer = reactive({})

function syncBuffer() {
  Object.keys(qtyBuffer).forEach((k) => delete qtyBuffer[k])
  cart.list.forEach((i) => {
    qtyBuffer[cart.keyOf(i)] = i.qty
  })
}

function incQty(item) {
  cart.updateQty(cart.keyOf(item), (item.qty || 1) + 1)
  syncBuffer()
}

function decQty(item) {
  const q = Math.max(1, (item.qty || 1) - 1)
  cart.updateQty(cart.keyOf(item), q)
  syncBuffer()
}

function onQtyInput(item) {
  const key = cart.keyOf(item)
  const val = Math.max(1, Number(qtyBuffer[key] || 1))
  cart.updateQty(key, val)
}

function removeItem(item) {
  cart.remove(cart.keyOf(item))
}

function formatPrice(val) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val || 0)
}

// Méthodes pour save-for-later
function saveForLater(item) {
  const key = cart.keyOf(item)
  const success = cart.moveToWishlist(key)

  if (success) {
    Notify.create({
      type: 'positive',
      message: 'Produit déplacé vers "À garder pour plus tard"',
      position: 'top',
    })
    // Mettre à jour le buffer
    syncBuffer()
  }
}

function moveToCart(item) {
  cart.add(item, 1, {
    color: item.color,
    size: item.size,
  })
  wishlistStore.remove(item.id)

  Notify.create({
    type: 'positive',
    message: 'Produit ajouté au panier',
    position: 'top',
  })
}

function moveAllToCart() {
  let movedCount = 0
  wishlistStore.items.forEach((item) => {
    cart.add(item, 1, {
      color: item.color,
      size: item.size,
    })
    movedCount++
  })

  wishlistStore.clear()

  Notify.create({
    type: 'positive',
    message: `${movedCount} produit${movedCount > 1 ? 's' : ''} ajouté${movedCount > 1 ? 's' : ''} au panier`,
    position: 'top',
  })
}

onMounted(() => {
  cart.load()
  syncBuffer()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
