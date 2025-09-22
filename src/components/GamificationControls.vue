// src/components/GamificationControls.vue
<template>
  <div class="gamification-container row q-gutter-lg justify-center">
    <!-- Points Card -->
    <div class="gamification-tile">
      <div class="tile-content">
        <q-icon name="emoji_events" size="3rem" class="tile-icon" />
        <div class="tile-text">
          <template v-if="loading">
            <q-skeleton type="text" class="text-subtitle1" />
          </template>
          <template v-else-if="error">
            <div class="text-negative">
              <q-icon name="error" size="sm" />
              <span class="q-ml-xs">Erreur</span>
            </div>
            <q-btn flat label="Réessayer" color="primary" @click="loadPoints" class="q-mt-sm" />
          </template>
          <template v-else>
            <div class="tile-title">Points</div>
            <div class="tile-value">{{ points }}</div>
            <div v-if="nextRewardAt" class="tile-subtitle">
              {{ pointsToNextReward }} points avant récompense
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Community Card -->
    <div class="gamification-tile">
      <div class="tile-content">
        <q-icon name="people" size="3rem" class="tile-icon" />
        <div class="tile-text">
          <div class="tile-title">Communauté</div>
          <div class="tile-value">Mur</div>
          <div v-if="unreadPosts" class="tile-subtitle">
            {{ unreadPosts }} nouvelles publications
          </div>
        </div>
      </div>
      <q-btn
        flat
        label="Voir"
        :loading="navigatingToCommunity"
        @click="openCommunity"
        class="tile-action"
      />
    </div>

    <!-- Daily Challenges Card -->
    <div class="gamification-tile">
      <div class="tile-content">
        <q-icon name="track_changes" size="3rem" class="tile-icon" />
        <div class="tile-text">
          <div class="tile-title">Défis</div>
          <template v-if="loading">
            <q-skeleton type="text" class="text-caption q-mt-sm" />
          </template>
          <template v-else-if="error">
            <div class="text-negative text-caption">Impossible de charger</div>
          </template>
          <template v-else>
            <div class="tile-value">{{ completedChallenges }}/{{ totalChallenges }}</div>
            <div class="tile-subtitle">défis complétés</div>
          </template>
        </div>
      </div>
      <q-btn flat label="Voir" @click="$emit('view-challenges')" class="tile-action" />
    </div>
  </div>
</template>

<script setup>
import { api } from 'boot/axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// État
const points = ref(0)
const nextRewardAt = ref(null)
const unreadPosts = ref(0)
const completedChallenges = ref(0)
const totalChallenges = ref(0)
const loading = ref(false)
const error = ref(null)
const navigatingToCommunity = ref(false)

// Props
defineProps({
  includeUnreadPosts: {
    type: Boolean,
    default: true,
  },
  includeChallenges: {
    type: Boolean,
    default: true,
  },
})

// Events
const emit = defineEmits(['points-loaded', 'view-challenges', 'error'])

// Computed
const pointsToNextReward = computed(() => {
  if (!nextRewardAt.value || points.value >= nextRewardAt.value) return 0
  return nextRewardAt.value - points.value
})

// Methods
async function loadPoints() {
  loading.value = true
  error.value = null

  try {
    const res = await api.get('/api/user/points')
    points.value = res.data.points
    nextRewardAt.value = res.data.nextRewardAt
    emit('points-loaded', res.data)
  } catch (err) {
    console.error('Erreur chargement points:', err)
    error.value = err
    emit('error', err)
  } finally {
    loading.value = false
  }
}

async function loadChallenges() {
  try {
    const res = await api.get('/api/user/challenges/daily')
    completedChallenges.value = res.data.completed
    totalChallenges.value = res.data.total
  } catch (err) {
    console.error('Erreur chargement défis:', err)
  }
}

async function loadUnreadPosts() {
  try {
    const res = await api.get('/api/community/unread')
    unreadPosts.value = res.data.count
  } catch (err) {
    console.error('Erreur chargement posts non lus:', err)
  }
}

async function openCommunity() {
  navigatingToCommunity.value = true
  try {
    await router.push('/community')
  } finally {
    navigatingToCommunity.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([loadPoints(), loadChallenges(), loadUnreadPosts()])
})
</script>

<style lang="scss" scoped>
@use 'src/css/_tokens.scss' as *;

.gamification-container {
  padding: 1rem 0;
}

.gamification-tile {
  @extend %grad-card;
  min-width: 200px;
  max-width: 280px;
  border-radius: $radius-lg;
  padding: 1.5rem;
  box-shadow: $shadow-1;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: rotate(-0.5deg) translateY(-2px);
    box-shadow: $shadow-2;
  }
}

.tile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
}

.tile-icon {
  color: $primary;
  margin-bottom: 1rem;
}

.tile-text {
  width: 100%;
}

.tile-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: $dark;
  margin-bottom: 0.5rem;
}

.tile-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: $primary;
  margin-bottom: 0.25rem;
}

.tile-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.tile-action {
  width: 100%;
  margin-top: auto;
}

/* Loading state styles */
:deep(.q-skeleton) {
  max-width: 150px;
  margin: 0 auto;
}
</style>
