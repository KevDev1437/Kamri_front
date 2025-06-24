
// src/components/MagazineCard.vue
<template>
  <q-card flat bordered class="magazine-card">
    <q-img :src="article.image" ratio="16/9" />
    <q-card-section>
      <div class="text-subtitle1 font-medium">{{ article.title }}</div>
      <div class="text-caption text-grey">{{ article.date }}</div>
      <div class="q-mt-sm">{{ article.excerpt }}</div>
    </q-card-section>
    <q-card-actions>
      <q-btn flat label="Lire" @click="readArticle" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({ article: Object })

function readArticle() {
  window.location.href = `/blog/${props.article.id}`
}
</script>

<style scoped>
.magazine-card {
  width: 300px;
  margin-right: 16px;
}
</style>
