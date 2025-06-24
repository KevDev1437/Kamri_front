<!-- src/components/LiveVideo.vue -->
<template>
  <div class="live-container q-pa-xl">
    <h2 class="text-h4 text-center q-mb-lg">Live Shopping</h2>

    <!-- CADRE Vidéo -->
    <q-responsive :ratio="16/9" class="video-frame q-mx-auto">
      <div class="placeholder flex flex-center">
        Vidéo en direct…
      </div>
    </q-responsive>

    <!-- Bouton -->
    <div class="text-center q-mt-lg">
      <q-btn
        color="green"
        label="Rejoindre le live"
        size="md"
        @click="joinLive"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({ streamUrl: String })

function joinLive () {
  if (props.streamUrl) window.open(props.streamUrl, '_blank')
}
</script>

<style scoped>
.live-container {
  background: #ffffff;
  border-radius: 12px;
  max-width: 1200px;
  margin: auto;
}

/* cadre vidéo gris clair */
.video-frame {
  width: 100%;
  max-width: 1000px;
  background: #cbd5e0;
  border-radius: 6px;
}

.placeholder {
  width: 100%;
  height: 100%;
  color: #4a5568;
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
