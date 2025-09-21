<!-- src/pages/account/OrdersPage.vue -->
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
            <q-item clickable v-ripple to="/account/orders" active-class="bg-primary text-white">
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
          <h2 class="text-h5 q-mb-lg">Mes commandes</h2>

          <!-- Loading state -->
          <div v-if="loading" class="text-center q-py-xl">
            <q-spinner-dots size="50px" color="primary" />
            <div class="text-body2 q-mt-md">Chargement des commandes...</div>
          </div>

          <!-- Empty state -->
          <div v-else-if="orders.length === 0" class="text-center q-py-xl">
            <q-icon name="shopping_bag" size="50px" color="grey-5" />
            <div class="text-h6 q-mt-md">Aucune commande</div>
            <div class="text-body2 text-grey-7 q-mt-sm">
              Vous n'avez pas encore passé de commande
            </div>
            <q-btn label="Découvrir nos produits" color="primary" to="/" class="q-mt-md" />
          </div>

          <!-- Orders list -->
          <div v-else>
            <q-list>
              <q-item v-for="order in orders" :key="order.id" class="q-pa-md" bordered>
                <q-item-section>
                  <div class="row items-center justify-between">
                    <div>
                      <div class="text-h6">Commande #{{ order.id }}</div>
                      <div class="text-body2 text-grey-7">
                        Passée le {{ formatDate(order.created_at) }}
                      </div>
                      <div class="text-body2">
                        {{ order.items.length }} article{{ order.items.length > 1 ? 's' : '' }} •
                        Total: {{ formatPrice(order.total) }}
                      </div>
                    </div>

                    <div class="text-right">
                      <q-chip
                        :color="getStatusColor(order.status)"
                        text-color="white"
                        :label="order.status"
                      />
                      <div class="q-mt-sm">
                        <q-btn
                          flat
                          dense
                          color="primary"
                          label="Voir les détails"
                          @click="viewOrderDetails(order)"
                        />
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </div>

    <!-- Order details dialog -->
    <q-dialog v-model="showOrderDetails" maximized>
      <q-card v-if="selectedOrder">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Commande #{{ selectedOrder.id }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-8">
              <div class="text-h6 q-mb-md">Articles commandés</div>
              <q-list>
                <q-item v-for="item in selectedOrder.items" :key="item.id" class="q-pa-md">
                  <q-item-section avatar>
                    <q-avatar square size="60px">
                      <img :src="item.image" :alt="item.name" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.name }}</q-item-label>
                    <q-item-label caption>
                      Quantité: {{ item.quantity }} • Prix unitaire: {{ formatPrice(item.price) }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-h6">{{ formatPrice(item.price * item.quantity) }}</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col-12 col-md-4">
              <q-card>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Résumé de la commande</div>

                  <div class="q-mb-md">
                    <div class="row justify-between q-mb-sm">
                      <span>Sous-total:</span>
                      <span>{{ formatPrice(selectedOrder.subtotal) }}</span>
                    </div>
                    <div class="row justify-between q-mb-sm">
                      <span>Livraison:</span>
                      <span>{{ formatPrice(selectedOrder.shipping) }}</span>
                    </div>
                    <q-separator class="q-my-sm" />
                    <div class="row justify-between text-h6">
                      <span>Total:</span>
                      <span>{{ formatPrice(selectedOrder.total) }}</span>
                    </div>
                  </div>

                  <div class="text-h6 q-mb-md">Adresse de livraison</div>
                  <div class="text-body2">
                    {{ selectedOrder.shipping_address.name }}<br />
                    {{ selectedOrder.shipping_address.address }}<br />
                    {{ selectedOrder.shipping_address.postal_code }}
                    {{ selectedOrder.shipping_address.city }}<br />
                    {{ selectedOrder.shipping_address.country }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// State
const loading = ref(false)
const orders = ref([])
const showOrderDetails = ref(false)
const selectedOrder = ref(null)

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

const getStatusColor = (status) => {
  const colors = {
    'En attente': 'orange',
    Confirmée: 'blue',
    Expédiée: 'purple',
    Livrée: 'green',
    Annulée: 'red',
  }
  return colors[status] || 'grey'
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showOrderDetails.value = true
}

const fetchOrders = async () => {
  loading.value = true

  try {
    // TODO: Implémenter l'appel API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulation

    // Données de test
    orders.value = [
      {
        id: 'ORD-001',
        created_at: '2024-01-15T10:30:00Z',
        status: 'Livrée',
        subtotal: 89.98,
        shipping: 0,
        total: 89.98,
        items: [
          {
            id: 1,
            name: "Robe d'été fleurie",
            price: 49.99,
            quantity: 1,
            image: 'https://picsum.photos/200/200?random=1',
          },
          {
            id: 2,
            name: 'T-shirt coton bio',
            price: 19.99,
            quantity: 2,
            image: 'https://picsum.photos/200/200?random=2',
          },
        ],
        shipping_address: {
          name: 'John Doe',
          address: '123 Rue de la Paix',
          postal_code: '75001',
          city: 'Paris',
          country: 'France',
        },
      },
      {
        id: 'ORD-002',
        created_at: '2024-01-10T14:20:00Z',
        status: 'Expédiée',
        subtotal: 129.99,
        shipping: 5.99,
        total: 135.98,
        items: [
          {
            id: 3,
            name: 'Jean slim taille haute',
            price: 79.99,
            quantity: 1,
            image: 'https://picsum.photos/200/200?random=3',
          },
          {
            id: 4,
            name: 'Baskets blanches',
            price: 50.0,
            quantity: 1,
            image: 'https://picsum.photos/200/200?random=4',
          },
        ],
        shipping_address: {
          name: 'John Doe',
          address: '123 Rue de la Paix',
          postal_code: '75001',
          city: 'Paris',
          country: 'France',
        },
      },
    ]
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
