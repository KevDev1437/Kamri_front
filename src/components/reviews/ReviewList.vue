<template>
  <div class="review-list">
    <!-- Toolbar -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6">
            Avis clients
            <span class="text-caption text-grey-7 q-ml-sm">({{ total }})</span>
          </div>

          <div class="row items-center q-gutter-md">
            <!-- Filtres actifs -->
            <div v-if="hasActiveFilters" class="row q-gutter-xs">
              <q-chip
                v-for="filter in activeFilters"
                :key="filter.key"
                removable
                color="primary"
                text-color="white"
                @remove="removeFilter(filter.key)"
                :aria-label="`Supprimer le filtre ${filter.label}`"
              >
                {{ filter.label }}
              </q-chip>
            </div>

            <!-- Tri -->
            <q-select
              :model-value="sort"
              :options="sortOptions"
              label="Trier par"
              outlined
              dense
              emit-value
              map-options
              @update:model-value="$emit('update:sort', $event)"
              aria-label="Trier les avis"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Erreur -->
    <q-banner v-if="error" class="bg-negative text-white q-mb-md" rounded>
      <template #avatar>
        <q-icon name="error" />
      </template>
      {{ error }}
      <template #action>
        <q-btn flat color="white" label="Réessayer" @click="$emit('retry')" />
      </template>
    </q-banner>

    <!-- Loading Skeleton -->
    <template v-if="loading && items.length === 0">
      <div v-for="n in 6" :key="'sk-' + n" class="q-mb-md">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-start q-gutter-md">
              <q-skeleton type="circle" size="48px" />
              <div class="col">
                <q-skeleton type="text" width="60%" class="q-mb-sm" />
                <q-skeleton type="text" width="40%" class="q-mb-sm" />
                <q-skeleton type="text" width="80%" class="q-mb-sm" />
                <q-skeleton type="text" width="60%" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>

    <!-- Liste des avis -->
    <template v-else-if="items.length > 0">
      <ReviewItem
        v-for="review in items"
        :key="review.id"
        :review="review"
        @helpful="$emit('helpful', $event)"
        @report="$emit('report', $event)"
      />

      <!-- Bouton "Voir plus" -->
      <div v-if="hasMore" class="text-center q-mt-xl">
        <q-btn
          color="primary"
          outline
          size="lg"
          label="Voir plus d'avis"
          :loading="loading"
          @click="$emit('load-more')"
          icon="expand_more"
        />
      </div>
    </template>

    <!-- Empty state -->
    <div v-else class="empty-state text-center q-py-xl">
      <q-icon name="rate_review" size="64px" color="grey-5" />
      <div class="text-h6 q-mt-md text-grey-7">
        {{
          hasActiveFilters
            ? 'Aucun avis ne correspond à vos critères'
            : 'Aucun avis pour ce produit'
        }}
      </div>
      <div class="text-body2 text-grey-6 q-mt-sm">
        {{
          hasActiveFilters
            ? 'Essayez de modifier vos filtres'
            : 'Soyez le premier à laisser un avis !'
        }}
      </div>
      <q-btn
        v-if="hasActiveFilters"
        color="primary"
        label="Réinitialiser les filtres"
        @click="$emit('reset-filters')"
        class="q-mt-md"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ReviewItem from './ReviewItem.vue'

const props = defineProps({
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  sort: { type: String, required: true },
  rating: Number,
  withPhotos: Boolean,
})

const emit = defineEmits([
  'load-more',
  'update:sort',
  'update:rating',
  'update:withPhotos',
  'remove-filter',
  'reset-filters',
  'retry',
])

// Options de tri
const sortOptions = [
  { label: 'Plus récents', value: 'recent' },
  { label: 'Plus utiles', value: 'top' },
  { label: 'Note décroissante', value: 'rating_desc' },
  { label: 'Note croissante', value: 'rating_asc' },
]

// Computed
const hasMore = computed(() => {
  return props.total > props.items.length
})

const hasActiveFilters = computed(() => {
  return props.rating !== null || props.withPhotos !== false
})

const activeFilters = computed(() => {
  const filters = []
  if (props.rating !== null) {
    filters.push({
      key: 'rating',
      label: `≥${props.rating}★`,
      value: props.rating,
    })
  }
  if (props.withPhotos) {
    filters.push({
      key: 'withPhotos',
      label: 'Avec photos',
      value: props.withPhotos,
    })
  }
  return filters
})

// Méthodes
const removeFilter = (key) => {
  emit('remove-filter', key)
}
</script>

<style scoped>
.review-list {
  max-width: 100%;
}

.empty-state {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
