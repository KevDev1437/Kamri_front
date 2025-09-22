<template>
  <q-card flat bordered class="review-form q-mb-lg">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="edit" class="q-mr-sm" />
        Laisser un avis
      </div>

      <!-- Banner si pas autorisé à poster -->
      <q-banner v-if="!canPost" class="bg-info text-white q-mb-md" rounded>
        <template #avatar>
          <q-icon name="info" />
        </template>
        <div class="text-body2">Seuls les acheteurs peuvent laisser un avis sur ce produit.</div>
      </q-banner>

      <!-- Formulaire -->
      <q-form v-else @submit.prevent="onSubmit" class="q-gutter-md">
        <!-- Note -->
        <div>
          <div class="text-subtitle2 q-mb-sm">Votre note *</div>
          <q-rating
            v-model="form.rating"
            max="5"
            size="2em"
            color="orange"
            icon="star_border"
            icon-selected="star"
            :rules="[(val) => !!val || 'Veuillez sélectionner une note']"
            aria-label="Sélectionner votre note"
          />
        </div>

        <!-- Commentaire -->
        <div>
          <q-input
            v-model="form.comment"
            type="textarea"
            label="Votre avis *"
            outlined
            rows="4"
            :rules="[
              (val) => !!val || 'Veuillez écrire un commentaire',
              (val) => (val && val.length >= 20) || 'Minimum 20 caractères',
            ]"
            placeholder="Partagez votre expérience avec ce produit..."
            aria-label="Votre avis sur le produit"
          />
          <div class="text-caption text-grey-6 q-mt-xs">
            {{ form.comment.length }}/500 caractères
          </div>
        </div>

        <!-- Photos -->
        <div>
          <div class="text-subtitle2 q-mb-sm">Photos (optionnel)</div>
          <q-file
            v-model="form.photos"
            multiple
            accept="image/*"
            label="Ajouter des photos"
            outlined
            @update:model-value="onPhotosChange"
            aria-label="Ajouter des photos à votre avis"
          >
            <template #prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <!-- Aperçu des photos -->
          <div v-if="photoPreviews.length > 0" class="q-mt-md">
            <div class="text-caption q-mb-sm">Aperçu des photos :</div>
            <div class="row q-gutter-sm">
              <div v-for="(preview, index) in photoPreviews" :key="index" class="relative-position">
                <q-img
                  :src="preview"
                  width="80px"
                  height="80px"
                  class="rounded-borders"
                  :alt="`Aperçu photo ${index + 1}`"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  color="white"
                  class="absolute-top-right"
                  size="sm"
                  @click="removePhoto(index)"
                  :aria-label="`Supprimer la photo ${index + 1}`"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Options -->
        <div>
          <q-checkbox
            v-model="form.anonymous"
            label="Publier de manière anonyme"
            color="primary"
            aria-label="Publier de manière anonyme"
          />
        </div>

        <!-- Actions -->
        <div class="row justify-end q-gutter-sm">
          <q-btn flat label="Annuler" @click="resetForm" :disable="loading" />
          <q-btn
            type="submit"
            color="primary"
            label="Publier l'avis"
            :loading="loading"
            :disable="!isFormValid"
            icon="send"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Notify } from 'quasar'

defineProps({
  canPost: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

// State
const form = ref({
  rating: null,
  comment: '',
  photos: [],
  anonymous: false,
})

const photoPreviews = ref([])

// Computed
const isFormValid = computed(() => {
  return (
    form.value.rating &&
    form.value.comment &&
    form.value.comment.length >= 20 &&
    form.value.comment.length <= 500
  )
})

// Méthodes
const onPhotosChange = (files) => {
  if (!files || files.length === 0) {
    photoPreviews.value = []
    return
  }

  // Limiter à 5 photos maximum
  if (files.length > 5) {
    Notify.create({
      type: 'warning',
      message: 'Maximum 5 photos autorisées',
      position: 'top',
    })
    form.value.photos = files.slice(0, 5)
  }

  // Créer les aperçus
  photoPreviews.value = []
  Array.from(form.value.photos).forEach((file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        photoPreviews.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  })
}

const removePhoto = (index) => {
  // Supprimer de la liste des fichiers
  const newFiles = Array.from(form.value.photos)
  newFiles.splice(index, 1)
  form.value.photos = newFiles

  // Supprimer de l'aperçu
  photoPreviews.value.splice(index, 1)
}

const resetForm = () => {
  form.value = {
    rating: null,
    comment: '',
    photos: [],
    anonymous: false,
  }
  photoPreviews.value = []
}

const onSubmit = () => {
  if (!isFormValid.value) return

  const reviewData = {
    rating: form.value.rating,
    comment: form.value.comment.trim(),
    photos: form.value.photos,
    anonymous: form.value.anonymous,
  }

  emit('submit', reviewData)
}

// Watcher pour limiter la longueur du commentaire
watch(
  () => form.value.comment,
  (newValue) => {
    if (newValue && newValue.length > 500) {
      form.value.comment = newValue.slice(0, 500)
      Notify.create({
        type: 'warning',
        message: 'Commentaire limité à 500 caractères',
        position: 'top',
      })
    }
  },
)
</script>

<style scoped>
.review-form {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.relative-position {
  position: relative;
}

.absolute-top-right {
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
