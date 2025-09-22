// src/components/MagazineCard.vue
<template>
  <q-card
    flat
    bordered
    class="magazine-card"
    @click="readArticle"
    :aria-label="`Lire l'article ${article.title}`"
  >
    <q-img :src="article.image" ratio="16/9" class="article-image" />
    <q-card-section class="article-content">
      <div class="article-title">{{ article.title }}</div>
      <div class="article-date">{{ article.date }}</div>
      <div class="article-excerpt">{{ article.excerpt }}</div>
    </q-card-section>
    <q-card-actions class="article-actions">
      <q-btn flat label="Lire" color="primary" @click.stop="readArticle" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({ article: Object })

function readArticle() {
  window.location.href = `/blog/${props.article.id}`
}
</script>

<style lang="scss" scoped>
@use 'src/css/_tokens.scss' as *;

.magazine-card {
  width: 100%;
  border-radius: $radius-md;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  box-shadow: $shadow-1;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-2;
    border-color: $primary;
  }
}

.article-image {
  transition: all 0.3s ease;
}

.magazine-card:hover .article-image {
  transform: scale(1.05);
}

.article-content {
  padding: 1.5rem;
}

.article-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: $dark;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.article-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.article-excerpt {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.article-actions {
  padding: 0 1.5rem 1.5rem;
}
</style>
