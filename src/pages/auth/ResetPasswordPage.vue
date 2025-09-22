<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="reset-password-container">
      <q-card class="reset-password-card shadow-2">
        <q-card-section class="text-center">
          <div class="text-h4 text-primary q-mb-md">Réinitialiser le mot de passe</div>
          <div class="text-body2 text-grey-7">
            Entrez votre nouveau mot de passe pour finaliser la réinitialisation.
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.email"
              type="email"
              label="Email"
              outlined
              readonly
              :rules="[(val) => !!val || 'L\'email est requis']"
              aria-label="Adresse email"
            />

            <q-input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              label="Nouveau mot de passe"
              outlined
              :rules="[
                (val) => !!val || 'Le mot de passe est requis',
                (val) => val.length >= 6 || 'Minimum 6 caractères',
              ]"
              :error="!!errors.password"
              :error-message="Array.isArray(errors.password) ? errors.password[0] : errors.password"
              aria-label="Nouveau mot de passe"
            >
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                  aria-label="Afficher/masquer le mot de passe"
                />
              </template>
            </q-input>

            <q-input
              v-model="form.password_confirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              label="Confirmer le nouveau mot de passe"
              outlined
              :rules="[
                (val) => !!val || 'La confirmation est requise',
                (val) => val === form.password || 'Les mots de passe ne correspondent pas',
              ]"
              :error="!!errors.password_confirmation"
              :error-message="
                Array.isArray(errors.password_confirmation)
                  ? errors.password_confirmation[0]
                  : errors.password_confirmation
              "
              aria-label="Confirmer le nouveau mot de passe"
            >
              <template #append>
                <q-icon
                  :name="showPasswordConfirmation ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                  aria-label="Afficher/masquer la confirmation du mot de passe"
                />
              </template>
            </q-input>

            <q-btn
              type="submit"
              color="primary"
              size="lg"
              class="full-width"
              :loading="loading"
              label="Réinitialiser le mot de passe"
              aria-label="Réinitialiser le mot de passe"
            />

            <div class="text-center q-mt-md">
              <q-btn flat color="primary" label="Retour à la connexion" to="/login" no-caps />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { Notify } from 'quasar'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const loading = ref(false)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const errors = ref({})

const form = ref({
  email: '',
  password: '',
  password_confirmation: '',
})

// Methods
const onSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    const result = await authStore.resetPassword({
      token: route.query.token,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    })

    if (result.success) {
      Notify.create({
        type: 'positive',
        message: result.message || 'Mot de passe réinitialisé avec succès',
        position: 'top',
      })
      // Rediriger vers la page de connexion
      router.push('/login')
    } else {
      if (result.errors) {
        errors.value = result.errors
      } else {
        Notify.create({
          type: 'negative',
          message: result.message,
          position: 'top',
        })
      }
    }
  } catch (error) {
    console.error('Erreur de réinitialisation:', error)
    Notify.create({
      type: 'negative',
      message: 'Une erreur est survenue lors de la réinitialisation',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Récupérer l'email depuis les query params
  if (route.query.email) {
    form.value.email = route.query.email
  }

  // Vérifier que le token est présent
  if (!route.query.token) {
    Notify.create({
      type: 'negative',
      message: 'Token de réinitialisation manquant',
      position: 'top',
    })
    router.push('/forgot-password')
  }
})
</script>

<style scoped>
.reset-password-container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

.reset-password-card {
  width: 100%;
}
</style>
