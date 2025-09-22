<!-- src/pages/magazine/ArticlePage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="container">
      <!-- Loading state -->
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-dots size="50px" color="primary" />
        <div class="text-body2 q-mt-md">Chargement de l'article...</div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center q-py-xl">
        <q-icon name="error_outline" size="50px" color="negative" />
        <div class="text-h6 q-mt-md text-negative">{{ error }}</div>
        <q-btn label="Retour au magazine" color="primary" to="/magazine" class="q-mt-md" />
      </div>

      <!-- Article content -->
      <div v-else-if="article" class="row q-col-gutter-lg">
        <!-- Article header -->
        <div class="col-12">
          <q-breadcrumbs class="q-mb-md">
            <q-breadcrumbs-el label="Accueil" to="/" />
            <q-breadcrumbs-el label="Magazine" to="/magazine" />
            <q-breadcrumbs-el :label="article.title" />
          </q-breadcrumbs>

          <div class="article-header">
            <h1 class="text-h4 text-weight-bold q-mb-sm">{{ article.title }}</h1>
            <div class="text-body2 text-grey-7 q-mb-md">
              Par {{ article.author }} • {{ formatDate(article.date) }}
            </div>
            <q-img
              v-if="article.image"
              :src="article.image"
              :alt="article.title"
              ratio="16/9"
              class="rounded-borders q-mb-lg"
            />
          </div>
        </div>

        <!-- Article content -->
        <div class="col-12 col-md-8">
          <q-card flat bordered class="q-pa-lg">
            <div class="article-content" v-html="article.content"></div>
          </q-card>
        </div>

        <!-- Sidebar -->
        <div class="col-12 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <div class="text-h6 q-mb-md">Articles similaires</div>
            <div v-if="relatedArticles.length === 0" class="text-grey-7">
              Aucun article similaire pour le moment.
            </div>
            <div v-else class="q-gutter-md">
              <div
                v-for="related in relatedArticles"
                :key="related.id"
                class="related-article cursor-pointer"
                @click="$router.push(`/magazine/${related.id}`)"
              >
                <q-img
                  v-if="related.image"
                  :src="related.image"
                  :alt="related.title"
                  ratio="16/9"
                  class="rounded-borders q-mb-sm"
                />
                <div class="text-subtitle2">{{ related.title }}</div>
                <div class="text-caption text-grey-7">{{ formatDate(related.date) }}</div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { useSeo } from 'src/composables/useSeo'
import { buildCanonical, articleJsonLd, breadcrumbJsonLd, truncate } from 'src/utils/seo'

const route = useRoute()

// SEO
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:9000'

// State
const article = ref(null)
const relatedArticles = ref([])
const loading = ref(false)
const error = ref(null)

// Computed
const articleId = computed(() => route.params.id)

// SEO computed
const title = computed(() => `${article.value?.title || 'Article'} – Magazine – KAMRI`)
const desc = computed(() =>
  truncate(article.value?.excerpt || article.value?.description || '', 160),
)

// SEO
useSeo({
  title: title.value,
  description: desc.value,
  canonical: buildCanonical(SITE_URL, route.fullPath),
  image: article.value?.image || '/og-default.jpg',
  jsonLd: [
    breadcrumbJsonLd(SITE_URL, [
      { name: 'Accueil', path: '/' },
      { name: 'Magazine', path: '/magazine' },
      { name: article.value?.title || 'Article', path: route.fullPath },
    ]),
    article.value ? articleJsonLd(SITE_URL, article.value) : null,
  ].filter(Boolean),
})

// Methods
const fetchArticle = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get(`/api/magazine/${articleId.value}`)
    article.value = response.data

    // Charger les articles similaires
    await fetchRelatedArticles()
  } catch (err) {
    console.error("Erreur lors du chargement de l'article:", err)
    error.value = 'Article non trouvé'
  } finally {
    loading.value = false
  }
}

const fetchRelatedArticles = async () => {
  try {
    const response = await api.get('/api/magazine/related', {
      params: { id: articleId.value, limit: 3 },
    })
    relatedArticles.value = response.data || []
  } catch (err) {
    console.error('Erreur lors du chargement des articles similaires:', err)
    relatedArticles.value = []
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Lifecycle
onMounted(() => {
  fetchArticle()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.article-header {
  text-align: center;
  margin-bottom: 2rem;
}

.article-content {
  line-height: 1.6;
}

.article-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--q-primary);
}

.article-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

.related-article {
  transition: transform 0.2s ease;
}

.related-article:hover {
  transform: translateY(-2px);
}
</style>
