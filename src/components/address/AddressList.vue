<template>
  <div class="address-list">
    <!-- Grille des adresses -->
    <div class="row q-col-gutter-md">
      <div v-for="address in addresses" :key="address.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <AddressCard
          :address="address"
          @edit="$emit('edit', $event)"
          @remove="$emit('remove', $event)"
          @set-default-shipping="$emit('setDefaultShipping', $event)"
          @set-default-billing="$emit('setDefaultBilling', $event)"
        />
      </div>
    </div>

    <!-- Bouton ajouter une adresse -->
    <div v-if="!hasReachedLimit" class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card
          flat
          bordered
          class="add-address-card cursor-pointer"
          @click="$emit('add')"
          tabindex="0"
          role="button"
          aria-label="Ajouter une nouvelle adresse"
          @keyup.enter="$emit('add')"
        >
          <q-card-section class="flex flex-center column q-pa-xl">
            <q-icon name="add" size="48px" color="primary" />
            <div class="text-subtitle2 text-primary q-mt-md text-center">Ajouter une adresse</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Message limite atteinte -->
    <div v-if="hasReachedLimit" class="text-center q-py-md">
      <q-banner class="bg-info text-white" rounded>
        <template #avatar>
          <q-icon name="info" />
        </template>
        <div class="text-body2">
          Limite de 10 adresses atteinte. Supprimez une adresse pour en ajouter une nouvelle.
        </div>
      </q-banner>
    </div>
  </div>
</template>

<script setup>
import AddressCard from './AddressCard.vue'

defineProps({
  addresses: {
    type: Array,
    required: true,
  },
  hasReachedLimit: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['add', 'edit', 'remove', 'setDefaultShipping', 'setDefaultBilling'])
</script>

<style scoped>
.add-address-card {
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
  transition: all 0.2s ease;
  height: 100%;
  min-height: 200px;
}

.add-address-card:hover {
  border-color: #1976d2;
  background-color: #f5f5f5;
}

.add-address-card:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}
</style>
