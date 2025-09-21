<!-- src/pages/RegisterPage.vue -->
<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="container">
      <div class="row justify-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <q-card class="q-pa-lg shadow-2">
            <q-card-section class="text-center">
              <div class="text-h4 text-primary q-mb-md">Inscription</div>
              <div class="text-body2 text-grey-7">Créez votre compte KAMRI</div>
            </q-card-section>

            <q-card-section>
              <q-form @submit="onSubmit" class="q-gutter-md">
                <q-input
                  v-model="form.name"
                  label="Nom complet"
                  outlined
                  :rules="[(val) => !!val || 'Le nom est requis']"
                  :error="!!errors.name"
                  :error-message="Array.isArray(errors.name) ? errors.name[0] : errors.name"
                />

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
                />

                <q-input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Mot de passe"
                  outlined
                  :rules="[
                    (val) => !!val || 'Le mot de passe est requis',
                    (val) => val.length >= 6 || 'Minimum 6 caractères',
                  ]"
                  :error="!!errors.password"
                  :error-message="
                    Array.isArray(errors.password) ? errors.password[0] : errors.password
                  "
                >
                  <template #append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>

                <q-input
                  v-model="form.password_confirmation"
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  label="Confirmer le mot de passe"
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
                >
                  <template #append>
                    <q-icon
                      :name="showPasswordConfirmation ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPasswordConfirmation = !showPasswordConfirmation"
                    />
                  </template>
                </q-input>

                <div class="q-mt-lg">
                  <q-checkbox
                    v-model="form.acceptTerms"
                    :rules="[(val) => !!val || 'Vous devez accepter les conditions']"
                  >
                    <span class="text-body2">
                      J'accepte les
                      <a href="#" class="text-primary">conditions d'utilisation</a>
                      et la
                      <a href="#" class="text-primary">politique de confidentialité</a>
                    </span>
                  </q-checkbox>
                </div>

                <q-btn
                  type="submit"
                  color="primary"
                  size="lg"
                  class="full-width"
                  :loading="loading"
                  label="Créer mon compte"
                />

                <div class="text-center">
                  <div class="text-body2 text-grey-7 q-mb-sm">Déjà un compte ?</div>
                  <q-btn flat color="primary" label="Se connecter" to="/login" no-caps />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { Notify } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const errors = ref({})

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  acceptTerms: false,
})

// Methods
const onSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    const result = await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    })

    if (result.success) {
      Notify.create({
        type: 'positive',
        message: result.message,
        position: 'top',
      })
      // Rediriger vers l'accueil
      router.push('/')
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
    console.error("Erreur d'inscription:", error)
    Notify.create({
      type: 'negative',
      message: "Une erreur est survenue lors de l'inscription",
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Si l'utilisateur est déjà connecté, rediriger
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
</style>
