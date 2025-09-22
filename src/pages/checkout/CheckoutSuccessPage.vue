<template>
  <q-page class="checkout-success-page">
    <div class="container">
      <!-- Message de succès -->
      <div class="text-center q-py-xl">
        <q-icon name="check_circle" size="80px" color="positive" class="q-mb-md" />
        <h1 class="text-h4 text-weight-bold q-mb-sm">Commande confirmée !</h1>
        <div class="text-h6 text-grey-7 q-mb-lg">
          Merci pour votre achat, {{ authStore.user?.name || 'cher client' }} !
        </div>

        <!-- Numéro de commande -->
        <q-card class="q-mb-lg" style="max-width: 500px; margin: 0 auto">
          <q-card-section>
            <div class="text-h6 q-mb-sm">Votre commande</div>
            <div class="text-h4 text-primary text-weight-bold">
              {{ orderNumber || `#${orderId}` }}
            </div>
            <div class="text-body2 text-grey-6 q-mt-sm">
              Commande du {{ formatDate(new Date()) }}
            </div>
          </q-card-section>
        </q-card>

        <!-- Récapitulatif court -->
        <q-card class="q-mb-lg" style="max-width: 500px; margin: 0 auto">
          <q-card-section>
            <div class="text-h6 q-mb-md">Récapitulatif</div>
            <div class="row justify-between q-mb-sm">
              <span class="text-body2">Total</span>
              <span class="text-body2 text-weight-bold">{{ formatPrice(orderTotal) }}</span>
            </div>
            <div class="row justify-between q-mb-sm">
              <span class="text-body2">Email de confirmation</span>
              <span class="text-body2">{{ authStore.user?.email || "En cours d'envoi" }}</span>
            </div>
            <div class="row justify-between">
              <span class="text-body2">Statut</span>
              <q-chip color="primary" text-color="white" label="En cours de traitement" size="sm" />
            </div>
          </q-card-section>
        </q-card>

        <!-- Actions -->
        <div class="row q-gutter-md justify-center">
          <q-btn
            color="primary"
            label="Voir la commande"
            icon="visibility"
            @click="viewOrder"
            size="lg"
          />
          <q-btn
            outline
            color="primary"
            label="Continuer mes achats"
            icon="shopping_bag"
            to="/products"
            size="lg"
          />
        </div>
      </div>

      <!-- Informations supplémentaires -->
      <q-card class="q-mt-xl">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="info" class="q-mr-sm" />
            Prochaines étapes
          </div>
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-4">
              <div class="text-center">
                <q-icon name="email" size="48px" color="primary" class="q-mb-sm" />
                <div class="text-subtitle2 q-mb-xs">Email de confirmation</div>
                <div class="text-caption text-grey-6">
                  Vous recevrez un email de confirmation dans les prochaines minutes
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-center">
                <q-icon name="local_shipping" size="48px" color="info" class="q-mb-sm" />
                <div class="text-subtitle2 q-mb-xs">Préparation</div>
                <div class="text-caption text-grey-6">
                  Votre commande sera préparée et expédiée sous 24-48h
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-center">
                <q-icon name="track_changes" size="48px" color="positive" class="q-mb-sm" />
                <div class="text-subtitle2 q-mb-xs">Suivi</div>
                <div class="text-caption text-grey-6">
                  Vous pourrez suivre votre commande depuis votre espace client
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Support -->
      <q-banner class="q-mt-lg" rounded>
        <template #avatar>
          <q-icon name="support_agent" color="primary" />
        </template>
        <div class="text-body2">
          Une question sur votre commande ? Notre équipe support est là pour vous aider.
        </div>
        <template #action>
          <q-btn flat color="primary" label="Contacter le support" @click="contactSupport" />
        </template>
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { useOrdersStore } from 'stores/orders'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

// State
const orderId = ref(null)
const orderNumber = ref('')
const orderTotal = ref(0)

// Méthodes
const viewOrder = () => {
  router.push(`/account/orders/${orderId.value}`)
}

const contactSupport = () => {
  const subject = encodeURIComponent(`Support - Commande ${orderNumber.value || orderId.value}`)
  const body = encodeURIComponent(
    `Bonjour,\n\nJe contacte le support concernant ma commande ${orderNumber.value || orderId.value}.\n\nMerci de votre aide.`,
  )
  window.open(`mailto:support@kamri.com?subject=${subject}&body=${body}`)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

// Lifecycle
onMounted(async () => {
  orderId.value = route.params.orderId

  if (orderId.value) {
    try {
      // Récupérer les détails de la commande pour afficher le numéro et le total
      const result = await ordersStore.fetchOne(orderId.value)
      if (result.success && ordersStore.currentOrder) {
        orderNumber.value = ordersStore.currentOrder.number || `#${orderId.value}`
        orderTotal.value = ordersStore.currentOrder.totals?.total || 0
      }
    } catch (error) {
      console.warn('Impossible de récupérer les détails de la commande:', error)
      // Utiliser des valeurs par défaut
      orderNumber.value = `#${orderId.value}`
      orderTotal.value = 0
    }
  }
})
</script>

<style scoped>
.checkout-success-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
</style>
