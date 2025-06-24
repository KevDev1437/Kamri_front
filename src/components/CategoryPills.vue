<!-- src/components/CategoryPills.vue -->
<template>
  <div class="pill-row no-wrap row items-center">
    <q-btn
      v-for="cat in categories"
      :key="cat.id"
      unelevated
      round
      class="pill q-mr-sm"
      :label="cat.name"
      @click="$emit('select', cat)"
    />
  </div>
</template>

<script setup>
defineProps({ categories: Array })
</script>

<style scoped>
.pill-row {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
}
.pill {
  scroll-snap-align: start;
  font-weight: 500;
  border: 1px solid #d9d9d9;
  background: white;
}
</style>
