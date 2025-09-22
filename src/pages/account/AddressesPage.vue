<template>
  <q-page class="q-pa-md">
    <div class="container">
      <div class="row">
        <!-- Sidebar navigation -->
        <div class="col-12 col-md-3 q-mb-md">
          <q-list>
            <q-item clickable v-ripple to="/account/profile">
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
            <q-item clickable v-ripple to="/account/addresses" active-class="bg-primary text-white">
              <q-item-section avatar>
                <q-icon name="location_on" />
              </q-item-section>
              <q-item-section>Mes adresses</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Main content -->
        <div class="col-12 col-md-9">
          <!-- Header -->
          <div class="row items-center justify-between q-mb-lg">
            <div>
              <h2 class="text-h5 q-mb-none">Mes adresses</h2>
              <div class="text-caption text-grey-7">
                {{ addressStore.count }} adresse{{ addressStore.count > 1 ? 's' : '' }}
              </div>
            </div>
            <q-btn
              v-if="!addressStore.hasReachedLimit"
              color="primary"
              label="Ajouter une adresse"
              icon="add"
              @click="openAddDialog"
            />
          </div>

          <!-- Empty state -->
          <div v-if="addressStore.count === 0" class="text-center q-py-xl">
            <q-icon name="location_off" size="64px" color="grey-5" />
            <div class="text-h6 q-mt-md text-grey-7">Aucune adresse enregistrée</div>
            <div class="text-body2 text-grey-6 q-mt-sm">
              Ajoutez votre première adresse pour faciliter vos commandes
            </div>
            <q-btn
              color="primary"
              label="Ajouter une adresse"
              icon="add"
              @click="openAddDialog"
              class="q-mt-md"
            />
          </div>

          <!-- Liste des adresses -->
          <div v-else>
            <AddressList
              :addresses="addressStore.items"
              :has-reached-limit="addressStore.hasReachedLimit"
              @add="openAddDialog"
              @edit="openEditDialog"
              @remove="confirmRemove"
              @set-default-shipping="setDefaultShipping"
              @set-default-billing="setDefaultBilling"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog pour ajouter/éditer une adresse -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 500px; max-width: 600px">
        <q-card-section>
          <div class="text-h6">
            {{ dialogMode === 'create' ? 'Ajouter une adresse' : "Modifier l'adresse" }}
          </div>
        </q-card-section>

        <q-card-section>
          <AddressForm
            :model-value="currentAddress"
            :mode="dialogMode"
            :loading="loading"
            @submit="handleSubmit"
            @cancel="closeDialog"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog de confirmation de suppression -->
    <q-dialog v-model="confirmDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmer la suppression</div>
        </q-card-section>

        <q-card-section>
          <div class="text-body2">
            Êtes-vous sûr de vouloir supprimer l'adresse "{{ addressToDelete?.label }}" ?
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" @click="confirmDialogOpen = false" />
          <q-btn color="negative" label="Supprimer" @click="handleRemove" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAddressStore } from 'stores/address'
import AddressList from 'components/address/AddressList.vue'
import AddressForm from 'components/address/AddressForm.vue'

const addressStore = useAddressStore()

// State
const dialogOpen = ref(false)
const confirmDialogOpen = ref(false)
const dialogMode = ref('create')
const currentAddress = ref({})
const addressToDelete = ref(null)
const loading = ref(false)

// Méthodes
const openAddDialog = () => {
  dialogMode.value = 'create'
  currentAddress.value = {}
  dialogOpen.value = true
}

const openEditDialog = (address) => {
  dialogMode.value = 'edit'
  currentAddress.value = { ...address }
  dialogOpen.value = true
}

const closeDialog = () => {
  dialogOpen.value = false
  currentAddress.value = {}
}

const handleSubmit = async (addressData) => {
  loading.value = true
  try {
    if (dialogMode.value === 'create') {
      addressStore.add(addressData)
    } else {
      addressStore.update(currentAddress.value.id, addressData)
    }
    closeDialog()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    loading.value = false
  }
}

const confirmRemove = (address) => {
  addressToDelete.value = address
  confirmDialogOpen.value = true
}

const handleRemove = async () => {
  if (!addressToDelete.value) return

  loading.value = true
  try {
    addressStore.remove(addressToDelete.value.id)
    confirmDialogOpen.value = false
    addressToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    loading.value = false
  }
}

const setDefaultShipping = (address) => {
  addressStore.setDefaultShipping(address.id)
}

const setDefaultBilling = (address) => {
  addressStore.setDefaultBilling(address.id)
}

// Lifecycle
onMounted(() => {
  addressStore.restore()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
