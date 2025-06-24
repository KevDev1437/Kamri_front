<!-- src/components/HeaderBar.vue -->
<template>
  <q-toolbar class="bg-white text-primary q-px-lg" style="display: flex; align-items: center; gap: 16px;">
    <!-- Drawer Toggle for Mobile Only -->
    <q-btn
      v-if="$q.screen.lt.sm"
      flat
      round
      dense
      icon="menu"
      @click="$emit('toggle-drawer')"
      class="q-mr-md"
    />

    <!-- Logo -->
    <router-link to="/" class="text-primary no-underline" style="flex-shrink:0;">
      <div class="text-h6 font-bold">KAMRI Marketplace</div>
    </router-link>

    <!-- Barre de recherche qui occupe tout l'espace -->
    <div style="flex:1 1 0%; min-width:0; display:flex; align-items:center;">
      <SearchBar style="width:100%; min-width:0;" />
    </div>

    <!-- Action Icons sans marge à gauche -->
    <div class="header-icons">
      <q-btn flat round dense icon="camera_alt" @click="$emit('image-search')" />
      <q-btn flat round dense icon="person" to="/account" />
      <q-btn flat round dense icon="favorite" to="/favorites" />
      <q-btn flat round dense icon="shopping_cart" to="/cart" />
    </div>
  </q-toolbar>
</template>

<script setup>
import SearchBar from 'components/SearchBar.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar()
</script>

<style scoped>
a { text-decoration: none; }
.header-icons {
  display: flex;
  align-items: center;
}
.header-icons :deep(.q-btn:not(:first-child)) {
  margin-left: 8px;
}
</style>
