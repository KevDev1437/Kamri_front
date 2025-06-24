<!-- src/components/HeaderBar.vue -->
<template>
  <div>
    <!-- Top banner for promotions -->
    <div v-if="showPromoBanner" class="bg-orange-2 text-dark text-center q-py-sm relative">
      <span>🎉 Livraison gratuite dès 35€ d'achat ! 🚚</span>
      <q-btn flat round dense class="absolute-right" icon="close" @click="showPromoBanner = false" />
    </div>

    <!-- Main toolbar -->
    <q-toolbar class="bg-white text-primary q-px-md q-px-lg-xl shadow-2">
      <!-- Drawer Toggle for Mobile Only -->
      <q-btn
        v-if="$q.screen.lt.sm"
        flat
        round
        dense
        icon="menu"
        @click="$emit('toggle-drawer')"
      />

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
      >
        <q-list class="row" style="width: 600px">
          <q-item v-for="category in mainCategories" :key="category.id" class="col-4" clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ category.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
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
              <div class="q-ml-sm">Mon Compte</div>
            </div>
          </template>

          <q-list>
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
import { ref } from 'vue'

const $q = useQuasar()
const showPromoBanner = ref(true)
const favoritesCount = ref(0)
const cartItemsCount = ref(0)

const mainCategories = [
  { id: 1, name: 'MODE' },
  { id: 2, name: 'MAISON' },
  { id: 3, name: 'HIGH-TECH' },
  { id: 4, name: 'SPORT' },
  { id: 5, name: 'BEAUTÉ' },
  { id: 6, name: 'ENFANTS' },
  { id: 7, name: 'AUTO' },
  { id: 8, name: 'JARDIN' },
  { id: 9, name: 'BRICOLAGE' }
]

const logout = () => {
  // Implémenter la logique de déconnexion ici
  console.log('Déconnexion...')
}
</script>

<style scoped>
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
</style>
