<template>
  <q-card class="product-card cursor-pointer" flat bordered @click="$emit('click', product)">
    <!-- Image avec gestion des erreurs -->
    <div class="img-wrapper">
      <q-img
        :src="product.image"
        ratio="1"
        class="product-img"
        :alt="product.name"
        @error="handleImageError"
      >
        <template v-slot:error>
          <div class="image-error flex flex-center">
            <q-icon name="image" size="48px" color="grey-5" />
          </div>
        </template>
        <template v-slot:loading>
          <q-skeleton type="rect" class="full-width full-height" />
        </template>
      </q-img>

      <!-- Badges -->
      <div class="badges-container" v-if="hasBadges">
        <q-badge v-if="product.discountPercentage" color="red" class="discount-badge">
          -{{ product.discountPercentage }}%
        </q-badge>
        <q-badge v-if="product.isNew" color="green-7" class="new-badge"> NOUVEAU </q-badge>
        <q-badge v-if="product.isEco" color="teal" class="eco-badge"> ECO </q-badge>
      </div>

      <!-- Actions rapides -->
      <div class="actions-container">
        <q-btn
          flat
          round
          dense
          :icon="product.isFavorite ? 'favorite' : 'favorite_border'"
          :color="product.isFavorite ? 'red' : 'grey-7'"
          class="favorite-btn"
          @click.stop="$emit('favorite', product)"
        />
        <q-btn
          flat
          round
          dense
          icon="shopping_cart"
          color="primary"
          class="cart-btn"
          @click.stop="$emit('add-to-cart', product)"
        />
      </div>
    </div>

    <!-- Contenu -->
    <q-card-section class="q-pa-sm">
      <!-- Nom du produit -->
      <div class="product-name ellipsis-2-lines">
        {{ product.name }}
      </div>

      <!-- Prix -->
      <div class="price-row">
        <template v-if="product.sale_price">
          <span class="current-price">{{ formatPrice(product.sale_price) }}</span>
          <span class="original-price">{{ formatPrice(product.price) }}</span>
        </template>
        <span v-else class="current-price">
          {{ formatPrice(product.price) }}
        </span>
      </div>

      <!-- Notation et ventes -->
      <div class="rating-row" v-if="showRating">
        <div class="rating">
          <q-rating :model-value="product.rating" size="12px" color="amber" readonly />
          <span class="rating-count" v-if="product.ratingCount">
            ({{ formatNumber(product.ratingCount) }})
          </span>
        </div>
        <div class="sales" v-if="product.salesCount">
          {{ formatNumber(product.salesCount) }} vendus
        </div>
      </div>

      <!-- Tags -->
      <div class="tags-row" v-if="product.tags?.length">
        <q-chip v-for="tag in product.tags.slice(0, 2)" :key="tag" dense size="sm" class="tag-chip">
          {{ tag }}
        </q-chip>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (product) => {
      return (
        product.name &&
        typeof product.price === 'number' &&
        (!product.discountPrice || typeof product.discountPrice === 'number') &&
        (!product.rating || (product.rating >= 0 && product.rating <= 5))
      )
    },
  },
  showRating: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click', 'favorite', 'add-to-cart', 'error'])

// Gestion des badges
const hasBadges = computed(() => {
  const p = props.product
  return p.discountPercentage || p.isNew || p.isEco
})

// Format du prix
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

// Format des nombres
const formatNumber = (num) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

// Gestion des erreurs d'image
const handleImageError = () => {
  emit('error', {
    type: 'image',
    product: props.product,
  })
}
</script>

<style scoped>
.product-card {
  height: 100%;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.img-wrapper {
  position: relative;
  overflow: hidden;
}

.product-img {
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.badges-container {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.actions-container {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-size: 0.9rem;
  line-height: 1.2;
  height: 2.4em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-row {
  margin: 8px 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-weight: 700;
  color: #ff6b6b;
  font-size: 1.1rem;
}

.original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
}

.rating-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #666;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-count {
  color: #999;
}

.tags-row {
  margin-top: 8px;
  display: flex;
  gap: 4px;
}

.tag-chip {
  font-size: 0.7rem;
}

.image-error {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
</style>
