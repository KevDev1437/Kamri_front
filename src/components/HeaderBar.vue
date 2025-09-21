<!-- src/components/HeaderBar.vue -->
<template>
  <div>
    <!-- Top banner for promotions -->
    <div v-if="showPromoBanner" class="bg-orange-2 text-dark text-center q-py-sm relative">
      <span>🎉 Livraison gratuite dès 35€ d'achat ! 🚚</span>
      <q-btn
        flat
        round
        dense
        class="absolute-right"
        icon="close"
        @click="showPromoBanner = false"
      />
    </div>

    <!-- Main toolbar -->
    <q-toolbar class="bg-white text-primary q-px-md q-px-lg-xl shadow-2">
      <!-- Drawer Toggle for Mobile Only -->
      <q-btn v-if="$q.screen.lt.sm" flat round dense icon="menu" @click="$emit('toggle-drawer')" />

      <!-- Logo -->
      <router-link to="/" class="text-primary no-underline logo-container">
        <q-avatar size="32px" class="q-mr-sm">
          <img src="/images/logo.png" alt="KAMRI" />
        </q-avatar>
        <span class="text-h6 font-weight-bold text-primary">KAMRI</span>
      </router-link>

      <!-- Categories Menu -->
      <q-btn-dropdown
        flat
        no-caps
        dense
        class="q-ml-md categories-menu desktop-only"
        label="Catégories"
        content-class="categories-dropdown"
      >
        <div class="row no-wrap categories-container">
          <!-- Liste des catégories principales -->
          <q-list class="categories-list" dense>
            <q-item
              v-for="category in categories"
              :key="category.id"
              clickable
              v-ripple
              :class="{ 'selected-category': selectedCategory === category }"
              @mouseover="selectedCategory = category"
            >
              <q-item-section>
                <q-item-label>{{ category.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" size="1em" />
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Sous-catégories -->
          <div class="subcategories-container" v-if="selectedCategory">
            <div class="row q-col-gutter-md q-pa-md">
              <div v-for="section in selectedCategory.sections" :key="section.id" class="col-4">
                <div class="text-weight-bold q-mb-sm">{{ section.name }}</div>
                <q-list dense>
                  <q-item
                    v-for="subcat in section.subcategories"
                    :key="subcat.id"
                    clickable
                    v-ripple
                    :to="{ name: 'category', params: { id: subcat.id } }"
                    class="subcategory-item"
                  >
                    <q-item-section>{{ subcat.name }}</q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
        </div>
      </q-btn-dropdown>

      <!-- Barre de recherche qui occupe tout l'espace -->
      <div class="search-container">
        <SearchBar />
      </div>

      <!-- Action Icons -->
      <div class="header-actions">
        <!-- User Menu -->
        <q-btn-dropdown flat dense no-caps class="user-menu" v-if="$q.screen.gt.xs">
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-icon name="person" />
              <div class="q-ml-sm">
                {{ authStore.isAuthenticated ? authStore.user?.name : 'Mon Compte' }}
              </div>
            </div>
          </template>

          <q-list>
            <!-- Menu pour utilisateur connecté -->
            <template v-if="authStore.isAuthenticated">
              <q-item clickable v-ripple to="/account/profile">
                <q-item-section>Mon profil</q-item-section>
              </q-item>
              <q-item clickable v-ripple to="/account/orders">
                <q-item-section>Mes commandes</q-item-section>
              </q-item>
              <q-item clickable v-ripple to="/account/wishlist">
                <q-item-section>Ma liste d'envies</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-ripple @click="logout">
                <q-item-section>Déconnexion</q-item-section>
              </q-item>
            </template>

            <!-- Menu pour utilisateur non connecté -->
            <template v-else>
              <q-item clickable v-ripple to="/login">
                <q-item-section>Se connecter</q-item-section>
              </q-item>
              <q-item clickable v-ripple to="/register">
                <q-item-section>Créer un compte</q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>

        <!-- Favorites -->
        <q-btn flat round dense class="desktop-only">
          <template v-slot:default>
            <q-icon name="favorite" />
            <q-badge color="red" floating rounded>{{ favoritesCount }}</q-badge>
          </template>
        </q-btn>

        <!-- Shopping Cart -->
        <q-btn flat round dense class="cart-btn">
          <template v-slot:default>
            <q-icon name="shopping_cart" />
            <q-badge color="red" floating rounded>{{ cartItemsCount }}</q-badge>
          </template>
        </q-btn>
      </div>
    </q-toolbar>

    <!-- Navigation bar (desktop only) -->
    <q-toolbar v-if="$q.screen.gt.sm" class="bg-grey-2 text-dark q-px-lg desktop-only">
      <div class="row full-width justify-between">
        <div class="row q-gutter-md">
          <q-btn flat no-caps dense label="Nouveautés" />
          <q-btn flat no-caps dense label="Meilleures ventes" />
          <q-btn flat no-caps dense label="Promos" />
          <q-btn flat no-caps dense label="Collections" />
        </div>
        <div class="row q-gutter-md">
          <q-btn flat no-caps dense icon="support_agent" label="Service Client" />
          <q-btn flat no-caps dense icon="local_shipping" label="Suivi de commande" />
        </div>
      </div>
    </q-toolbar>
  </div>
</template>

<script setup>
import SearchBar from 'components/SearchBar.vue'
import { useQuasar } from 'quasar'
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'

const $q = useQuasar()
const showPromoBanner = ref(true)
const favoritesCount = ref(0)
const cartItemsCount = ref(0)
const selectedCategory = ref(null)

// Cette structure sera remplacée par les données du backend
const categories = ref([
  {
    id: 1,
    name: 'Tout Maison et Cuisine',
    icon: 'home',
    sections: [
      {
        id: 1,
        name: 'Cuisine',
        subcategories: [
          { id: 1, name: 'Rangements de cuisine' },
          { id: 2, name: 'Ustensiles et Objets de cuisine' },
          { id: 3, name: 'Espace de vie et Repas' },
        ],
      },
      {
        id: 2,
        name: 'Salle de bain',
        subcategories: [
          { id: 4, name: 'Douches et Baignoires' },
          { id: 5, name: 'Serviettes et Rideaux de douche' },
          { id: 6, name: 'Produits de nettoyage' },
        ],
      },
      {
        id: 3,
        name: 'Décoration',
        subcategories: [
          { id: 7, name: 'Décoration intérieure' },
          { id: 8, name: 'Tapis et Paillassons' },
          { id: 9, name: 'Rideaux et Accessoires de fenêtres' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Mode',
    icon: 'checkroom',
    sections: [
      {
        id: 4,
        name: 'Femme',
        subcategories: [
          { id: 10, name: 'Vêtements femme' },
          { id: 11, name: 'Grandes tailles femme' },
          { id: 12, name: 'Chaussures femme' },
        ],
      },
      {
        id: 5,
        name: 'Homme',
        subcategories: [
          { id: 13, name: 'Vêtements homme' },
          { id: 14, name: 'Chaussures homme' },
          { id: 15, name: 'Grandes tailles homme' },
        ],
      },
    ],
  },
  // Autres catégories à ajouter...
])

// Fonction pour charger les catégories depuis le backend
const loadCategories = async () => {
  try {
    // À implémenter : appel API pour récupérer les catégories
    // const response = await api.get('/categories')
    // categories.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
  // Rediriger vers la page d'accueil après déconnexion
  window.location.href = '/'
}

onMounted(() => {
  loadCategories()
  // Sélectionner la première catégorie par défaut
  if (categories.value.length > 0) {
    selectedCategory.value = categories.value[0]
  }
})
</script>

<style lang="scss" scoped>
.logo-container {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.search-container {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 16px;
  position: relative;
}

.camera-btn {
  position: absolute;
  right: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-menu {
  min-width: 120px;
}

.desktop-only {
  display: none;
}

@media (min-width: 1024px) {
  .desktop-only {
    display: flex;
  }
}

/* Animation pour le banner promo */
.promo-banner-enter-active,
.promo-banner-leave-active {
  transition: all 0.3s ease;
}

.promo-banner-enter-from,
.promo-banner-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Styles pour le menu des catégories */
.categories-dropdown {
  width: 900px;
  max-height: 80vh;
  overflow: hidden;
}

.categories-container {
  display: flex;
  height: 400px;
}

.categories-list {
  width: 250px;
  border-right: 1px solid #e0e0e0;
  background: #f5f5f5;
  overflow-y: auto;
}

.selected-category {
  background: white !important;
  color: var(--q-primary);
  font-weight: 500;
}

.subcategories-container {
  flex: 1;
  background: white;
  overflow-y: auto;
}

.subcategory-item {
  padding: 4px 0;
  min-height: 32px;

  &:hover {
    color: var(--q-primary);
  }
}
</style>
