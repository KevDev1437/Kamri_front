<template>
  <q-card flat bordered class="ratings-summary">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="star" class="q-mr-sm" />
        Avis clients
      </div>

      <!-- Moyenne et nombre total -->
      <div class="row items-center q-mb-lg">
        <div class="col-auto q-mr-lg">
          <div class="text-h2 text-weight-bold text-primary">{{ average.toFixed(1) }}</div>
          <q-rating
            :model-value="average"
            max="5"
            size="1.5em"
            color="orange"
            icon="star_border"
            icon-selected="star"
            readonly
            aria-label="Note moyenne"
          />
          <div class="text-body2 text-grey-7 q-mt-xs">{{ total }} avis</div>
        </div>

        <!-- Distribution des notes -->
        <div class="col">
          <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="row items-center q-mb-xs">
            <div class="col-auto q-mr-sm">
              <span class="text-body2">{{ star }}★</span>
            </div>
            <div class="col">
              <q-linear-progress
                :value="getStarPercentage(star)"
                color="orange"
                size="8px"
                rounded
                aria-label="Distribution des notes"
              />
            </div>
            <div class="col-auto q-ml-sm">
              <span class="text-body2 text-grey-7">{{ counts[star] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="q-gutter-md">
        <!-- Filtres par note -->
        <div>
          <div class="text-subtitle2 q-mb-sm">Filtrer par note</div>
          <div class="row q-gutter-xs">
            <q-chip
              v-for="star in [5, 4, 3, 2, 1]"
              :key="star"
              :color="rating === star ? 'primary' : 'grey-3'"
              :text-color="rating === star ? 'white' : 'grey-8'"
              :label="`${star}★`"
              clickable
              @click="updateRating(star)"
              :aria-label="`Filtrer par ${star} étoiles`"
            />
            <q-chip
              v-if="rating !== null"
              color="grey-5"
              text-color="white"
              label="Toutes"
              clickable
              @click="updateRating(null)"
              aria-label="Afficher toutes les notes"
            />
          </div>
        </div>

        <!-- Filtre avec photos -->
        <div>
          <q-toggle
            :model-value="withPhotos"
            @update:model-value="$emit('update:withPhotos', $event)"
            label="Avec photos seulement"
            color="primary"
            aria-label="Filtrer les avis avec photos"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  average: { type: Number, required: true },
  counts: { type: Object, required: true }, // {1..5}
  total: { type: Number, required: true },
  rating: Number,
  withPhotos: Boolean,
})

const emit = defineEmits(['update:rating', 'update:withPhotos'])

// Calculer le pourcentage pour chaque étoile
const getStarPercentage = (star) => {
  if (props.total === 0) return 0
  return (props.counts[star] || 0) / props.total
}

// Mettre à jour le filtre de note
const updateRating = (newRating) => {
  emit('update:rating', newRating)
}
</script>

<style scoped>
.ratings-summary {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
