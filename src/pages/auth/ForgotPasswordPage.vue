<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="forgot-password-container">
      <q-card class="forgot-password-card shadow-2">
        <q-card-section class="text-center">
          <div class="text-h4 text-primary q-mb-md">Mot de passe oublié</div>
          <div class="text-body2 text-grey-7">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot
            de passe.
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.email"
              type="email"
              label="Email"
              outlined
              :rules="[
                (val) => !!val || 'L\'email est requis',
                (val) => /.+@.+\..+/.test(val) || 'Email invalide',
              ]"
              :error="!!errors.email"
              :error-message="Array.isArray(errors.email) ? errors.email[0] : errors.email"
              aria-label="Adresse email"
            />

            <q-btn
              type="submit"
              color="primary"
              size="lg"
              class="full-width"
              :loading="loading"
              label="Envoyer le lien de réinitialisation"
              aria-label="Envoyer le lien de réinitialisation"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { Notify } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const errors = ref({})

const form = ref({
  email: '',
})

// Methods
const onSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    const result = await authStore.requestPasswordReset(form.value.email)

    if (result.success) {
      Notify.create({
        type: 'positive',
        message: result.message || 'Email de réinitialisation envoyé avec succès',
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
      message: "Une erreur est survenue lors de l'envoi de l'email",
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-password-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.forgot-password-card {
  width: 100%;
}
</style>
