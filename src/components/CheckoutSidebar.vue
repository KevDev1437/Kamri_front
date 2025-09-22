<template>
  <q-card class="checkout-sidebar sticky">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="shopping_cart" class="q-mr-sm" />
        Récapitulatif
      </div>

      <!-- Articles du panier -->
      <div class="q-mb-md">
        <div v-for="item in cartStore.items" :key="item.id" class="row items-center q-mb-md">
          <div class="col-auto">
            <q-avatar square size="60px">
              <img :src="item.image" :alt="item.name" />
            </q-avatar>
          </div>
          <div class="col q-ml-md">
            <div class="text-body2 text-weight-medium">{{ item.name }}</div>
            <div v-if="item.variant" class="text-caption text-grey-6">
              {{ item.variant }}
            </div>
            <div class="text-caption text-grey-6">Quantité: {{ item.qty }}</div>
          </div>
          <div class="col-auto">
            <div class="text-body2 text-weight-bold">
              {{ formatPrice(item.price * item.qty) }}
            </div>
          </div>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- Coupon -->
      <div class="q-mb-md">
        <div class="text-subtitle2 q-mb-sm">Code promo</div>
        <div v-if="!checkout.coupon" class="row q-gutter-sm">
          <q-input
            v-model="couponCode"
            label="Code promo"
            outlined
            dense
            class="col"
            @keyup.enter="applyCoupon"
            aria-label="Code promo"
          />
          <q-btn
            color="primary"
            label="Appliquer"
            @click="applyCoupon"
            :loading="couponLoading"
            dense
          />
        </div>
        <div v-else class="row items-center justify-between">
          <div class="text-body2">
            <q-icon name="local_offer" class="q-mr-xs" />
            {{ checkout.coupon }}
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="removeCoupon"
            color="grey-7"
            size="sm"
            aria-label="Retirer le coupon"
          />
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- Totaux -->
      <div class="q-gutter-sm">
        <div class="row justify-between">
          <span class="text-body2">Sous-total</span>
          <span class="text-body2">{{ formatPrice(checkout.subtotal) }}</span>
        </div>

        <div class="row justify-between">
          <span class="text-body2">Livraison</span>
          <span class="text-body2">
            {{ checkout.shippingPrice > 0 ? formatPrice(checkout.shippingPrice) : 'Gratuit' }}
          </span>
        </div>

        <div class="row justify-between">
          <span class="text-body2">TVA (21%)</span>
          <span class="text-body2">{{ formatPrice(checkout.tax) }}</span>
        </div>

        <div v-if="checkout.discount > 0" class="row justify-between">
          <span class="text-body2 text-positive">Remise</span>
          <span class="text-body2 text-positive">-{{ formatPrice(checkout.discount) }}</span>
        </div>

        <q-separator class="q-my-sm" />

        <div class="row justify-between">
          <span class="text-h6 text-weight-bold">Total</span>
          <span class="text-h6 text-weight-bold text-primary">
            {{ formatPrice(checkout.total) }}
          </span>
        </div>
      </div>

      <!-- Informations de sécurité -->
      <div class="q-mt-md">
        <q-banner class="bg-grey-1" rounded>
          <template #avatar>
            <q-icon name="security" color="positive" />
          </template>
          <div class="text-caption">Paiement 100% sécurisé</div>
        </q-banner>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useCheckoutStore } from 'stores/checkout'
import { useCartStore } from 'stores/cart'
import { Notify } from 'quasar'

const checkout = useCheckoutStore()
const cartStore = useCartStore()

// State
const couponCode = ref('')
const couponLoading = ref(false)

// Méthodes
const applyCoupon = async () => {
  if (!couponCode.value.trim()) return

  couponLoading.value = true
  try {
    const result = await checkout.applyCoupon(couponCode.value.trim())
    if (result.success) {
      Notify.create({
        type: 'positive',
        message: result.message,
        position: 'top',
      })
      couponCode.value = ''
    } else {
      Notify.create({
        type: 'negative',
        message: result.message,
        position: 'top',
      })
    }
  } catch {
    Notify.create({
      type: 'negative',
      message: "Erreur lors de l'application du coupon",
      position: 'top',
    })
  } finally {
    couponLoading.value = false
  }
}

const removeCoupon = () => {
  checkout.removeCoupon()
  Notify.create({
    type: 'info',
    message: 'Coupon retiré',
    position: 'top',
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}
</script>

<style scoped>
.checkout-sidebar {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .checkout-sidebar {
    position: static;
    max-height: none;
  }
}
</style>
