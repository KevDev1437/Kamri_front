<!-- src/pages/account/ProfilePage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="container">
      <div class="row">
        <!-- Sidebar navigation -->
        <div class="col-12 col-md-3 q-mb-md">
          <q-list>
            <q-item clickable v-ripple to="/account/profile" active-class="bg-primary text-white">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>Mon profil</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/account/orders">
              <q-item-section avatar>
                <q-icon name="shopping_bag" />
              </q-item-section>
              <q-item-section>Mes commandes</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/account/wishlist">
              <q-item-section avatar>
                <q-icon name="favorite" />
              </q-item-section>
              <q-item-section>Ma liste d'envies</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Main content -->
        <div class="col-12 col-md-9">
          <h2 class="text-h5 q-mb-lg">Mon profil</h2>

          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Informations personnelles</div>

              <q-form @submit="updateProfile" class="q-gutter-md">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="profile.firstName"
                      label="Prénom"
                      outlined
                      :rules="[(val) => !!val || 'Le prénom est requis']"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="profile.lastName"
                      label="Nom"
                      outlined
                      :rules="[(val) => !!val || 'Le nom est requis']"
                    />
                  </div>
                </div>

                <q-input
                  v-model="profile.email"
                  label="Email"
                  type="email"
                  outlined
                  :rules="[(val) => !!val || 'L\'email est requis']"
                />

                <q-input v-model="profile.phone" label="Téléphone" outlined />

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-8">
                    <q-input v-model="profile.address" label="Adresse" outlined />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input v-model="profile.postalCode" label="Code postal" outlined />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-8">
                    <q-input v-model="profile.city" label="Ville" outlined />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-select
                      v-model="profile.country"
                      :options="countries"
                      label="Pays"
                      outlined
                    />
                  </div>
                </div>

                <div class="q-mt-lg">
                  <q-btn type="submit" color="primary" label="Mettre à jour" :loading="loading" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>

          <!-- Change password section -->
          <q-card class="q-mt-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Changer le mot de passe</div>

              <q-form @submit="changePassword" class="q-gutter-md">
                <q-input
                  v-model="passwordForm.currentPassword"
                  label="Mot de passe actuel"
                  type="password"
                  outlined
                  :rules="[(val) => !!val || 'Le mot de passe actuel est requis']"
                />

                <q-input
                  v-model="passwordForm.newPassword"
                  label="Nouveau mot de passe"
                  type="password"
                  outlined
                  :rules="[
                    (val) =>
                      val.length >= 6 || 'Le mot de passe doit contenir au moins 6 caractères',
                  ]"
                />

                <q-input
                  v-model="passwordForm.confirmPassword"
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  outlined
                  :rules="[
                    (val) =>
                      val === passwordForm.newPassword || 'Les mots de passe ne correspondent pas',
                  ]"
                />

                <div class="q-mt-lg">
                  <q-btn
                    type="submit"
                    color="primary"
                    label="Changer le mot de passe"
                    :loading="passwordLoading"
                  />
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
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'

const $q = useQuasar()
const authStore = useAuthStore()

// State
const loading = ref(false)
const passwordLoading = ref(false)

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
  country: 'France',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const countries = ['France', 'Belgique', 'Suisse', 'Canada', 'Allemagne', 'Espagne', 'Italie']

// Methods
const updateProfile = async () => {
  loading.value = true

  try {
    const result = await authStore.updateProfile({
      name: profile.value.firstName + ' ' + profile.value.lastName,
      email: profile.value.email,
      phone: profile.value.phone,
      address: profile.value.address,
      postal_code: profile.value.postalCode,
      city: profile.value.city,
      country: profile.value.country,
    })

    if (result.success) {
      $q.notify({
        type: 'positive',
        message: result.message,
        position: 'top',
      })
    } else {
      $q.notify({
        type: 'negative',
        message: result.message,
        position: 'top',
      })
    }
  } catch (err) {
    console.error('Error updating profile:', err)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la mise à jour',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  passwordLoading.value = true

  try {
    const result = await authStore.changePassword({
      current_password: passwordForm.value.currentPassword,
      new_password: passwordForm.value.newPassword,
      new_password_confirmation: passwordForm.value.confirmPassword,
    })

    if (result.success) {
      $q.notify({
        type: 'positive',
        message: result.message,
        position: 'top',
      })

      // Reset form
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    } else {
      $q.notify({
        type: 'negative',
        message: result.message,
        position: 'top',
      })
    }
  } catch (err) {
    console.error('Error changing password:', err)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du changement de mot de passe',
      position: 'top',
    })
  } finally {
    passwordLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Charger les données du profil depuis l'utilisateur connecté
  if (authStore.user) {
    const nameParts = authStore.user.name?.split(' ') || ['', '']
    profile.value = {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || '',
      address: authStore.user.address || '',
      postalCode: authStore.user.postal_code || '',
      city: authStore.user.city || '',
      country: authStore.user.country || 'France',
    }
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
