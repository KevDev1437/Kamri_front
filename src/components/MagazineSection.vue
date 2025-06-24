// src/components/MagazineSection.vue
<template>
  <div class="magazine-section q-pa-md">
    <div class="section-header q-mb-md">
      <h2 class="text-h5 q-mb-none">Magazine / Blog</h2>
      <q-btn
        flat
        color="primary"
        label="Voir tout"
        @click="$emit('see-all')"
      />
    </div>

    <!-- État de chargement -->
    <template v-if="loading">
      <div class="row no-wrap overflow-auto">
        <div
          v-for="n in 4"
          :key="n"
          class="col-12 col-sm-6 col-md-3 q-px-sm"
        >
          <q-card flat bordered class="magazine-skeleton">
            <q-skeleton height="200px" square />
            <q-card-section>
              <q-skeleton type="text" class="text-h6" />
              <q-skeleton type="text" width="50%" class="text-caption" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>

    <!-- État d'erreur -->
    <div v-else-if="error" class="text-center q-pa-md">
      <div class="text-negative q-mb-md">{{ error }}</div>
      <q-btn
        label="Réessayer"
        color="primary"
        @click="$emit('retry')"
      />
    </div>

    <!-- État vide -->
    <div v-else-if="!articles?.length" class="text-center q-pa-md">
      <div class="text-grey-8">
        Aucun article disponible pour le moment
      </div>
    </div>

    <!-- Articles -->
    <div v-else class="row no-wrap overflow-auto">
      <div
        v-for="article in articles"
        :key="article.id"
        class="col-12 col-sm-6 col-md-3 q-px-sm"
      >
        <MagazineCard
          :article="article"
          @click="$emit('select', article)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import MagazineCard from './MagazineCard.vue';

defineProps({
  articles: {
    type: Array,
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

defineEmits(['select', 'retry', 'see-all'])
</script>

<style scoped>
.magazine-section {
  background: #fff;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.magazine-skeleton {
  height: 100%;
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
