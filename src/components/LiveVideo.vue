<!-- src/components/LiveVideo.vue -->
<template>
  <section class="live-section">
    <div class="live-banner">
      <div class="container-1200 q-px-md q-px-lg-none">
        <div class="header-row q-mb-lg">
          <h2 class="live-title">Live Shopping</h2>
          <div class="live-info" v-if="isLive">
            <q-badge color="red" class="live-badge"> LIVE </q-badge>
            <span class="viewer-count" v-if="viewerCount">
              {{ formatViewerCount(viewerCount) }} spectateurs
            </span>
          </div>
        </div>

        <!-- États de streaming -->
        <q-responsive :ratio="16 / 9" class="video-frame q-mx-auto">
          <!-- Chargement -->
          <template v-if="loading">
            <div class="placeholder flex flex-center column">
              <q-spinner size="50px" color="primary" />
              <div class="q-mt-sm">Chargement du stream...</div>
            </div>
          </template>

          <!-- Erreur -->
          <template v-else-if="error">
            <div class="placeholder flex flex-center column">
              <q-icon name="error" size="50px" color="negative" />
              <div class="text-negative q-mt-sm">{{ error }}</div>
              <q-btn
                flat
                color="primary"
                label="Réessayer"
                @click="$emit('retry')"
                class="q-mt-md"
              />
            </div>
          </template>

          <!-- Pas de live en cours -->
          <template v-else-if="!isLive">
            <div class="placeholder flex flex-center column">
              <q-icon name="slideshow" size="50px" color="grey-7" />
              <div class="q-mt-sm">Aucun live en cours</div>
              <div class="text-caption q-mt-sm" v-if="nextLiveDate">
                Prochain live le {{ formatDate(nextLiveDate) }}
              </div>
            </div>
          </template>

          <!-- Stream -->
          <template v-else>
            <video
              v-if="streamUrl"
              ref="videoPlayer"
              class="video-player"
              controls
              :src="streamUrl"
              @error="handleVideoError"
            />
            <div v-else class="placeholder flex flex-center">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-responsive>

        <!-- Actions -->
        <div class="actions-row q-mt-lg">
          <!-- Bouton principal -->
          <q-btn
            v-if="isLive"
            color="accent"
            :label="joined ? 'Quitter le live' : 'Rejoindre le live'"
            size="lg"
            :loading="joining"
            @click="handleJoinLeave"
          />

          <!-- Notification pour le prochain live -->
          <q-btn
            v-else-if="nextLiveDate"
            outline
            color="accent"
            label="Me notifier"
            size="lg"
            @click="$emit('notify')"
          />

          <!-- Actions secondaires -->
          <div class="secondary-actions" v-if="isLive">
            <q-btn flat round color="white" icon="share" @click="$emit('share')" />
            <q-btn
              flat
              round
              :color="isMuted ? 'white' : 'accent'"
              :icon="isMuted ? 'volume_off' : 'volume_up'"
              @click="toggleMute"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Chat en direct si rejoint -->
    <div v-if="joined && isLive" class="chat-section q-mt-lg">
      <div class="container-1200 q-px-md q-px-lg-none">
        <div class="text-h6 text-white">Chat en direct</div>
        <div class="chat-messages q-mt-md" ref="chatContainer">
          <!-- Messages -->
          <template v-if="messages.length">
            <div v-for="msg in messages" :key="msg.id" class="chat-message q-py-sm">
              <strong>{{ msg.username }}:</strong> {{ msg.text }}
            </div>
          </template>
          <div v-else class="text-center text-white q-py-xl">Soyez le premier à commenter !</div>
        </div>

        <!-- Input chat -->
        <q-input
          v-model="newMessage"
          dense
          outlined
          placeholder="Écrivez un message..."
          class="q-mt-md"
          :disable="sendingMessage"
          @keyup.enter="sendMessage"
        >
          <template v-slot:append>
            <q-btn
              round
              dense
              flat
              icon="send"
              color="accent"
              :disable="!newMessage.trim()"
              :loading="sendingMessage"
              @click="sendMessage"
            />
          </template>
        </q-input>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'

// Props
defineProps({
  streamUrl: String,
  isLive: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  viewerCount: {
    type: Number,
    default: 0,
  },
  nextLiveDate: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['retry', 'join', 'leave', 'share', 'notify', 'send-message', 'error'])

// État local
const videoPlayer = ref(null)
const joined = ref(false)
const joining = ref(false)
const isMuted = ref(false)
const messages = ref([])
const newMessage = ref('')
const sendingMessage = ref(false)

// Formatage des nombres
const formatViewerCount = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

// Formatage des dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
  })
}

// Gestion du son
const toggleMute = () => {
  if (videoPlayer.value) {
    videoPlayer.value.muted = !videoPlayer.value.muted
    isMuted.value = videoPlayer.value.muted
  }
}

// Gestion des erreurs vidéo
const handleVideoError = (event) => {
  emit('error', {
    type: 'video',
    error: event.target.error,
  })
}

// Rejoindre/Quitter le live
const handleJoinLeave = async () => {
  if (joined.value) {
    joined.value = false
    emit('leave')
  } else {
    try {
      joining.value = true
      await emit('join')
      joined.value = true
    } catch (err) {
      console.error('Erreur lors de la connexion au live:', err)
    } finally {
      joining.value = false
    }
  }
}

// Envoi de message
const sendMessage = async () => {
  if (!newMessage.value.trim() || sendingMessage.value) return

  try {
    sendingMessage.value = true
    await emit('send-message', newMessage.value)
    newMessage.value = ''
  } catch (err) {
    console.error("Erreur lors de l'envoi du message:", err)
  } finally {
    sendingMessage.value = false
  }
}

// Nettoyage
onUnmounted(() => {
  if (joined.value) {
    emit('leave')
  }
})
</script>

<style lang="scss" scoped>
@use 'src/css/_tokens.scss' as *;

.live-section {
  position: relative;
  overflow: hidden;
}

.live-banner {
  @extend %grad-dark;
  color: white;
  padding: 2rem 0;
  position: relative;
}

.live-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.live-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.live-badge {
  padding: 4px 8px;
  font-weight: 500;
}

.viewer-count {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.video-frame {
  width: 100%;
  max-width: 1000px;
  background: #1f2937;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-2;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  height: 100%;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.actions-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.secondary-actions {
  display: flex;
  gap: 8px;
}

.chat-section {
  @extend %grad-dark;
  padding: 2rem 0;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $radius-md;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.chat-message {
  padding: 8px 16px;
  border-radius: $radius-sm;
  transition: background-color 0.2s ease;
  color: white;
}

.chat-message:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
