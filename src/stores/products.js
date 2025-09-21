import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useProductsStore = defineStore('products', {
  state: () => ({
    featuredProducts: [],
    products: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
    },
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getFeaturedProducts: (state) => state.featuredProducts,
    getProducts: (state) => state.products,
    getPagination: (state) => state.pagination,
  },

  actions: {
    async fetchFeaturedProducts() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/products/featured')
        this.featuredProducts = response.data
      } catch (error) {
        this.error = 'Erreur lors du chargement des produits en vedette'
        console.error('Error fetching featured products:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchProducts(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/products', { params })
        this.products = response.data.data || response.data

        // Gestion de la pagination si présente
        if (response.data.meta) {
          this.pagination = {
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page,
            per_page: response.data.meta.per_page,
            total: response.data.meta.total,
          }
        }
      } catch (error) {
        this.error = 'Erreur lors du chargement des produits'
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    async searchProducts(query) {
      if (!query.trim()) {
        this.products = []
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/products/search', {
          params: { q: query },
        })
        this.products = response.data.data || response.data
      } catch (error) {
        this.error = 'Erreur lors de la recherche'
        console.error('Error searching products:', error)
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
})
