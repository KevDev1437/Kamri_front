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
          <!-- Header -->
          <div class="row items-center justify-between q-mb-lg">
            <div>
              <h2 class="text-h5 q-mb-none">Mes commandes</h2>
              <div class="text-caption text-grey-7">
                {{ ordersStore.total }} commande{{ ordersStore.total > 1 ? 's' : '' }}
                <span v-if="ordersStore.hasActiveFilters">
                  ({{ ordersStore.activeFiltersCount }} filtre{{
                    ordersStore.activeFiltersCount > 1 ? 's' : ''
                  }}
                  actif{{ ordersStore.activeFiltersCount > 1 ? 's' : '' }})
                </span>
              </div>
            </div>
          </div>

          <!-- Toolbar Filtres -->
          <q-card class="q-mb-lg">
            <q-card-section>
              <q-form @submit.prevent="applyFilters" class="q-gutter-md">
                <div class="row q-col-gutter-md">
                  <!-- Recherche -->
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="localFilters.q"
                      label="Rechercher (numéro, produit, référence)"
                      outlined
                      dense
                      clearable
                      :debounce="300"
                      @update:model-value="onSearchChange"
                      aria-label="Rechercher dans les commandes"
                    >
                      <template #prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Statut -->
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="localFilters.status"
                      :options="ordersStore.statusOptions"
                      label="Statut"
                      outlined
                      dense
                      clearable
                      @update:model-value="onFilterChange"
                      aria-label="Filtrer par statut"
                    />
                  </div>

                  <!-- Date de -->
                  <div class="col-12 col-md-2">
                    <q-input
                      v-model="localFilters.dateFrom"
                      type="date"
                      label="Depuis"
                      outlined
                      dense
                      @update:model-value="onFilterChange"
                      aria-label="Date de début"
                    />
                  </div>

                  <!-- Date jusqu'à -->
                  <div class="col-12 col-md-2">
                    <q-input
                      v-model="localFilters.dateTo"
                      type="date"
                      label="Jusqu'à"
                      outlined
                      dense
                      @update:model-value="onFilterChange"
                      aria-label="Date de fin"
                    />
                  </div>

                  <!-- Actions -->
                  <div class="col-12 col-md-1">
                    <div class="row q-gutter-xs">
                      <q-btn
                        color="primary"
                        icon="search"
                        @click="applyFilters"
                        :loading="ordersStore.loading"
                        aria-label="Appliquer les filtres"
                      />
                      <q-btn
                        v-if="ordersStore.hasActiveFilters"
                        flat
                        color="grey-7"
                        icon="refresh"
                        @click="resetFilters"
                        aria-label="Réinitialiser les filtres"
                      />
                    </div>
                  </div>
                </div>

                <!-- Chips Filtres Actifs -->
                <div v-if="ordersStore.hasActiveFilters" class="q-mt-md">
                  <div class="row q-gutter-xs">
                    <q-chip
                      v-for="filter in ordersStore.activeFilters"
                      :key="filter.key"
                      removable
                      color="primary"
                      text-color="white"
                      @remove="removeFilter(filter.key)"
                      :aria-label="`Supprimer le filtre ${filter.label}`"
                    >
                      {{ filter.label }}
                    </q-chip>
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>

          <!-- Erreur -->
          <q-banner v-if="ordersStore.error" class="bg-negative text-white q-mb-md" rounded>
            <template #avatar>
              <q-icon name="error" />
            </template>
            {{ ordersStore.error }}
            <template #action>
              <q-btn flat color="white" label="Réessayer" @click="ordersStore.fetch()" />
            </template>
          </q-banner>

          <!-- Loading Skeleton -->
          <div v-if="ordersStore.loading && ordersStore.items.length === 0" class="q-mb-lg">
            <q-list bordered separator>
              <q-item v-for="n in 5" :key="n">
                <q-item-section avatar>
                  <q-skeleton type="circle" size="40px" />
                </q-item-section>
                <q-item-section>
                  <q-skeleton type="text" width="60%" />
                  <q-skeleton type="text" width="40%" />
                </q-item-section>
                <q-item-section side>
                  <q-skeleton type="text" width="80px" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Empty state -->
          <div v-else-if="ordersStore.items.length === 0" class="text-center q-py-xl">
            <q-icon name="shopping_bag" size="64px" color="grey-5" />
            <div class="text-h6 q-mt-md text-grey-7">
              {{
                ordersStore.hasActiveFilters
                  ? 'Aucune commande ne correspond à vos critères'
                  : 'Aucune commande'
              }}
            </div>
            <div class="text-body2 text-grey-6 q-mt-sm">
              {{
                ordersStore.hasActiveFilters
                  ? 'Essayez de modifier vos filtres'
                  : "Vous n'avez pas encore passé de commande."
              }}
            </div>
            <q-btn
              v-if="ordersStore.hasActiveFilters"
              color="primary"
              label="Réinitialiser les filtres"
              @click="resetFilters"
              class="q-mt-md"
            />
            <q-btn
              v-else
              color="primary"
              label="Découvrir nos produits"
              to="/products"
              class="q-mt-md"
            />
          </div>

          <!-- Orders list -->
          <div v-else>
            <!-- Desktop: Table -->
            <div v-if="$q.screen.gt.sm" class="q-mb-lg">
              <q-table
                :rows="ordersStore.items"
                :columns="columns"
                row-key="id"
                flat
                bordered
                :loading="ordersStore.loading"
                :pagination="{ rowsPerPage: 0 }"
                hide-pagination
              >
                <template #body-cell-status="props">
                  <q-td :props="props">
                    <q-chip
                      :color="getStatusColor(props.value)"
                      text-color="white"
                      :label="getStatusLabel(props.value)"
                      size="sm"
                    />
                  </q-td>
                </template>

                <template #body-cell-total="props">
                  <q-td :props="props">
                    <span class="text-weight-bold text-primary">
                      {{ formatPrice(props.value) }}
                    </span>
                  </q-td>
                </template>

                <template #body-cell-actions="props">
                  <q-td :props="props">
                    <div class="row q-gutter-xs">
                      <q-btn
                        flat
                        round
                        dense
                        icon="visibility"
                        color="primary"
                        @click="viewOrder(props.row)"
                        aria-label="Voir la commande"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        icon="shopping_cart"
                        color="secondary"
                        @click="reorder(props.row)"
                        aria-label="Re-commander"
                      />
                      <q-btn
                        flat
                        round
                        dense
                        icon="download"
                        color="grey-7"
                        @click="downloadInvoice(props.row)"
                        aria-label="Télécharger la facture"
                      />
                    </div>
                  </q-td>
                </template>
              </q-table>
            </div>

            <!-- Mobile: Cards -->
            <div v-else class="q-mb-lg">
              <q-list bordered separator>
                <q-item
                  v-for="order in ordersStore.items"
                  :key="order.id"
                  clickable
                  v-ripple
                  @click="viewOrder(order)"
                >
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ order.number || `#${order.id}` }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ formatDate(order.date) }} • {{ getStatusLabel(order.status) }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ order.itemsCount }} article{{ order.itemsCount > 1 ? 's' : '' }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-weight-bold text-primary">
                      {{ formatPrice(order.total) }}
                    </q-item-label>
                    <q-chip
                      :color="getStatusColor(order.status)"
                      text-color="white"
                      :label="getStatusLabel(order.status)"
                      size="sm"
                      class="q-mt-xs"
                    />
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" color="grey-5" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Bouton Voir Plus -->
            <div v-if="ordersStore.hasMore" class="text-center q-mt-xl">
              <q-btn
                color="primary"
                outline
                size="lg"
                label="Voir plus de commandes"
                :loading="ordersStore.loading"
                @click="loadMore"
                icon="expand_more"
              />
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
import { useOrdersStore } from 'stores/orders'
import { useCartStore } from 'stores/cart'
import { Notify } from 'quasar'
import { debounce } from 'quasar'

const router = useRouter()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()

// State local pour éviter les mises à jour trop fréquentes
const localFilters = ref({
  q: '',
  status: null,
  dateFrom: null,
  dateTo: null,
})

// Colonnes pour la table desktop
const columns = [
  {
    name: 'number',
    required: true,
    label: 'Commande',
    align: 'left',
    field: (row) => row.number || `#${row.id}`,
    sortable: true,
  },
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    field: 'date',
    format: (val) => formatDate(val),
    sortable: true,
  },
  {
    name: 'status',
    label: 'Statut',
    align: 'center',
    field: 'status',
    sortable: true,
  },
  {
    name: 'itemsCount',
    label: 'Articles',
    align: 'center',
    field: 'itemsCount',
    sortable: true,
  },
  {
    name: 'total',
    label: 'Total',
    align: 'right',
    field: 'total',
    format: (val) => formatPrice(val),
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    field: 'actions',
  },
]

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

