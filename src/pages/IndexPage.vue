<template>
  <q-page class="flex flex-center">
    <div>
      <h2>Résultat de l'appel API :</h2>
      <pre>{{ response }}</pre>
    </div>
  </q-page>
</template>

<script setup>
import { api } from 'boot/axios';
import { onMounted, ref } from 'vue';

const response = ref('Chargement...')

onMounted(async () => {
  try {
    const res = await api.get('api/test')
    response.value = res.data
  } catch (err) {
    response.value = 'Erreur : ' + err.message
  }
})
</script>
