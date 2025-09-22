<!-- src/components/HeaderBar.vue -->
<template>
  <div>
    <!-- Top banner for promotions Style Temu -->
    <div v-if="showPromoBanner" class="temu-promo-banner">
      <div class="temu-promo-content">
        <span class="temu-promo-text"> 🎉 Livraison gratuite dès 35€ d'achat ! 🚚 </span>
        <q-btn
          flat
          round
          dense
          class="temu-promo-close"
          icon="close"
          size="sm"
          @click="showPromoBanner = false"
        />
      </div>
    </div>

    <!-- Bandeau email non vérifié -->
    <q-banner
      v-if="authStore.isAuthenticated && !authStore.user?.email_verified_at && !bannerDismissed"
      class="bg-warning text-dark"
      dense
    >
      <template #avatar>
        <q-icon name="email" color="dark" />
      </template>
      <div class="text-body2">
        Votre adresse email n'est pas vérifiée.
        <q-btn
          flat
          dense
          label="Renvoyer l'email"
          @click="resendVerification"
          :loading="verificationLoading"
          class="q-ml-sm"
        />
        <q-btn
          flat
          dense
          label="Actualiser"
          @click="checkVerification"
          :loading="checkLoading"
          class="q-ml-xs"
        />
      </div>
      <template #action>
        <q-btn
          flat
          round
          dense
          icon="close"
          @click="dismissBanner"
          aria-label="Fermer le bandeau"
        />
      </template>
    </q-banner>

    <!-- Main toolbar -->
    <q-toolbar class="kamri-main-toolbar">
      <!-- Drawer Toggle for Mobile Only -->
      <q-btn v-if="$q.screen.lt.sm" flat round dense icon="menu" @click="$emit('toggle-drawer')" />

      <!-- Logo -->
      <router-link to="/" class="kamri-logo-link">
        <q-avatar size="40px" class="q-mr-sm">
          <img src="/images/logo.png" alt="KAMRI" />
        </q-avatar>
        <span class="kamri-logo-text">KAMRI</span>
      </router-link>

      <!-- Categories Menu -->
      <q-btn-dropdown
        flat
        no-caps
        dense
        class="kamri-categories-menu desktop-only"
        label="Catégories"
        content-class="kamri-categories-dropdown"
      >
        <div class="kamri-categories-container">
          <!-- Liste des catégories principales -->
          <q-list class="kamri-categories-list" dense>
            <q-item
              v-for="category in categories"
              :key="category.id"
              clickable
              v-ripple
              :class="{ 'kamri-selected-category': selectedCategory === category }"
              @mouseover="selectedCategory = category"
              @click="navigateToCategory(category)"
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
          <div class="kamri-subcategories-container" v-if="selectedCategory">
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
                    class="kamri-subcategory-item"
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
      <div class="kamri-search-container">
        <SearchBar />
      </div>

      <!-- Action Icons -->
      <div class="kamri-header-actions">
        <!-- User Menu -->
        <q-btn-dropdown flat dense no-caps class="kamri-user-menu" v-if="$q.screen.gt.xs">
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

        <!-- Wishlist -->
        <q-btn
          flat
          round
          dense
          class="kamri-wishlist-btn"
          to="/account/wishlist"
          aria-label="Aller à ma wishlist"
        >
          <template v-slot:default>
            <q-icon name="favorite" />
            <q-badge v-if="wishlistStore.count > 0" color="red" floating rounded>{{
              wishlistStore.count
            }}</q-badge>
          </template>
        </q-btn>

        <!-- Shopping Cart -->
        <q-btn
          flat
          round
          dense
          class="kamri-cart-btn"
          @click="cartStore.open()"
          aria-label="Ouvrir le panier"
        >
          <template v-slot:default>
            <q-icon name="shopping_cart" />
            <q-badge v-if="cartStore.count > 0" color="red" floating rounded>{{
              cartStore.count
            }}</q-badge>
          </template>
        </q-btn>
      </div>
    </q-toolbar>

    <!-- Navigation bar (desktop only) -->
    <q-toolbar v-if="$q.screen.gt.sm" class="kamri-nav-toolbar desktop-only">
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
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { useCartStore } from 'stores/cart'
import { useWishlistStore } from 'stores/wishlist'

const $q = useQuasar()
const router = useRouter()
const showPromoBanner = ref(true)
const favoritesCount = ref(0)
const selectedCategory = ref(null)
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const verificationLoading = ref(false)
const checkLoading = ref(false)
const bannerDismissed = ref(false)

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

const logout = async () => {
  await authStore.logout()
  // Rediriger vers la page d'accueil après déconnexion
  window.location.href = '/'
}

function navigateToCategory(category) {
  router.push({
    path: '/products',
    query: { cat: category.value || category.name.toLowerCase() },
  })
}

async function resendVerification() {
  verificationLoading.value = true
  try {
    const result = await authStore.resendVerification()
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: result.message || 'Email de vérification envoyé',
        position: 'top',
      })
    } else {
      $q.notify({
        type: 'negative',
        message: result.message,
        position: 'top',
      })
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: "Erreur lors de l'envoi de l'email",
      position: 'top',
    })
  } finally {
    verificationLoading.value = false
  }
}

async function checkVerification() {
  checkLoading.value = true
  try {
    const result = await authStore.checkVerification()
    if (result.success && result.user?.email_verified_at) {
      $q.notify({
        type: 'positive',
        message: 'Email vérifié avec succès !',
        position: 'top',
      })
    } else {
      $q.notify({
        type: 'info',
        message: 'Email pas encore vérifié',
        position: 'top',
      })
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la vérification',
      position: 'top',
    })
  } finally {
    checkLoading.value = false
  }
}

