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
            <q-item clickable v-ripple to="/account/wishlist">
              <q-item-section avatar>
                <q-icon name="favorite" />
              </q-item-section>
              <q-item-section>Ma liste d'envies</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Main content -->
        <div class="col-12 col-md-9">
          <!-- Loading Skeleton -->
          <div v-if="ordersStore.loadingDetail" class="q-mb-lg">
            <q-card>
              <q-card-section>
                <q-skeleton type="text" width="60%" />
                <q-skeleton type="text" width="40%" class="q-mt-sm" />
              </q-card-section>
            </q-card>
          </div>

          <!-- Erreur 404 -->
          <q-banner
            v-else-if="ordersStore.errorDetail"
            class="bg-negative text-white q-mb-md"
            rounded
          >
            <template #avatar>
              <q-icon name="error" />
            </template>
            {{ ordersStore.errorDetail }}
            <template #action>
              <q-btn flat color="white" label="Retour aux commandes" to="/account/orders" />
            </template>
          </q-banner>

          <!-- Détail de la commande -->
          <div v-else-if="ordersStore.currentOrder">
            <!-- Header -->
            <div class="row items-center justify-between q-mb-lg">
              <div>
                <h2 class="text-h5 q-mb-none">
                  {{ ordersStore.currentOrder.number || `#${ordersStore.currentOrder.id}` }}
                </h2>
                <div class="text-caption text-grey-7 q-mt-xs">
                  Commande du {{ formatDate(ordersStore.currentOrder.date) }}
                </div>
              </div>
              <q-chip
                :color="getStatusColor(ordersStore.currentOrder.status)"
                text-color="white"
                :label="getStatusLabel(ordersStore.currentOrder.status)"
                size="lg"
              />
            </div>

            <!-- Bloc récap (2 colonnes en desktop, stack en mobile) -->
            <div class="row q-col-gutter-lg q-mb-lg">
              <!-- Adresse livraison -->
              <div class="col-12 col-md-6">
                <q-card>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">
                      <q-icon name="local_shipping" class="q-mr-sm" />
                      Livraison
                    </div>
                    <div class="text-body1 text-weight-medium">
                      {{ ordersStore.currentOrder.shipping?.name }}
                    </div>
                    <div class="text-body2 text-grey-7 q-mt-sm">
                      {{ formatAddress(ordersStore.currentOrder.shipping?.address) }}
                    </div>
                    <div v-if="ordersStore.currentOrder.shipping?.method" class="q-mt-md">
                      <div class="text-caption text-grey-6">Transporteur</div>
                      <div class="text-body2">
                        {{ ordersStore.currentOrder.shipping.method }}
                      </div>
                    </div>
                    <div v-if="ordersStore.currentOrder.shipping?.tracking" class="q-mt-sm">
                      <div class="text-caption text-grey-6">Numéro de suivi</div>
                      <div class="text-body2">
                        <a
                          v-if="ordersStore.currentOrder.shipping?.trackingUrl"
                          :href="ordersStore.currentOrder.shipping.trackingUrl"
                          target="_blank"
                          class="text-primary"
                        >
                          {{ ordersStore.currentOrder.shipping.tracking }}
                        </a>
                        <span v-else>{{ ordersStore.currentOrder.shipping.tracking }}</span>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Adresse facturation -->
              <div class="col-12 col-md-6">
                <q-card>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">
                      <q-icon name="receipt" class="q-mr-sm" />
                      Facturation
                    </div>
                    <div class="text-body1 text-weight-medium">
                      {{ ordersStore.currentOrder.billing?.name }}
                    </div>
                    <div class="text-body2 text-grey-7 q-mt-sm">
                      {{ formatAddress(ordersStore.currentOrder.billing?.address) }}
                    </div>
                    <div v-if="ordersStore.currentOrder.payment?.method" class="q-mt-md">
                      <div class="text-caption text-grey-6">Mode de paiement</div>
                      <div class="text-body2">
                        {{ getPaymentMethodLabel(ordersStore.currentOrder.payment.method) }}
                        <span v-if="ordersStore.currentOrder.payment?.last4">
                          •••• {{ ordersStore.currentOrder.payment.last4 }}
                        </span>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Lignes de commande -->
            <q-card class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 q-mb-md">
                  <q-icon name="shopping_bag" class="q-mr-sm" />
                  Articles commandés
                </div>
                <q-list separator>
                  <q-item
                    v-for="line in ordersStore.currentOrder.lines"
                    :key="line.id"
                    class="q-pa-md"
                  >
                    <q-item-section avatar>
                      <q-avatar square size="60px">
                        <img :src="line.image" :alt="line.title" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">
                        {{ line.title }}
                      </q-item-label>
                      <q-item-label caption v-if="line.variant">
                        {{ line.variant }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="text-right">
                        <div class="text-body2">{{ formatPrice(line.unit) }} × {{ line.qty }}</div>
                        <div class="text-h6 text-weight-bold text-primary">
                          {{ formatPrice(line.subtotal) }}
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>

            <!-- Totaux -->
            <q-card class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 q-mb-md">
                  <q-icon name="calculate" class="q-mr-sm" />
                  Récapitulatif
                </div>
                <div class="row justify-end">
                  <div class="col-12 col-md-6">
                    <div class="row justify-between q-py-xs">
                      <span class="text-body2">Sous-total</span>
                      <span class="text-body2">{{
                        formatPrice(ordersStore.currentOrder.totals?.subtotal)
                      }}</span>
                    </div>
                    <div
                      v-if="ordersStore.currentOrder.totals?.discount"
                      class="row justify-between q-py-xs"
                    >
                      <span class="text-body2 text-positive">Remise</span>
                      <span class="text-body2 text-positive"
                        >-{{ formatPrice(ordersStore.currentOrder.totals.discount) }}</span
                      >
                    </div>
                    <div class="row justify-between q-py-xs">
                      <span class="text-body2">Livraison</span>
                      <span class="text-body2">{{
                        formatPrice(ordersStore.currentOrder.totals?.shipping)
                      }}</span>
                    </div>
                    <div class="row justify-between q-py-xs">
                      <span class="text-body2">Taxes</span>
                      <span class="text-body2">{{
                        formatPrice(ordersStore.currentOrder.totals?.tax)
                      }}</span>
                    </div>
                    <q-separator class="q-my-sm" />
                    <div class="row justify-between q-py-xs">
                      <span class="text-h6 text-weight-bold">Total TTC</span>
                      <span class="text-h6 text-weight-bold text-primary">
                        {{ formatPrice(ordersStore.currentOrder.totals?.total) }}
                      </span>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Timeline -->
            <q-card class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 q-mb-md">
                  <q-icon name="timeline" class="q-mr-sm" />
                  Suivi de la commande
                </div>
                <q-timeline color="primary">
                  <q-timeline-entry
                    v-for="step in ordersStore.currentOrder.timeline"
                    :key="step.key"
                    :title="getTimelineTitle(step.key)"
                    :subtitle="formatDate(step.at)"
                    :icon="getTimelineIcon(step.key)"
                    :color="getTimelineColor(step.key)"
                  />
                </q-timeline>
              </q-card-section>
            </q-card>

            <!-- Actions -->
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">
                  <q-icon name="settings" class="q-mr-sm" />
                  Actions
                </div>
                <div class="row q-gutter-md">
                  <q-btn
                    color="primary"
                    label="Re-commander"
                    icon="shopping_cart"
                    @click="reorder"
                    :loading="reorderLoading"
                  />
                  <q-btn
                    outline
                    color="primary"
                    label="Télécharger la facture"
                    icon="download"
                    @click="downloadInvoice"
                    :loading="downloadLoading"
                  />
                  <q-btn
                    flat
                    color="grey-7"
                    label="Contacter le support"
                    icon="support_agent"
                    @click="contactSupport"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from 'stores/orders'
import { useCartStore } from 'stores/cart'
import { Notify } from 'quasar'

const route = useRoute()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()

// State
const reorderLoading = ref(false)
const downloadLoading = ref(false)

// Computed pour les couleurs de statut
const getStatusColor = (status) => {
  const colors = {
    pending: 'grey',
    paid: 'primary',
    shipped: 'info',
    delivered: 'positive',
    canceled: 'negative',
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    paid: 'Payée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    canceled: 'Annulée',
  }
  return labels[status] || status
}

// Fonctions pour la timeline
const getTimelineTitle = (key) => {
  const titles = {
    created: 'Commande créée',
    paid: 'Commande payée',
    shipped: 'Commande expédiée',
    delivered: 'Commande livrée',
  }
  return titles[key] || key
}

const getTimelineIcon = (key) => {
  const icons = {
    created: 'add_shopping_cart',
    paid: 'payment',
    shipped: 'local_shipping',
    delivered: 'check_circle',
  }
  return icons[key] || 'info'
}

const getTimelineColor = (key) => {
  const colors = {
    created: 'primary',
    paid: 'positive',
    shipped: 'info',
    delivered: 'positive',
  }
  return colors[key] || 'grey'
}

// Fonction pour re-commander
const reorder = async () => {
  reorderLoading.value = true
  try {
    const result = await ordersStore.reorder(ordersStore.currentOrder.id)
    if (result.success) {
      Notify.create({
        type: 'positive',
        message: result.message || 'Commande ajoutée au panier',
        position: 'top',
      })
      // Ouvrir le drawer du panier
      cartStore.toggleDrawer()
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
      message: 'Erreur lors de la re-commande',
      position: 'top',
    })
  } finally {
    reorderLoading.value = false
  }
}

