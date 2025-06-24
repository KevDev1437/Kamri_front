<template>
  <q-card
    flat
    class="cat-card text-center cursor-pointer"
    @click="navigate"
  >
    <!-- Image ronde -->
    <div class="img-wrap">
      <q-img :src="category.image" ratio="1" class="cat-img" />
      <!-- Badge facultatif -->
      <q-badge
        v-if="category.tag"
        color="orange"
        text-color="white"
        class="badge"
      >
        {{ category.tag }}
      </q-badge>
    </div>

    <!-- Libellé -->
    <div class="q-mt-sm text-subtitle2 text-uppercase">
      {{ category.name }}
    </div>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({ category: Object })
const router = useRouter()

function navigate () {
  router.push({ path: '/products', query: { cat: props.category.id } })
}
</script>

<style scoped>
.cat-card { width: 100%; max-width: 140px; }
.img-wrap { position: relative; }
.cat-img  { border-radius: 50%; transition: transform .15s; }
.cat-card:hover .cat-img { transform: scale(1.05); }
.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 10px;
  padding: 2px 4px;
}
</style>
