// src/components/GamificationControls.vue
<template>
  <div class="gamification-container q-pa-md q-gutter-lg row wrap justify-around">
    <!-- Points Card -->
    <q-card flat bordered class="gamification-card q-pa-md">
      <q-card-section class="text-center">
        <q-icon name="emoji_events" size="2rem" class="q-mb-sm text-warning" />
        <template v-if="loading">
          <q-skeleton type="text" class="text-subtitle1" />
        </template>
        <template v-else-if="error">
          <div class="text-negative">
            <q-icon name="error" size="sm" />
            <span class="q-ml-xs">Erreur de chargement</span>
          </div>
          <q-btn flat label="Réessayer" color="primary" @click="loadPoints" class="q-mt-sm" />
        </template>
        <template v-else>
          <div class="text-subtitle1 font-medium">
            Points : {{ points }}
          </div>
          <div v-if="nextRewardAt" class="text-caption q-mt-sm">
            {{ pointsToNextReward }} points avant la prochaine récompense
          </div>
        </template>
      </q-card-section>
    </q-card>

    <!-- Community Card -->
    <q-card flat bordered class="gamification-card q-pa-md">
      <q-card-section class="text-center">
        <q-icon name="people" size="2rem" class="q-mb-sm text-info" />
        <div class="text-subtitle1 font-medium">Mur Communautaire</div>
        <div v-if="unreadPosts" class="text-caption q-mt-sm">
          {{ unreadPosts }} nouvelles publications
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          label="Voir"
          :loading="navigatingToCommunity"
          @click="openCommunity"
        />
      </q-card-actions>
    </q-card>

    <!-- Daily Challenges Card -->
    <q-card flat bordered class="gamification-card q-pa-md">
      <q-card-section class="text-center">
        <q-icon name="track_changes" size="2rem" class="q-mb-sm text-primary" />
        <div class="text-subtitle1 font-medium">Défis du jour</div>
        <template v-if="loading">
          <q-skeleton type="text" class="text-caption q-mt-sm" />
        </template>
        <template v-else-if="error">
          <div class="text-negative text-caption">
            Impossible de charger les défis
          </div>
        </template>
        <template v-else>
          <div class="text-caption q-mt-sm">
            {{ completedChallenges }}/{{ totalChallenges }} défis complétés
          </div>
        </template>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          label="Voir les défis"
          @click="$emit('view-challenges')"
        />
      </q-card-actions>
    </q-card>
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
    default: true
  },
  includeChallenges: {
    type: Boolean,
    default: true
  }
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
  await Promise.all([
    loadPoints(),
    loadChallenges(),
    loadUnreadPosts()
  ])
})
</script>

<style scoped>
.gamification-container {
  background: #fff;
  border-radius: 8px;
}

.gamification-card {
  min-width: 200px;
  transition: transform 0.2s ease;
}

.gamification-card:hover {
  transform: translateY(-2px);
}

/* Loading state styles */
:deep(.q-skeleton) {
  max-width: 150px;
  margin: 0 auto;
}
</style>
