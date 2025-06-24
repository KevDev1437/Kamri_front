<!-- src/components/StyleQuiz.vue -->
<template>
  <div class="q-pa-md quiz-container">
    <h2 class="text-h5 text-center q-mb-md">Quel est votre style ? </h2>
    <div class="row items-center justify-center q-gutter-sm">
      <q-btn 
        v-for="option in options" 
        :key="option.value"
        outline 
        color="primary" 
        label="{{ option.label }}" 
        @click="select(option.value)"
        :unelevated="selected === option.value"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const options = [
  { label: 'Casual', value: 'casual' },
  { label: 'Business', value: 'business' },
  { label: 'Sport', value: 'sport' }
]

// Initialise la sélection depuis le query param ?style=
const selected = ref(route.query.style || '')

watch(() => route.query.style, newVal => {
  selected.value = newVal || ''
})

function select(value) {
  selected.value = value
  router.replace({ query: { ...route.query, style: value } })
}
</script>

<style scoped>
.quiz-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
</style>
