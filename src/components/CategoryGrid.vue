<template>
  <div class="row justify-around q-gutter-lg gt-sm">
    <CategoryCard
      v-for="cat in categories"
      :key="cat.id"
      :category="cat"
    />
  </div>
</template>

<script setup>
import CategoryCard from './CategoryCard.vue';
defineProps({ categories: Array })
</script>
