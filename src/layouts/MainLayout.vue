<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout>
    <!-- Header -->
    <q-header elevated position="relative">
      <HeaderBar
        @toggle-drawer="drawerOpen = !drawerOpen"
        @image-search="onImageSearch"
      />
    </q-header>

    <!-- Drawer (mobile only) -->
    <q-drawer
      v-if="$q.screen.lt.sm"
      v-model="drawerOpen"
      bordered
      breakpoint="600"
    >
      <q-list>
        <q-item
          clickable
          v-for="link in navLinks"
          :key="link.name"
          @click="navigate(link.path)"
        >
          <q-item-section>{{ link.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page container -->
    <q-page-container>
      <router-view />
    </q-page-container>    <!-- Footer -->
    <q-footer elevated>
      <FooterBar />
    </q-footer>
  </q-layout>
</template>

<script setup>
import FooterBar from 'components/FooterBar.vue'
import HeaderBar from 'components/HeaderBar.vue'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const drawerOpen = ref(false)
const router = useRouter()

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'Produits', path: '/products' },
  { name: 'Mon compte', path: '/account' }
]

function navigate(path) {
  drawerOpen.value = false
  router.push(path)
}

function onImageSearch() {
  console.log('Recherche visuelle à venir')
}
</script>

<style scoped>
/* Aucun style fixe : header et footer défilent avec le contenu */
</style>
