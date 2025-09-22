<template>
  <q-card class="product-card-skeleton">
    <q-skeleton type="rect" height="200px" />
    <q-card-section>
      <q-skeleton type="text" width="80%" />
      <q-skeleton type="text" width="60%" />
      <q-skeleton type="text" width="40%" />
    </q-card-section>
  </q-card>
</template>

<script setup>
// Composant simple pour les squelettes de chargement
</script>

<style scoped>
.product-card-skeleton {
  height: 100%;
  border-radius: 8px;
}
</style>
