<template>
  <q-form @submit.prevent="onSubmit" class="q-gutter-md">
    <!-- Label de l'adresse -->
    <q-input
      outlined
      v-model="form.label"
      label="Label de l'adresse (ex: Maison, Bureau)"
      :rules="[(val) => (val && val.length > 0) || 'Requis']"
      aria-label="Label de l'adresse"
    />

    <!-- Prénom et Nom -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          outlined
          v-model="form.firstName"
          label="Prénom"
          :rules="[(val) => (val && val.length > 0) || 'Requis']"
          aria-label="Prénom"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          outlined
          v-model="form.lastName"
          label="Nom"
          :rules="[(val) => (val && val.length > 0) || 'Requis']"
          aria-label="Nom"
        />
      </div>
    </div>

    <!-- Adresse -->
    <q-input
      outlined
      v-model="form.line1"
      label="Adresse ligne 1"
      :rules="[(val) => (val && val.length > 0) || 'Requis']"
      aria-label="Adresse ligne 1"
    />

    <q-input
      outlined
      v-model="form.line2"
      label="Adresse ligne 2 (optionnel)"
      aria-label="Adresse ligne 2"
    />

    <!-- Code postal et Ville -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          outlined
          v-model="form.postalCode"
          label="Code postal"
          :rules="postalCodeRules"
          aria-label="Code postal"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-if="form.country === 'BE'"
          outlined
          v-model="form.city"
          :options="cityOptions"
          label="Ville"
          use-input
          input-debounce="300"
          @filter="filterCities"
          :rules="[(val) => (val && val.length > 0) || 'Requis']"
          aria-label="Ville"
        />
        <q-input
          v-else
          outlined
          v-model="form.city"
          label="Ville"
          :rules="[(val) => (val && val.length > 0) || 'Requis']"
          aria-label="Ville"
        />
      </div>
    </div>

    <!-- Pays -->
    <q-select
      outlined
      v-model="form.country"
      :options="countryOptions"
      label="Pays"
      :rules="[(val) => (val && val.length > 0) || 'Requis']"
      aria-label="Pays"
      @update:model-value="onCountryChange"
    />

    <!-- Téléphone -->
    <q-input
      outlined
      v-model="form.phone"
      label="Téléphone (optionnel)"
      type="tel"
      :rules="phoneRules"
      aria-label="Numéro de téléphone"
    />

    <!-- Défauts -->
    <div class="q-gutter-sm">
      <q-checkbox
        v-model="form.isDefaultShipping"
        label="Définir comme adresse de livraison par défaut"
        color="primary"
        aria-label="Définir comme adresse de livraison par défaut"
      />
      <q-checkbox
        v-model="form.isDefaultBilling"
        label="Définir comme adresse de facturation par défaut"
        color="primary"
        aria-label="Définir comme adresse de facturation par défaut"
      />
    </div>

    <!-- Actions -->
    <div class="row q-gutter-sm justify-end">
      <q-btn flat label="Annuler" @click="$emit('cancel')" aria-label="Annuler" />
      <q-btn
        type="submit"
        color="primary"
        :label="mode === 'create' ? 'Ajouter' : 'Modifier'"
        :loading="loading"
        aria-label="Sauvegarder l'adresse"
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import countriesData from 'src/mock/countries.json'
import citiesData from 'src/mock/cities-BE.json'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// State
const form = ref({
  label: '',
  firstName: '',
  lastName: '',
  line1: '',
  line2: '',
  city: '',
  postalCode: '',
  country: 'BE',
  phone: '',
  isDefaultShipping: false,
  isDefaultBilling: false,
})

const cityOptions = ref([])
const allCities = ref([])

// Options des pays
const countryOptions = computed(() =>
  countriesData.map((country) => ({
    label: country.name,
    value: country.code,
  })),
)

// Règles de validation pour le code postal
const postalCodeRules = computed(() => {
  const rules = [(val) => (val && val.length > 0) || 'Requis']

  if (form.value.country === 'BE') {
    rules.push((val) => /^\d{4}$/.test(val) || 'Code postal belge invalide (4 chiffres)')
  } else if (form.value.country === 'FR') {
    rules.push((val) => /^\d{5}$/.test(val) || 'Code postal français invalide (5 chiffres)')
  } else if (form.value.country === 'DE') {
    rules.push((val) => /^\d{5}$/.test(val) || 'Code postal allemand invalide (5 chiffres)')
  }

  return rules
})

// Règles de validation pour le téléphone
const phoneRules = computed(() => {
  const rules = []

  if (form.value.phone && form.value.phone.length > 0) {
    // Validation basique pour les numéros européens
    rules.push((val) => /^[+]?[0-9\s\-()]{8,15}$/.test(val) || 'Format de téléphone invalide')
  }

  return rules
})

// Méthodes
const filterCities = (val, update) => {
  update(() => {
    if (val === '') {
      cityOptions.value = allCities.value
    } else {
      const needle = val.toLowerCase()
      cityOptions.value = allCities.value.filter(
        (city) => city.label.toLowerCase().indexOf(needle) > -1,
      )
    }
  })
}

const onCountryChange = () => {
  // Réinitialiser la ville et le code postal quand le pays change
  form.value.city = ''
  form.value.postalCode = ''

  // Charger les villes pour la Belgique
  if (form.value.country === 'BE') {
    allCities.value = citiesData.map((city) => ({
      label: `${city.city} (${city.postalCode})`,
      value: city.city,
      postalCode: city.postalCode,
    }))
    cityOptions.value = allCities.value
  } else {
    allCities.value = []
    cityOptions.value = []
  }
}

const onSubmit = () => {
  // Validation finale
  if (
    !form.value.label ||
    !form.value.firstName ||
    !form.value.lastName ||
    !form.value.line1 ||
    !form.value.city ||
    !form.value.postalCode ||
    !form.value.country
  ) {
    return
  }

  emit('submit', { ...form.value })
}

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && Object.keys(newValue).length > 0) {
      form.value = { ...form.value, ...newValue }
    }
  },
  { immediate: true, deep: true },
)

watch(
  form,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { deep: true },
)

// Lifecycle
onMounted(() => {
  // Charger les villes belges par défaut
  if (form.value.country === 'BE') {
    onCountryChange()
  }
})
</script>

<style scoped>
.q-gutter-md > * {
  margin-bottom: 16px;
}
</style>
