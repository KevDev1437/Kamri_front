<!-- src/components/StyleQuiz.vue -->
<template>
  <div class="style-quiz">
    <h2 class="text-h5 text-center q-mb-lg">{{ title }}</h2>

    <!-- Loading -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40" />
      <div class="text-grey q-mt-sm">Chargement des styles…</div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center q-pa-xl">
      <q-icon name="error" color="negative" size="40px" />
      <div class="text-negative q-mt-sm">Une erreur est survenue</div>
      <q-btn flat color="primary" label="Réessayer" class="q-mt-md" @click="loadStyles" />
    </div>

    <!-- Styles -->
    <transition-group
      tag="div"
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      class="style-circles-container row justify-center q-gutter-xl"
    >
      <div
        v-for="style in styles"
        :key="style.value"
        class="style-circle cursor-pointer"
        :class="{ selected: selectedStyle?.value === style.value }"
        @click="handleStyleSelect(style)"
        v-ripple
      >
        <div class="style-label">{{ style.label }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

/* props / emits ----------------------------------------------------------- */
const props = defineProps({
  title: { type: String, default: 'Quel est votre style ?' },
  preselectedStyle: String
})

const emit = defineEmits({
  select:  (style) => !!style,
  error:   (err)   => err instanceof Error,
  loaded:  (arr)   => Array.isArray(arr)
})

/* state ------------------------------------------------------------------- */
const title = computed(() => props.title)

const styles = ref([
  { value: 'casual',   label: 'Décontracté' },
  { value: 'chic',     label: 'Élégant'     },
  { value: 'sporty',   label: 'Sportif'     },
  { value: 'bohemian', label: 'Bohème'      }
])

const loading        = ref(true)
const error          = ref(null)
const selectedStyle  = ref(null)

/* methods ----------------------------------------------------------------- */
async function loadStyles () {
  try {
    loading.value = true
    error.value   = null
    await new Promise(r => setTimeout(r, 1200))            // fake API
    loading.value = false
    emit('loaded', styles.value)
  } catch (err) {
    error.value = err
    emit('error', err)
  }
}

function handleStyleSelect (style) {
  selectedStyle.value = style
  emit('select', style)
}

/* watchers / life-cycle --------------------------------------------------- */
watch(() => props.preselectedStyle, (val) => {
  const found = styles.value.find(s => s.value === val)
  if (found) selectedStyle.value = found
}, { immediate: true })

onMounted(loadStyles)
</script>

<style lang="scss" scoped>
.style-quiz {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* conteneur flex horizontal – wrap sur mobile */
.style-circles-container {
  flex-wrap: wrap;
}

.style-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,.08);
  border: 2px solid transparent;
  transition: transform .2s, box-shadow .2s, border-color .2s;

  &:hover        { transform: translateY(-4px); box-shadow: 0 4px 8px rgba(0,0,0,.12); }
  &.selected     { border-color: var(--q-primary); background: rgba(var(--q-primary-rgb),.1); }
}

.style-label {
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  color: var(--q-grey-8);
}

/* keyframes pour l’apparition / disparition */
.animated { animation-duration: .3s; animation-fill-mode: both; }
@keyframes fadeIn  { from {opacity:0; transform:translateY(20px)} to {opacity:1; transform:none} }
@keyframes fadeOut { from {opacity:1; transform:none}               to {opacity:0; transform:translateY(20px)} }
</style>
