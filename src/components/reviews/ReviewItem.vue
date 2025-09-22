<template>
  <q-card flat bordered class="review-item q-mb-md">
    <q-card-section>
      <div class="row items-start q-gutter-md">
        <!-- Avatar -->
        <div class="col-auto">
          <q-avatar
            :color="review.anonymous ? 'grey-5' : 'primary'"
            text-color="white"
            size="48px"
            :aria-label="review.anonymous ? 'Utilisateur anonyme' : `Avatar de ${review.user.name}`"
          >
            {{ review.anonymous ? '?' : getInitials(review.user.name) }}
          </q-avatar>
        </div>

        <!-- Contenu principal -->
        <div class="col">
          <!-- En-tête -->
          <div class="row items-center justify-between q-mb-sm">
            <div>
              <div class="text-body1 text-weight-medium">
                {{ review.anonymous ? 'Avis anonyme' : review.user.name }}
              </div>
              <div class="row items-center q-gutter-sm">
                <q-rating
                  :model-value="review.rating"
                  max="5"
                  size="1em"
                  color="orange"
                  icon="star_border"
                  icon-selected="star"
                  readonly
                  :aria-label="`Note: ${review.rating} sur 5`"
                />
                <span class="text-caption text-grey-6">
                  {{ formatDate(review.createdAt) }}
                </span>
                <q-chip
                  v-if="review.verified"
                  color="positive"
                  text-color="white"
                  size="sm"
                  icon="verified"
                  label="Achat vérifié"
                  aria-label="Achat vérifié"
                />
              </div>
            </div>
          </div>

          <!-- Commentaire -->
          <div class="text-body2 q-mb-md" v-if="review.comment">
            {{ review.comment }}
          </div>

          <!-- Photos -->
          <div v-if="review.photos && review.photos.length > 0" class="q-mb-md">
            <div class="row q-gutter-sm">
              <q-img
                v-for="(photo, index) in review.photos"
                :key="index"
                :src="photo"
                :alt="`Photo ${index + 1} de l'avis`"
                width="80px"
                height="80px"
                class="rounded-borders cursor-pointer"
                @click="showPhotoDialog(photo, index)"
                aria-label="Voir la photo en grand"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="row items-center justify-between">
            <div class="row items-center q-gutter-sm">
              <q-btn
                flat
                dense
                :color="hasVotedHelpful ? 'primary' : 'grey-7'"
                :icon="hasVotedHelpful ? 'thumb_up' : 'thumb_up_off_alt'"
                :label="`Utile (${review.helpfulCount})`"
                size="sm"
                @click="handleHelpful"
                :disable="hasVotedHelpful"
                :aria-label="hasVotedHelpful ? 'Déjà marqué comme utile' : 'Marquer comme utile'"
              />
            </div>

            <q-btn
              flat
              dense
              color="grey-7"
              icon="flag"
              label="Signaler"
              size="sm"
              @click="handleReport"
              :disable="hasReported"
              :aria-label="hasReported ? 'Déjà signalé' : 'Signaler cet avis'"
            />
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Dialog pour afficher les photos -->
    <q-dialog v-model="photoDialog" maximized>
      <q-card>
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Photos de l'avis</div>
          <q-btn flat round dense icon="close" @click="photoDialog = false" aria-label="Fermer" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-carousel
            v-model="currentPhotoIndex"
            :fullscreen="false"
            :swipeable="true"
            :navigation="true"
            :pagination="true"
            height="400px"
            class="rounded-borders"
          >
            <q-carousel-slide
              v-for="(photo, index) in review.photos"
              :key="index"
              :name="index"
              class="column no-wrap flex-center"
            >
              <q-img
                :src="photo"
                :alt="`Photo ${index + 1} de l'avis`"
                fit="contain"
                style="max-width: 100%; max-height: 100%"
              />
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useReviewsStore } from 'stores/reviews'
import { Notify } from 'quasar'

const props = defineProps({
  review: {
    type: Object,
    required: true,
    // { id, user:{name}, rating, comment, createdAt, verified, photos:[], helpfulCount, reported }
  },
})

const emit = defineEmits(['helpful', 'report'])

const reviewsStore = useReviewsStore()

// State
const photoDialog = ref(false)
const currentPhotoIndex = ref(0)

// Computed
const hasVotedHelpful = computed(() => {
  return reviewsStore.hasVotedHelpful(props.review.id)
})

const hasReported = computed(() => {
  return reviewsStore.hasReported(props.review.id)
})

// Méthodes
const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const showPhotoDialog = (photo, index) => {
  currentPhotoIndex.value = index
  photoDialog.value = true
}

const handleHelpful = async () => {
  if (hasVotedHelpful.value) return

  try {
    const result = await reviewsStore.voteHelpful(props.review.id)
    if (result.success) {
      reviewsStore.markVotedHelpful(props.review.id)
      emit('helpful', props.review.id)
    } else {
      Notify.create({
        type: 'negative',
        message: result.message || 'Erreur lors du vote',
        position: 'top',
      })
    }
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Erreur lors du vote',
      position: 'top',
    })
  }
}

const handleReport = async () => {
  if (hasReported.value) return

  try {
    const result = await reviewsStore.report(props.review.id)
    if (result.success) {
      reviewsStore.markReported(props.review.id)
      emit('report', props.review.id)
    }
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Erreur lors du signalement',
      position: 'top',
    })
  }
}
</script>

<style scoped>
.review-item {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