// Fonction pour télécharger la facture
const downloadInvoice = async () => {
  downloadLoading.value = true
  try {
    const result = await ordersStore.downloadInvoice(ordersStore.currentOrder.id)
    if (result.success) {
      Notify.create({
        type: 'positive',
        message: result.message || 'Facture téléchargée avec succès',
        position: 'top',
      })
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
      message: 'Erreur lors du téléchargement de la facture',
      position: 'top',
    })
  } finally {
    downloadLoading.value = false
  }
}

// Fonction pour contacter le support
const contactSupport = () => {
  const subject = encodeURIComponent(
    `Support - Commande ${ordersStore.currentOrder.number || ordersStore.currentOrder.id}`,
  )
  const body = encodeURIComponent(
    `Bonjour,\n\nJe contacte le support concernant ma commande ${ordersStore.currentOrder.number || ordersStore.currentOrder.id}.\n\nMerci de votre aide.`,
  )
  window.open(`mailto:support@kamri.com?subject=${subject}&body=${body}`)
}

// Fonctions utilitaires
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

const formatAddress = (address) => {
  if (!address) return ''
  if (typeof address === 'string') return address
  return `${address.street}, ${address.city}, ${address.postal_code} ${address.country}`
}

const getPaymentMethodLabel = (method) => {
  const labels = {
    card: 'Carte bancaire',
    paypal: 'PayPal',
    bank_transfer: 'Virement bancaire',
    cash: 'Espèces',
  }
  return labels[method] || method
}

// Lifecycle
onMounted(async () => {
  const orderId = route.params.id
  if (orderId) {
    await ordersStore.fetchOne(orderId)
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