// Fonction pour mettre à jour les filtres avec debounce
const updateFilters = debounce(() => {
  ordersStore.q = localFilters.value.q
  ordersStore.status = localFilters.value.status
  ordersStore.dateFrom = localFilters.value.dateFrom
  ordersStore.dateTo = localFilters.value.dateTo
  ordersStore.page = 1
  ordersStore.fetch()
}, 300)

// Gestionnaires d'événements
const onSearchChange = () => {
  updateFilters()
}

const onFilterChange = () => {
  updateFilters()
}

const applyFilters = () => {
  updateFilters()
}

const resetFilters = () => {
  ordersStore.resetFilters()
  localFilters.value = {
    q: '',
    status: null,
    dateFrom: null,
    dateTo: null,
  }
  ordersStore.fetch()
}

const removeFilter = (filterKey) => {
  ordersStore.removeFilter(filterKey)
  localFilters.value[filterKey] = filterKey === 'q' ? '' : null
  ordersStore.fetch()
}

// Fonction pour charger plus de commandes
const loadMore = () => {
  ordersStore.fetchNext()
}

// Fonction pour voir une commande
const viewOrder = (order) => {
  router.push(`/account/orders/${order.id}`)
}

// Fonction pour re-commander
const reorder = async (order) => {
  try {
    const result = await ordersStore.reorder(order.id)
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
  }
}

// Fonction pour télécharger la facture
const downloadInvoice = async (order) => {
  try {
    const result = await ordersStore.downloadInvoice(order.id)
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
  }
}

// Fonctions utilitaires
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

// Lifecycle
onMounted(async () => {
  // Synchroniser les filtres locaux avec le store
  localFilters.value = {
    q: ordersStore.q,
    status: ordersStore.status,
    dateFrom: ordersStore.dateFrom,
    dateTo: ordersStore.dateTo,
  }

  // Charger les commandes
  await ordersStore.fetch()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
