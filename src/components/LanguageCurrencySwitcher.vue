<template>
  <div class="row items-center q-gutter-sm">
    <!-- Sélecteur de langue -->
    <q-select
      dense
      outlined
      :options="languageOptions"
      v-model="selectedLanguage"
      @update:model-value="onLanguageChange"
      aria-label="Changer de langue"
      class="min-w-80"
      emit-value
      map-options
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- Sélecteur de devise -->
    <q-select
      dense
      outlined
      :options="currencyOptions"
      v-model="selectedCurrency"
      @update:model-value="onCurrencyChange"
      aria-label="Changer de devise"
      class="min-w-90"
      emit-value
      map-options
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLocaleStore } from 'src/stores/locale'

const localeStore = useLocaleStore()

// Options pour les sélecteurs
const languageOptions = computed(() => [
  { label: 'Français', value: 'fr' },
  { label: 'English', value: 'en' },
])

const currencyOptions = computed(() => [
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'USD ($)', value: 'USD' },
])

// Valeurs sélectionnées
const selectedLanguage = computed({
  get: () => localeStore.locale,
  set: (value) => localeStore.setLocale(value),
})

const selectedCurrency = computed({
  get: () => localeStore.currency,
  set: (value) => localeStore.setCurrency(value),
})

// Handlers
function onLanguageChange() {
  localeStore.persist()
}

function onCurrencyChange() {
  localeStore.persist()
}
</script>

<style scoped>
.min-w-80 {
  min-width: 80px;
}

.min-w-90 {
  min-width: 90px;
}
</style>
