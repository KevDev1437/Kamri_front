<template>
  <q-card flat bordered class="address-card">
    <q-card-section>
      <!-- Header avec label et badges -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle2 text-weight-bold">{{ address.label }}</div>
        <div class="row q-gutter-xs">
          <q-chip
            v-if="address.isDefaultShipping"
            color="primary"
            text-color="white"
            icon="local_shipping"
            label="Livraison"
            size="sm"
          />
          <q-chip
            v-if="address.isDefaultBilling"
            color="secondary"
            text-color="white"
            icon="receipt"
            label="Facturation"
            size="sm"
          />
        </div>
      </div>

      <!-- Informations de l'adresse -->
      <div class="text-body2 q-mb-sm">
        <div class="text-weight-medium">{{ address.firstName }} {{ address.lastName }}</div>
        <div>{{ address.line1 }}</div>
        <div v-if="address.line2">{{ address.line2 }}</div>
        <div>{{ address.postalCode }} {{ address.city }}</div>
        <div>{{ getCountryName(address.country) }}</div>
        <div v-if="address.phone" class="text-grey-7">
          <q-icon name="phone" size="xs" class="q-mr-xs" />
          {{ address.phone }}
        </div>
      </div>
    </q-card-section>

    <!-- Actions -->
    <q-card-actions align="right" class="q-pa-md q-pt-none">
      <q-btn
        flat
        round
        dense
        icon="edit"
        color="primary"
        @click="$emit('edit', address)"
        aria-label="Modifier cette adresse"
      />
      <q-btn
        flat
        round
        dense
        icon="delete"
        color="negative"
        @click="$emit('remove', address)"
        aria-label="Supprimer cette adresse"
      />
      <q-btn-dropdown flat round dense icon="more_vert" color="grey-7" aria-label="Plus d'actions">
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="$emit('setDefaultShipping', address)"
            :disable="address.isDefaultShipping"
          >
            <q-item-section avatar>
              <q-icon name="local_shipping" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Défaut livraison</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="$emit('setDefaultBilling', address)"
            :disable="address.isDefaultBilling"
          >
            <q-item-section avatar>
              <q-icon name="receipt" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Défaut facturation</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import countriesData from 'src/mock/countries.json'

defineProps({
  address: {
    type: Object,
    required: true,
    validator: (address) => {
      return (
        address.id &&
        address.label &&
        address.firstName &&
        address.lastName &&
        address.line1 &&
        address.city &&
        address.postalCode &&
        address.country
      )
    },
  },
})

defineEmits(['edit', 'remove', 'setDefaultShipping', 'setDefaultBilling'])

// Méthodes
const getCountryName = (code) => {
  const country = countriesData.find((c) => c.code === code)
  return country ? country.name : code
}
</script>

<style scoped>
.address-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  height: 100%;
}

.address-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>
