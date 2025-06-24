// src/components/GamificationControls.vue
<template>
  <div class="gamification-container q-pa-md q-gutter-lg row wrap justify-around">
    <q-card flat bordered class="gamification-card q-pa-md">
      <q-card-section class="text-center">
        <q-icon name="emoji_events" size="2rem" class="q-mb-sm text-warning" />
        <div class="text-subtitle1 font-medium">Points : {{ points }}</div>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="gamification-card q-pa-md">
      <q-card-section class="text-center">
        <q-icon name="people" size="2rem" class="q-mb-sm text-info" />
        <div class="text-subtitle1 font-medium">Mur Communautaire</div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat label="Voir" @click="openCommunity" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

const points = ref(0)

onMounted(async () => {
  try {
    const res = await api.get('/api/user/points')
    points.value = res.data.points
  } catch {
    points.value = 0
  }
})

function openCommunity() {
  // navigate to community wall
  window.location.href = '/community'
}
</script>

<style scoped>
.gamification-container {
  background: #fff;
  border-radius: 8px;
}
.gamification-card {
  min-width: 200px;
}
</style>
