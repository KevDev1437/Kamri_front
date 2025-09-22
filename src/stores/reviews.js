import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Notify } from 'quasar'

export const useReviewsStore = defineStore('reviews', {
  state: () => ({
    items: [], // avis affichés
    total: 0, // total avis
    loading: false,
    error: null,

    // Filtres & tri
    productId: null,
    rating: null, // number | null (ex: 4 = >=4)
    withPhotos: false,
    sort: 'recent', // 'recent' | 'top' | 'rating_desc' | 'rating_asc'
    page: 1,
    pageSize: 10,

    // Résumé
    average: 0,
    counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  }),

  getters: {
    hasMore: (state) => state.total > state.items.length,

    hasActiveFilters: (state) => {
      return state.rating !== null || state.withPhotos !== false
    },

    activeFiltersCount: (state) => {
      let count = 0
      if (state.rating !== null) count++
      if (state.withPhotos) count++
      return count
    },

    activeFilters: (state) => {
      const filters = []
      if (state.rating !== null) {
        filters.push({
          key: 'rating',
          label: `≥${state.rating}★`,
          value: state.rating,
        })
      }
      if (state.withPhotos) {
        filters.push({
          key: 'withPhotos',
          label: 'Avec photos',
          value: state.withPhotos,
        })
      }
      return filters
    },

    // Options de tri
    sortOptions: () => [
      { label: 'Plus récents', value: 'recent' },
      { label: 'Plus utiles', value: 'top' },
      { label: 'Note décroissante', value: 'rating_desc' },
      { label: 'Note croissante', value: 'rating_asc' },
    ],
  },

  actions: {
    // Hydrate les filtres depuis les query params de l'URL
    fromRoute(query) {
      this.rating = query.rating ? parseInt(query.rating) : null
      this.withPhotos = query.with_photos === 'true'
      this.sort = query.sort || 'recent'
      this.page = query.page ? parseInt(query.page) : 1
    },

    // Sérialise les filtres en objet query pour l'URL
    toQuery() {
      const query = {}
      if (this.rating !== null) query.rating = this.rating
      if (this.withPhotos) query.with_photos = true
      if (this.sort !== 'recent') query.sort = this.sort
      if (this.page > 1) query.page = this.page
      return query
    },

    // Réinitialise tous les filtres aux valeurs par défaut
    resetFilters() {
      this.rating = null
      this.withPhotos = false
      this.sort = 'recent'
      this.page = 1
    },

    // Supprime un filtre spécifique
    removeFilter(key) {
      if (key === 'rating') this.rating = null
      if (key === 'withPhotos') this.withPhotos = false
      this.page = 1 // Toujours réinitialiser la page après un changement de filtre
    },

    // Récupère les avis depuis l'API
    async fetch(productId) {
      this.loading = true
      this.error = null
      this.productId = productId

      try {
        const params = {
          page: this.page,
          perPage: this.pageSize,
          sort: this.sort,
        }

        if (this.rating !== null) params.rating = this.rating
        if (this.withPhotos) params.with_photos = this.withPhotos

        const response = await api.get(`/api/products/${productId}/reviews`, { params })

        if (response.data.success) {
          this.items = response.data.items
          this.total = response.data.total
          this.average = response.data.average
          this.counts = response.data.counts
        } else {
          this.error = response.data.message || 'Erreur lors du chargement des avis'
          Notify.create({
            type: 'negative',
            message: this.error,
            position: 'top',
          })
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des avis'
        Notify.create({
          type: 'negative',
          message: this.error,
          position: 'top',
        })
      } finally {
        this.loading = false
      }
    },

    // Charge la page suivante et concatène les résultats
    async fetchNext() {
      if (this.loading || !this.hasMore) return

      this.loading = true
      this.error = null
      this.page++ // Incrémente la page pour la prochaine requête

      try {
        const params = {
          page: this.page,
          perPage: this.pageSize,
          sort: this.sort,
        }

        if (this.rating !== null) params.rating = this.rating
        if (this.withPhotos) params.with_photos = this.withPhotos

        const response = await api.get(`/api/products/${this.productId}/reviews`, { params })

        if (response.data.success) {
          this.items = [...this.items, ...response.data.items] // Concaténer les nouveaux items
          this.total = response.data.total
          // Ne pas mettre à jour average et counts ici pour éviter les conflits
        } else {
          this.error = response.data.message || 'Erreur lors du chargement des avis'
          Notify.create({
            type: 'negative',
            message: this.error,
            position: 'top',
          })
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des avis'
        Notify.create({
          type: 'negative',
          message: this.error,
          position: 'top',
        })
      } finally {
        this.loading = false
      }
    },

    // Poste un nouvel avis
    async post(review) {
      this.loading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('rating', review.rating)
        formData.append('comment', review.comment)
        formData.append('anonymous', review.anonymous || false)

        // Ajouter les photos si présentes
        if (review.photos && review.photos.length > 0) {
          review.photos.forEach((photo, index) => {
            formData.append(`photos[${index}]`, photo)
          })
        }

        const response = await api.post(`/api/products/${this.productId}/reviews`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.data.success) {
          Notify.create({
            type: 'positive',
            message: 'Avis publié avec succès',
            position: 'top',
          })
          // Recharger la liste des avis
          await this.fetch(this.productId)
          return { success: true, message: 'Avis publié avec succès' }
        } else {
          this.error = response.data.message || "Erreur lors de la publication de l'avis"
          return { success: false, message: this.error }
        }
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de la publication de l'avis"
        Notify.create({
          type: 'negative',
          message: this.error,
          position: 'top',
        })
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    // Vote "utile" pour un avis
    async voteHelpful(id) {
      try {
        const response = await api.post(`/api/reviews/${id}/helpful`)
        if (response.data.success) {
          // Mettre à jour le compteur localement
          const review = this.items.find((item) => item.id === id)
          if (review) {
            review.helpfulCount = response.data.helpfulCount
          }
          return { success: true, helpfulCount: response.data.helpfulCount }
        } else {
          return { success: false, message: response.data.message }
        }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Erreur lors du vote' }
      }
    },

    // Signaler un avis
    async report(id) {
      try {
        const response = await api.post(`/api/reviews/${id}/report`)
        if (response.data.success) {
          Notify.create({
            type: 'positive',
            message: 'Avis signalé avec succès',
            position: 'top',
          })
          return { success: true }
        } else {
          return { success: false, message: response.data.message }
        }
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Erreur lors du signalement',
          position: 'top',
        })
        return {
          success: false,
          message: error.response?.data?.message || 'Erreur lors du signalement',
        }
      }
    },

    // Vérifier si l'utilisateur a déjà voté "utile" pour un avis
    hasVotedHelpful(id) {
      return localStorage.getItem(`helpful_${id}`) === 'true'
    },

    // Marquer un vote "utile" comme fait
    markVotedHelpful(id) {
      localStorage.setItem(`helpful_${id}`, 'true')
    },

    // Vérifier si l'utilisateur a déjà signalé un avis
    hasReported(id) {
      return localStorage.getItem(`reported_${id}`) === 'true'
    },

    // Marquer un signalement comme fait
    markReported(id) {
      localStorage.setItem(`reported_${id}`, 'true')
    },

    // Effacer les erreurs
    clearError() {
      this.error = null
    },
  },
})
