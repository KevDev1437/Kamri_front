import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useMagazineStore = defineStore('magazine', {
  state: () => ({
    articles: [],
    loading: false,
    error: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getArticles: (state) => state.articles,
    getRecentArticles: (state) => state.articles.slice(0, 4),
  },

  actions: {
    async fetchArticles(limit = 10) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/magazine', {
          params: { limit },
        })
        this.articles = response.data
      } catch (error) {
        this.error = 'Erreur lors du chargement des articles'
        console.error('Error fetching articles:', error)

        // Fallback avec des articles par défaut
        this.articles = this.getDefaultArticles()
      } finally {
        this.loading = false
      }
    },

    getDefaultArticles() {
      return [
        {
          id: 1,
          title: 'Lookbook Été 2025',
          excerpt: 'Découvrez les dernières tendances mode pour cet été.',
          image: 'https://picsum.photos/400/250?random=1',
          author: 'Sophie Martin',
          formatted_date: '15 Jan 2025',
        },
        {
          id: 2,
          title: 'Guide Mode Automne',
          excerpt: "Préparez votre garde-robe pour l'automne.",
          image: 'https://picsum.photos/400/250?random=2',
          author: 'Marie Dubois',
          formatted_date: '10 Jan 2025',
        },
        {
          id: 3,
          title: 'Accessoires Indispensables',
          excerpt: 'Les accessoires qui font la différence.',
          image: 'https://picsum.photos/400/250?random=3',
          author: 'Julie Leroy',
          formatted_date: '5 Jan 2025',
        },
        {
          id: 4,
          title: 'Beauté Naturelle',
          excerpt: 'Adoptez une routine beauté naturelle.',
          image: 'https://picsum.photos/400/250?random=4',
          author: 'Emma Rousseau',
          formatted_date: '1 Jan 2025',
        },
      ]
    },

    clearError() {
      this.error = null
    },
  },
})
