<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout class="kamri-layout">
    <!-- Header -->
    <q-header class="kamri-header" elevated>
      <HeaderBar @toggle-drawer="drawerOpen = !drawerOpen" @image-search="onImageSearch" />
    </q-header>

    <!-- Drawer (mobile only) -->
    <q-drawer
      v-if="$q.screen.lt.sm"
      v-model="drawerOpen"
      bordered
      breakpoint="600"
      class="kamri-drawer"
    >
      <div class="kamri-drawer-content">
        <div class="kamri-drawer-header">
          <div class="kamri-logo">
            <q-avatar size="40px" class="q-mr-sm">
              <img src="/images/logo.png" alt="KAMRI" />
            </q-avatar>
            <span class="text-h6 font-weight-bold text-primary">KAMRI</span>
          </div>
        </div>

        <q-list class="kamri-nav-list">
          <q-item
            v-for="link in navLinks"
            :key="link.name"
            clickable
            v-ripple
            class="kamri-nav-item"
            @click="navigate(link.path)"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <!-- Page container -->
    <q-page-container class="kamri-page-container">
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer class="kamri-footer" elevated>
      <FooterBar />
    </q-footer>

    <!-- Panier latéral -->
    <CartDrawer />
  </q-layout>
</template>

<script setup>
import FooterBar from 'components/FooterBar.vue'
import HeaderBar from 'components/HeaderBar.vue'
import CartDrawer from 'components/CartDrawer.vue'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const drawerOpen = ref(false)
const router = useRouter()

const navLinks = [
  { name: 'Accueil', path: '/', icon: 'home' },
  { name: 'Produits', path: '/products', icon: 'shopping_bag' },
  { name: 'Catégories', path: '/categories', icon: 'category' },
  { name: 'Mon compte', path: '/account', icon: 'person' },
  { name: 'Favoris', path: '/wishlist', icon: 'favorite' },
  { name: 'Panier', path: '/cart', icon: 'shopping_cart' },
]

function navigate(path) {
  drawerOpen.value = false
  router.push(path)
}

function onImageSearch() {
  console.log('Recherche visuelle à venir')
}
</script>

<style lang="scss" scoped>
.kamri-layout {
  background: var(--kamri-bg-secondary);
}

.kamri-header {
  background: var(--kamri-bg-primary) !important;
  color: var(--kamri-gray-800) !important;
  box-shadow: var(--kamri-shadow-sm) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--kamri-gray-200);
}

.kamri-drawer {
  background: var(--kamri-bg-primary);
  color: var(--kamri-gray-800);
}

.kamri-drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.kamri-drawer-header {
  padding: var(--kamri-space-lg);
  border-bottom: 1px solid var(--kamri-gray-200);
  background: var(--kamri-gradient-primary);
  color: white;
}

.kamri-logo {
  display: flex;
  align-items: center;
  color: white;
}

.kamri-nav-list {
  flex: 1;
  padding: var(--kamri-space-md) 0;
}

.kamri-nav-item {
  margin: var(--kamri-space-xs) var(--kamri-space-md);
  border-radius: var(--kamri-radius);
  transition: var(--kamri-transition);
  color: var(--kamri-gray-800);

  &:hover {
    background: var(--kamri-gray-100);
    color: var(--kamri-primary);
  }

  &.q-router-link--active {
    background: var(--kamri-primary);
    color: white;

    .q-icon {
      color: white;
    }
  }
}

.kamri-page-container {
  background: var(--kamri-bg-secondary);
  min-height: calc(100vh - 64px);
}

.kamri-footer {
  background: var(--kamri-gray-800) !important;
  color: white !important;
  border-top: 1px solid var(--kamri-gray-700);
}
</style>
