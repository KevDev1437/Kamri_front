<template>
  <q-card class="product-card" flat bordered @click="goToProduct">
    <!-- Image -->
    <div class="img-wrapper">
      <q-img :src="product.image" ratio="1" class="product-img" />

      <!-- Badge promo / eco -->
      <q-badge
        v-if="product.badge"
        color="green-7"
        text-color="white"
        class="badge"
        :label="product.badge"
      />

      <!-- Bouton panier -->
      <q-btn
        flat
        round
        dense
        icon="shopping_cart"
        color="primary"
        class="cart-btn"
        @click.stop="addToCart"
      />
    </div>

    <!-- Infos -->
    <div class="q-pa-sm">
      <!-- Nom -->
      <div class="name ellipsis-2-lines">{{ product.name }}</div>

      <!-- Prix -->
      <div class="price-row">
        <span class="price-main">€{{ intPart }}</span>
        <span class="price-cents">{{ centsPart }}</span>
        <span
          v-if="product.oldPrice"
          class="old-price"
        >€{{ product.oldPrice.toFixed(2) }}</span>
      </div>

      <!-- Rating + ventes -->
      <div class="rating-row" v-if="product.rating">
        <q-rating
          :model-value="product.rating"
          size="16px"
          color="amber"
          readonly
          max="5"
        />
        <span class="sales">{{ product.sales }} ventes</span>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const intPart = computed(() =>
  Math.floor(props.product.price).toLocaleString('fr-FR')
)
const centsPart = computed(() =>
  props.product.price.toFixed(2).split('.')[1]
)

function goToProduct () {
  router.push(`/product/${props.product.id}`)
}

function addToCart () {
  // TODO : gestion panier
  console.log('Ajout panier', props.product.id)
}
</script>

<style scoped>
.product-card {
  transition: transform 0.15s, box-shadow 0.15s;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.img-wrapper {
  position: relative;
}
.product-img {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 12px;
}

.cart-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.12);
}

.name {
  font-weight: 600;
  min-height: 40px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 4px;
}
.price-main { font-size: 20px; font-weight: 700; }
.price-cents { font-size: 14px; align-self: flex-end; }
.old-price {
  font-size: 14px;
  color: #a0aec0;
  text-decoration: line-through;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  color: #4a5568;
  font-size: 13px;
}

.ellipsis-2-lines {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
