import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    // Données
    items: [],
    total: 0,
    loading: false,
    error: null,

    // Filtres
    q: '',
    category: null,
    brands: [],
    price: { min: 0, max: 1000 },
    ratingMin: 0,
    inStock: false,
    ecoMin: 0,
    promo: false,

    // Tri & pagination
    sort: 'relevance', // 'relevance' | 'price_asc' | 'price_desc' | 'new' | 'rating_desc'
    page: 1,
    pageSize: 50,

    // Cache pour éviter les requêtes inutiles
    lastQuery: null,
  }),

  getters: {
    hasMore: (state) => state.total > state.items.length,

    activeFiltersCount: (state) => {
      let count = 0
      if (state.q) count++
      if (state.category) count++
      if (state.brands.length > 0) count++
      if (state.price.min > 0 || state.price.max < 1000) count++
      if (state.ratingMin > 0) count++
      if (state.inStock) count++
      if (state.ecoMin > 0) count++
      if (state.promo) count++
      return count
    },

    hasActiveFilters: (state) => state.activeFiltersCount > 0,

    // Filtres actifs pour affichage des chips
    activeFilters: (state) => {
      const filters = []

      if (state.q) {
        filters.push({
          key: 'q',
          label: `"${state.q}"`,
          value: state.q,
        })
      }

      if (state.category) {
        filters.push({
          key: 'category',
          label: `Catégorie: ${state.category}`,
          value: state.category,
        })
      }

      if (state.brands.length > 0) {
        filters.push({
          key: 'brands',
          label: `Marques: ${state.brands.join(', ')}`,
          value: state.brands,
        })
      }

      if (state.price.min > 0 || state.price.max < 1000) {
        filters.push({
          key: 'price',
          label: `Prix: ${state.price.min}€ - ${state.price.max}€`,
          value: state.price,
        })
      }

      if (state.ratingMin > 0) {
        filters.push({
          key: 'ratingMin',
          label: `Note: ${state.ratingMin}+ étoiles`,
          value: state.ratingMin,
        })
      }

      if (state.inStock) {
        filters.push({
          key: 'inStock',
          label: 'En stock seulement',
          value: true,
        })
      }

      if (state.ecoMin > 0) {
        filters.push({
          key: 'ecoMin',
          label: `Éco-score: ${state.ecoMin}+`,
          value: state.ecoMin,
        })
      }

      if (state.promo) {
        filters.push({
          key: 'promo',
          label: 'En promo',
          value: true,
        })
      }

      return filters
    },
  },

  actions: {
    // Hydrater les filtres depuis l'URL
    fromRoute(query) {
      this.q = query.q || ''
      this.category = query.category || null
      this.brands = query.brands
        ? Array.isArray(query.brands)
          ? query.brands
          : [query.brands]
        : []
      this.price = {
        min: query.price_min ? parseInt(query.price_min) : 0,
        max: query.price_max ? parseInt(query.price_max) : 1000,
      }
      this.ratingMin = query.rating_min ? parseInt(query.rating_min) : 0
      this.inStock = query.in_stock === 'true' || query.in_stock === true
      this.ecoMin = query.eco_min ? parseInt(query.eco_min) : 0
      this.promo = query.promo === 'true' || query.promo === true
      this.sort = query.sort || 'relevance'
      this.page = query.page ? parseInt(query.page) : 1
    },

    // Sérialiser en objet query pour l'URL
    toQuery() {
      const query = {}

      if (this.q) query.q = this.q
      if (this.category) query.category = this.category
      if (this.brands.length > 0) query.brands = this.brands
      if (this.price.min > 0) query.price_min = this.price.min
      if (this.price.max < 1000) query.price_max = this.price.max
      if (this.ratingMin > 0) query.rating_min = this.ratingMin
      if (this.inStock) query.in_stock = this.inStock
      if (this.ecoMin > 0) query.eco_min = this.ecoMin
      if (this.promo) query.promo = this.promo
      if (this.sort !== 'relevance') query.sort = this.sort
      if (this.page > 1) query.page = this.page

      return query
    },

    // Construire les paramètres pour l'API
    buildApiParams() {
      const params = {
        page: this.page,
        perPage: this.pageSize,
        sort: this.sort,
      }

      if (this.q) params.q = this.q
      if (this.category) params.category = this.category
      if (this.brands.length > 0) params.brands = this.brands
      if (this.price.min > 0) params.price_min = this.price.min
      if (this.price.max < 1000) params.price_max = this.price.max
      if (this.ratingMin > 0) params.rating_min = this.ratingMin
      if (this.inStock) params.in_stock = this.inStock
      if (this.ecoMin > 0) params.eco_min = this.ecoMin
      if (this.promo) params.promo = this.promo

      return params
    },

    // Vérifier si la requête a changé
    hasQueryChanged() {
      const currentQuery = JSON.stringify(this.buildApiParams())
      return currentQuery !== this.lastQuery
    },

    // Récupérer les produits
    async fetch() {
      if (!this.hasQueryChanged() && this.items.length > 0) {
        return // Éviter les requêtes inutiles
      }

      this.loading = true
      this.error = null
      this.page = 1 // Reset page pour nouvelle recherche

      try {
        const params = this.buildApiParams()
        const response = await api.get('/api/products', { params })

        if (response.data.success) {
          this.items = response.data.items || []
          this.total = response.data.total || 0
          this.lastQuery = JSON.stringify(params)
        } else {
          this.error = response.data.message || 'Erreur lors du chargement des produits'
          this.items = []
          this.total = 0
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des produits'
        this.items = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },

    // Charger la page suivante
    async fetchNext() {
      if (!this.hasMore || this.loading) return

      this.loading = true
      this.page += 1

      try {
        const params = this.buildApiParams()
        const response = await api.get('/api/products', { params })

        if (response.data.success) {
          this.items = [...this.items, ...(response.data.items || [])]
          this.total = response.data.total || 0
        }
      } catch (error) {
        this.page -= 1 // Revenir à la page précédente en cas d'erreur
        this.error = error.response?.data?.message || 'Erreur lors du chargement'
      } finally {
        this.loading = false
      }
    },

    // Réinitialiser tous les filtres
    resetFilters() {
      this.q = ''
      this.category = null
      this.brands = []
      this.price = { min: 0, max: 1000 }
      this.ratingMin = 0
      this.inStock = false
      this.ecoMin = 0
      this.promo = false
      this.sort = 'relevance'
      this.page = 1
      this.lastQuery = null
    },

    // Supprimer un filtre spécifique
    removeFilter(filterKey) {
      switch (filterKey) {
        case 'q':
          this.q = ''
          break
        case 'category':
          this.category = null
          break
        case 'brands':
          this.brands = []
          break
        case 'price':
          this.price = { min: 0, max: 1000 }
          break
        case 'ratingMin':
          this.ratingMin = 0
          break
        case 'inStock':
          this.inStock = false
          break
        case 'ecoMin':
          this.ecoMin = 0
          break
        case 'promo':
          this.promo = false
          break
      }
      this.page = 1
      this.lastQuery = null
    },

    // Mettre à jour un filtre
    updateFilter(key, value) {
      this[key] = value
      this.page = 1
      this.lastQuery = null
    },

    // Mettre à jour le tri
    updateSort(sort) {
      this.sort = sort
      this.page = 1
      this.lastQuery = null
    },

    // Effacer les erreurs
    clearError() {
      this.error = null
    },
  },
})
