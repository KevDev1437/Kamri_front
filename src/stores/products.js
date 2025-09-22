import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { buildParams, applyClientFilterAndSort } from 'src/utils/query'

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [],
    featuredProducts: [],
    total: 0,
    page: 1,
    pageSize: 50,
    loading: false,
    hasMore: true,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 50,
      total: 0,
    },
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getFeaturedProducts: (state) => state.featuredProducts,
    getProducts: (state) => state.items,
    pagedItems: (state) => state.items.slice(0, state.page * state.pageSize),
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

    async fetch({ filters, sort, page = 1 }) {
      this.loading = true
      this.error = null
      this.page = page

      try {
        const params = buildParams(filters, sort, page, this.pageSize)
        try {
          const res = await api.get('/api/products', { params })
          const { data, total } = res.data
          this.items = data
          this.total = total
          this.hasMore = this.items.length < this.total
        } catch {
          // Fallback client (si API pas prête)
          const local = await applyClientFilterAndSort(filters, sort, page, this.pageSize)
          this.items = local.data
          this.total = local.total
          this.hasMore = this.items.length < this.total
        }
      } catch (error) {
        this.error = 'Erreur lors du chargement des produits'
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchProducts(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/products', { params })
        this.items = response.data.data || response.data

        // Gestion de la pagination si présente
        if (response.data.meta) {
          this.pagination = {
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page,
            per_page: response.data.meta.per_page,
            total: response.data.meta.total,
          }
          this.hasMore = response.data.meta.current_page < response.data.meta.last_page
        }
      } catch (error) {
        this.error = 'Erreur lors du chargement des produits'
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchMore({ filters, sort, page }) {
      if (this.loading) return
      this.loading = true
      this.error = null

      try {
        const params = buildParams(filters, sort, page, this.pageSize)
        try {
          const res = await api.get('/api/products', { params })
          const { data, total } = res.data
          this.items = this.items.concat(data)
          this.total = total
          this.hasMore = this.items.length < this.total
        } catch {
          const local = await applyClientFilterAndSort(filters, sort, page, this.pageSize)
          this.items = this.items.concat(local.data)
          this.total = local.total
          this.hasMore = this.items.length < this.total
        }
      } catch (error) {
        this.error = 'Erreur lors du chargement des produits suivants'
        console.error('Error fetching more products:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchNext() {
      if (!this.hasMore || this.loading) return

      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/products', {
          params: {
            page: this.page + 1,
            per_page: this.pageSize,
          },
        })

        const newProducts = response.data.data || response.data
        this.items = [...this.items, ...newProducts]
        this.page++

        // Gestion de la pagination
        if (response.data.meta) {
          this.pagination = {
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page,
            per_page: response.data.meta.per_page,
            total: response.data.meta.total,
          }
          this.hasMore = response.data.meta.current_page < response.data.meta.last_page
        }
      } catch (error) {
        this.error = 'Erreur lors du chargement des produits suivants'
        console.error('Error fetching next products:', error)
      } finally {
        this.loading = false
      }
    },

    async searchProducts(query) {
      if (!query.trim()) {
        this.items = []
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/products/search', {
          params: { q: query },
        })
        this.items = response.data.data || response.data
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
