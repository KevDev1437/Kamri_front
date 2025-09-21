<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  // Initialiser l'authentification au démarrage de l'application
  await authStore.initAuth()
})
</script>
