<!-- src/components/StyleQuiz.vue -->
<template>
  <div class="style-quiz q-pa-md">
    <h2 class="text-h5 text-center q-mb-lg">{{ title }}</h2>

    <!-- États de chargement et d'erreur -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40" />
      <div class="text-grey q-mt-sm">Chargement des styles...</div>
    </div>

    <div v-else-if="error" class="text-center q-pa-xl">
      <q-icon name="error" color="negative" size="40px" />
      <div class="text-negative q-mt-sm">Une erreur est survenue</div>
      <q-btn
        flat
        color="primary"
        label="Réessayer"
        class="q-mt-md"
        @click="loadStyles"
      />
    </div>

    <!-- Grille des styles -->
    <transition-group
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      class="row q-col-gutter-md"
    >
      <div
        v-for="style in styles"
        :key="style.value"
        class="col-6 col-sm-3"
      >
        <q-card
          class="style-card cursor-pointer"
          :class="{ 'selected': selectedStyle?.value === style.value }"
          @click="handleStyleSelect(style)"
          v-ripple
        >
          <q-card-section class="text-center">
            <q-icon :name="style.icon" size="48px" color="primary" />
            <div class="text-subtitle1 q-mt-sm">{{ style.label }}</div>
          </q-card-section>
        </q-card>
      </div>
    </transition-group>

    <!-- Bouton passer -->
    <div class="text-center q-mt-lg">
      <q-btn
        flat
        color="grey"
        label="Passer cette étape"
        @click="handleSkip"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: 'Quel est votre style ?',
    required: false
  },
  preselectedStyle: {
    type: String,
    default: null,
    required: false
  }
})

const emit = defineEmits({
  select: (style) => {
    return style && typeof style === 'object' && 'value' in style && 'label' in style
  },
  skip: null,
  error: (err) => err instanceof Error,
  loaded: (styles) => Array.isArray(styles)
})

const router = useRouter()
const title = computed(() => props.title)

// État du quiz
const styles = ref([
  { value: 'casual', label: 'Décontracté', icon: 'style' },
  { value: 'chic', label: 'Élégant', icon: 'style' },
  { value: 'sporty', label: 'Sportif', icon: 'style' },
  { value: 'bohemian', label: 'Bohème', icon: 'style' }
])

const loading = ref(true)
const error = ref(null)
const selectedStyle = ref(null)

// Chargement des styles
const loadStyles = async () => {
  try {
    loading.value = true
    error.value = null
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1500))
    loading.value = false
    emit('loaded', styles.value)
  } catch (err) {
    error.value = err
    emit('error', err)
  }
}

// Gestion de la sélection
const handleStyleSelect = (style) => {
  selectedStyle.value = style
  emit('select', style)
}

const handleSkip = () => {
  emit('skip')
  router.push('/products')
}

// Surveillance du style présélectionné
watch(() => props.preselectedStyle, (newStyle) => {
  if (newStyle && styles.value.find(s => s.value === newStyle)) {
    selectedStyle.value = styles.value.find(s => s.value === newStyle)
  }
}, { immediate: true })

// Initialisation
onMounted(() => {
  loadStyles()
})
</script>

<style lang="scss" scoped>
.style-quiz {
  max-width: 800px;
  margin: 0 auto;
}

.style-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border: 2px solid $primary;
    background: lighten($primary, 45%);
  }
}

// Animations
.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>
