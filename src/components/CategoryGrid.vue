<template>
  <div class="category-grid q-px-sm">
    <!-- Loading state -->
    <div v-if="loading" class="row q-col-gutter-md justify-center">
      <div
        v-for="n in 12"
        :key="n"
        class="col-4 col-sm-3 col-md-2"
      >
        <q-skeleton
          type="rect"
          class="skeleton-card"
        />
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center q-pa-md">
      <div class="text-negative q-mb-md">{{ error }}</div>
      <q-btn
        label="Réessayer"
        color="primary"
        @click="$emit('retry')"
      />
    </div>

    <!-- Empty state -->
    <div v-else-if="!categories?.length" class="text-center q-pa-md">
      <div class="text-grey-8 q-mb-md">Aucune catégorie disponible</div>
    </div>

    <!-- Categories grid -->
    <div v-else class="row q-col-gutter-md justify-center">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="col-4 col-sm-3 col-md-2"
      >
        <CategoryCard
          :category="cat"
          @click="$emit('select', cat)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import CategoryCard from './CategoryCard.vue';

defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['select', 'retry'])
</script>

<style scoped>
.category-grid {
  max-width: 100%;
}

.skeleton-card {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
}

/* Animation de chargement plus douce */
:deep(.q-skeleton) {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
