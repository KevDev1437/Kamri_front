<template>
  <q-card
    class="product-card cursor-pointer"
    flat
    bordered
    @click="$emit('click', product)"
    :aria-label="`Voir le produit ${product.name}`"
    tabindex="0"
    @keyup.enter="$emit('click', product)"
  >
    <!-- Image avec gestion des erreurs -->
    <div class="product-image-wrapper">
      <q-img
        :src="product.image"
        ratio="4/3"
        class="product-image"
        :alt="product.name"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        :img-style="{ 'will-change': 'transform' }"
        placeholder-src="/img/placeholder-400x300.jpg"
        @error="handleImageError"
        @mouseover="prefetchPdpChunk"
        @focus="prefetchPdpChunk"
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
      <div class="product-badges" v-if="hasBadges">
        <q-badge v-if="discountPercentage" color="red" class="discount-badge">
          -{{ discountPercentage }}%
        </q-badge>
        <q-badge v-if="product.isNew" color="green-7" class="new-badge"> NOUVEAU </q-badge>
        <q-badge v-if="product.ecoScore" color="teal" class="eco-badge"> ECO </q-badge>
      </div>

      <!-- Bouton wishlist (top-right) -->
      <q-btn
        flat
        round
        :icon="wishlistStore.has(product.id) ? 'favorite' : 'favorite_border'"
        :color="wishlistStore.has(product.id) ? 'red' : 'grey-7'"
        class="favorite-btn"
        :aria-label="
          wishlistStore.has(product.id) ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'
        "
        @click.stop="toggleWishlist"
      />

      <!-- Overlay CTA au hover/focus -->
      <div class="product-overlay">
        <q-btn
          color="primary"
          icon="shopping_cart"
          unelevated
          class="overlay-btn"
          :aria-label="`Ajouter ${product.name} au panier`"
          @click.stop="$emit('add-to-cart', product)"
        >
          Ajouter au panier
        </q-btn>
        <q-btn
          color="accent"
          icon="visibility"
          outline
          class="overlay-btn"
          :aria-label="`Aperçu rapide de ${product.name}`"
          @click.stop="$emit('quick-view', product)"
        >
          Aperçu rapide
        </q-btn>
      </div>
    </div>

    <!-- Contenu -->
    <q-card-section class="product-content">
      <!-- Nom du produit -->
      <div class="product-name">
        {{ product.name }}
      </div>

      <!-- Prix -->
      <div class="product-price">
        <div class="price-section">
          <span class="price-current">{{ formatPrice(product.price) }}</span>
          <span v-if="product.oldPrice" class="price-original">{{
            formatPrice(product.oldPrice)
          }}</span>
        </div>
      </div>

      <!-- Rating -->
      <div class="product-rating" v-if="showRating && product.rating">
        <q-icon name="star" color="amber" size="14px" />
        <span class="rating-text">{{ product.rating.toFixed(1) }}</span>
        <span v-if="product.reviewsCount" class="reviews-count">
          · {{ formatNumber(product.reviewsCount) }}
        </span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { formatNumber, formatPrice } from 'src/utils/number'
import { useWishlistStore } from 'stores/wishlist'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (product) => {
      return (
        product.name &&
        typeof product.price === 'number' &&
        (!product.oldPrice || typeof product.oldPrice === 'number') &&
        (!product.rating || (product.rating >= 0 && product.rating <= 5))
      )
    },
  },
  showRating: {
    type: Boolean,
    default: true,
  },
  showFavorite: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click', 'favorite', 'add-to-cart', 'quick-view', 'error'])

const wishlistStore = useWishlistStore()

// Pré-chauffe chunk PDP au hover
function prefetchPdpChunk() {
  // Vite va charger le chunk en arrière-plan
  import('src/pages/ProductPage.vue')
}

// Gestion des badges
const hasBadges = computed(() => {
  const p = props.product
  return discountPercentage.value || p.isNew || p.ecoScore
})

// Calcul du pourcentage de réduction
const discountPercentage = computed(() => {
  const p = props.product
  if (p.oldPrice && p.price < p.oldPrice) {
    return Math.round((1 - p.price / p.oldPrice) * 100)
  }
  return p.discountPercentage || null
})

// Les fonctions formatNumber et formatPrice sont maintenant importées depuis src/utils/number

// Gestion des erreurs d'image
const handleImageError = () => {
  emit('error', {
    type: 'image',
    product: props.product,
  })
}

// Toggle wishlist
const toggleWishlist = () => {
  wishlistStore.toggle(props.product)
}
</script>

<style lang="scss" scoped>
@use 'src/css/_tokens.scss' as *;

.product-card {
  height: 100%;
  border-radius: $radius-md;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  box-shadow: $shadow-1;

  &:hover {
    transform: translateY(-3px);
    box-shadow: $shadow-2;
    border-color: $primary;
  }

  &:focus {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }
}

.product-image-wrapper {
  position: relative;
  overflow: hidden;
  background: #f9fafb;
}

.product-image {
  transition: all 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .q-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: $radius-sm;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.favorite-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  box-shadow: $shadow-1;

  &:hover {
    background: #fff;
    transform: scale(1.1);
  }
}

.product-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 2;
}

.product-card:hover .product-overlay,
.product-card:focus-within .product-overlay {
  opacity: 1;
  transform: translateY(0);
}

.overlay-btn {
  flex: 1;
  font-size: 0.75rem;
  height: 36px;
  border-radius: $radius-sm;
}

.product-content {
  padding: 1rem;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  color: $dark;
  margin-bottom: 0.5rem;
  height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  margin-bottom: 0.5rem;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.price-current {
  font-weight: 700;
  color: $primary;
  font-size: 1.125rem;
}

.price-original {
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: line-through;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.rating-text {
  font-weight: 500;
}

.reviews-count {
  color: #9ca3af;
}

.image-error {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  color: #9ca3af;
}
</style>
