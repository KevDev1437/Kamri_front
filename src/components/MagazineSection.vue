// src/components/MagazineSection.vue
<template>
  <div class="magazine-section q-pa-md">
    <h2 class="text-h5 q-mb-md">Magazine / Blog</h2>
    <div class="row no-wrap overflow-auto">
      <MagazineCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import MagazineCard from './MagazineCard.vue';

defineProps({
  articles: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.magazine-section {
  background: #fff;
  border-radius: 8px;
}
</style>
