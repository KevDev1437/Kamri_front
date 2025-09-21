import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    hotCategories: [],
    loading: false,
    error: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getAllCategories: (state) => state.categories,
    getHotCategories: (state) => state.hotCategories,
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/categories')
        this.categories = response.data
      } catch (error) {
        this.error = 'Erreur lors du chargement des catégories'
        console.error('Error fetching categories:', error)

        // Fallback avec des catégories par défaut
        this.categories = this.getDefaultCategories()
      } finally {
        this.loading = false
      }
    },

    async fetchHotCategories() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/categories/hot')
        this.hotCategories = response.data
      } catch (error) {
        this.error = 'Erreur lors du chargement des catégories populaires'
        console.error('Error fetching hot categories:', error)
      } finally {
        this.loading = false
      }
    },

    getDefaultCategories() {
      return [
        {
          id: 1,
          name: 'FEMMES',
          slug: 'femmes',
          image: '/images/categories/women.jpg',
          is_hot: true,
        },
        {
          id: 2,
          name: 'CURVY',
          slug: 'curvy',
          image: '/images/categories/curvy.jpg',
          is_hot: true,
        },
        {
          id: 3,
          name: 'HOMME',
          slug: 'homme',
          image: '/images/categories/men.jpg',
          is_hot: false,
        },
        {
          id: 4,
          name: 'ENFANT & BÉBÉ',
          slug: 'enfant-bebe',
          image: '/images/categories/kids.jpg',
          is_hot: true,
        },
        {
          id: 5,
          name: 'BEAUTÉ & BIEN-ÊTRE',
          slug: 'beaute-bien-etre',
          image: '/images/categories/beauty.jpg',
          is_hot: true,
        },
        {
          id: 6,
          name: 'SPORTS',
          slug: 'sports',
          image: '/images/categories/sports.jpg',
          is_hot: true,
        },
      ]
    },

    clearError() {
      this.error = null
    },
  },
})
