<!-- src/pages/LoginPage.vue -->
<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="container">
      <div class="row justify-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <q-card class="q-pa-lg shadow-2">
            <q-card-section class="text-center">
              <div class="text-h4 text-primary q-mb-md">Connexion</div>
              <div class="text-body2 text-grey-7">Connectez-vous à votre compte KAMRI</div>
            </q-card-section>

            <q-card-section>
              <q-form @submit="onSubmit" class="q-gutter-md">
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
                  :rules="[(val) => !!val || 'Le mot de passe est requis']"
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

                <div class="row items-center justify-between">
                  <q-checkbox v-model="form.remember" label="Se souvenir de moi" />
                  <q-btn flat color="primary" label="Mot de passe oublié ?" no-caps />
                </div>

                <q-btn
                  type="submit"
                  color="primary"
                  size="lg"
                  class="full-width"
                  :loading="loading"
                  label="Se connecter"
                />

                <div class="text-center">
                  <div class="text-body2 text-grey-7 q-mb-sm">Pas encore de compte ?</div>
                  <q-btn flat color="primary" label="Créer un compte" to="/register" no-caps />
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
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { Notify } from 'quasar'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const loading = ref(false)
const showPassword = ref(false)
const errors = ref({})

const form = ref({
  email: '',
  password: '',
  remember: false,
})

// Methods
const onSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    const result = await authStore.login({
      email: form.value.email,
      password: form.value.password,
    })

    if (result.success) {
      Notify.create({
        type: 'positive',
        message: result.message,
        position: 'top',
      })
      // Rediriger vers la page demandée ou l'accueil
      const redirectTo = route.query.redirect || '/'
      router.push(redirectTo)
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
    console.error('Erreur de connexion:', error)
    Notify.create({
      type: 'negative',
      message: 'Une erreur est survenue lors de la connexion',
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