function dismissBanner() {
  bannerDismissed.value = true
}

onMounted(() => {
  loadCategories()
  cartStore.load()
  wishlistStore.restore()
  // Sélectionner la première catégorie par défaut
  if (categories.value.length > 0) {
    selectedCategory.value = categories.value[0]
  }
})
</script>

<style lang="scss" scoped>
// === BANNER PROMO STYLE TEMU ===
.temu-promo-banner {
  background: linear-gradient(90deg, #ff6b6b, #ffa500, #ff6b6b);
  background-size: 200% 100%;
  animation: temu-gradient-shift 3s ease-in-out infinite;
  color: white;
  text-align: center;
  padding: var(--kamri-space-sm) 0;
  position: relative;
  overflow: hidden;
}

@keyframes temu-gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.temu-promo-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--kamri-space-md);
}

.temu-promo-text {
  font-weight: 700;
  font-size: var(--kamri-font-size-sm);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  animation: temu-pulse 2s ease-in-out infinite;
}

@keyframes temu-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.temu-promo-close {
  position: absolute;
  right: var(--kamri-space-md);
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

// === TOOLBAR PRINCIPAL ===
.kamri-main-toolbar {
  background: var(--kamri-bg-primary) !important;
  color: var(--kamri-gray-800) !important;
  padding: var(--kamri-space-md) var(--kamri-space-lg);
  box-shadow: var(--kamri-shadow-sm);
  border-bottom: 1px solid var(--kamri-gray-200);
  min-height: 64px;

  .q-btn {
    color: var(--kamri-gray-800) !important;

    &:hover {
      background: var(--kamri-gray-100) !important;
      color: var(--kamri-primary) !important;
    }
  }
}

// === LOGO ===
.kamri-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  transition: var(--kamri-transition);

  &:hover {
    transform: scale(1.05);
  }
}

.kamri-logo-text {
  font-size: var(--kamri-font-size-xl);
  font-weight: 700;
  color: var(--kamri-primary);
  letter-spacing: -0.025em;
}

// === RECHERCHE ===
.kamri-search-container {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 var(--kamri-space-lg);
  position: relative;
  max-width: 600px;
}

// === ACTIONS HEADER ===
.kamri-header-actions {
  display: flex;
  align-items: center;
  gap: var(--kamri-space-sm);
}

.kamri-user-menu {
  min-width: 140px;
  border-radius: var(--kamri-radius);
  transition: var(--kamri-transition);

  &:hover {
    background: var(--kamri-gray-100);
  }
}

.kamri-cart-btn {
  position: relative;
  border-radius: var(--kamri-radius);
  transition: var(--kamri-transition);

  &:hover {
    background: var(--kamri-gray-100);
    transform: scale(1.1);
  }
}

// === NAVIGATION ===
.kamri-nav-toolbar {
  background: var(--kamri-gray-50) !important;
  color: var(--kamri-gray-700) !important;
  padding: var(--kamri-space-sm) var(--kamri-space-lg);
  border-bottom: 1px solid var(--kamri-gray-200);
  min-height: 48px;

  .q-btn {
    color: var(--kamri-gray-700) !important;
    border-radius: var(--kamri-radius);
    transition: var(--kamri-transition);

    &:hover {
      background: var(--kamri-primary) !important;
      color: white !important;
    }
  }
}

// === MENU CATÉGORIES ===
.kamri-categories-menu {
  margin-left: var(--kamri-space-lg);
  border-radius: var(--kamri-radius);
  transition: var(--kamri-transition);

  &:hover {
    background: var(--kamri-gray-100);
  }
}

.kamri-categories-dropdown {
  width: 900px;
  max-height: 80vh;
  overflow: hidden;
  border-radius: var(--kamri-radius-lg);
  box-shadow: var(--kamri-shadow-xl);
  border: 1px solid var(--kamri-gray-200);
}

.kamri-categories-container {
  display: flex;
  height: 400px;
}

.kamri-categories-list {
  width: 250px;
  border-right: 1px solid var(--kamri-gray-200);
  background: var(--kamri-gray-50);
  overflow-y: auto;

  .q-item {
    border-radius: 0;
    transition: var(--kamri-transition);

    &:hover {
      background: var(--kamri-gray-100);
    }
  }
}

.kamri-selected-category {
  background: var(--kamri-bg-primary) !important;
  color: var(--kamri-primary) !important;
  font-weight: 600;
  border-right: 3px solid var(--kamri-primary);
}

.kamri-subcategories-container {
  flex: 1;
  background: var(--kamri-bg-primary);
  overflow-y: auto;
  padding: var(--kamri-space-lg);
}

.kamri-subcategory-item {
  padding: var(--kamri-space-xs) 0;
  min-height: 36px;
  border-radius: var(--kamri-radius-sm);
  transition: var(--kamri-transition);

  &:hover {
    background: var(--kamri-gray-100);
    color: var(--kamri-primary);
    padding-left: var(--kamri-space-sm);
  }
}

// === RESPONSIVE ===
.desktop-only {
  display: none;
}

@media (min-width: 1024px) {
  .desktop-only {
    display: flex;
  }
}

// === ANIMATIONS ===
@keyframes kamri-animate-fade-in-up {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// === OVERRIDES QUASAR ===
.q-toolbar {
  .q-btn {
    border-radius: var(--kamri-radius);
  }
}

.q-badge {
  font-size: 10px;
  font-weight: 600;
}
</style>
