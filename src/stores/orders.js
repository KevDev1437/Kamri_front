import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    // Données
    items: [],
    total: 0,
    loading: false,
    error: null,

    // Pagination
    page: 1,
    pageSize: 10,

    // Filtres
    q: '',
    status: null, // 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled'
    dateFrom: null,
    dateTo: null,

    // Détail d'une commande
    currentOrder: null,
    loadingDetail: false,
    errorDetail: null,
  }),

  getters: {
    hasMore: (state) => state.total > state.items.length,

    activeFiltersCount: (state) => {
      let count = 0
      if (state.q) count++
      if (state.status) count++
      if (state.dateFrom) count++
      if (state.dateTo) count++
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

      if (state.status) {
        const statusLabels = {
          pending: 'En attente',
          paid: 'Payée',
          shipped: 'Expédiée',
          delivered: 'Livrée',
          canceled: 'Annulée',
        }
        filters.push({
          key: 'status',
          label: `Statut: ${statusLabels[state.status] || state.status}`,
          value: state.status,
        })
      }

      if (state.dateFrom) {
        filters.push({
          key: 'dateFrom',
          label: `Depuis: ${new Date(state.dateFrom).toLocaleDateString('fr-FR')}`,
          value: state.dateFrom,
        })
      }

      if (state.dateTo) {
        filters.push({
          key: 'dateTo',
          label: `Jusqu'à: ${new Date(state.dateTo).toLocaleDateString('fr-FR')}`,
          value: state.dateTo,
        })
      }

      return filters
    },

    // Options de statut pour les filtres
    statusOptions: () => [
      { label: 'Tous les statuts', value: null },
      { label: 'En attente', value: 'pending' },
      { label: 'Payée', value: 'paid' },
      { label: 'Expédiée', value: 'shipped' },
      { label: 'Livrée', value: 'delivered' },
      { label: 'Annulée', value: 'canceled' },
    ],
  },

  actions: {
    // Construire les paramètres pour l'API
    buildApiParams() {
      const params = {
        page: this.page,
        perPage: this.pageSize,
      }

      if (this.q) params.q = this.q
      if (this.status) params.status = this.status
      if (this.dateFrom) params.date_from = this.dateFrom
      if (this.dateTo) params.date_to = this.dateTo

      return params
    },

    // Récupérer la liste des commandes
    async fetch() {
      this.loading = true
      this.error = null

      try {
        const params = this.buildApiParams()
        const response = await api.get('/api/orders', { params })

        if (response.data.success) {
          this.items = response.data.items || []
          this.total = response.data.total || 0
        } else {
          this.error = response.data.message || 'Erreur lors du chargement des commandes'
          this.items = []
          this.total = 0
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des commandes'
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
        const response = await api.get('/api/orders', { params })

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

    // Récupérer le détail d'une commande
    async fetchOne(id) {
      this.loadingDetail = true
      this.errorDetail = null

      try {
        const response = await api.get(`/api/orders/${id}`)

        if (response.data.success) {
          this.currentOrder = response.data.order
          return { success: true, order: this.currentOrder }
        } else {
          this.errorDetail = response.data.message || 'Commande non trouvée'
          this.currentOrder = null
          return { success: false, message: this.errorDetail }
        }
      } catch (error) {
        this.errorDetail =
          error.response?.data?.message || 'Erreur lors du chargement de la commande'
        this.currentOrder = null
        return { success: false, message: this.errorDetail }
      } finally {
        this.loadingDetail = false
      }
    },

    // Re-commander
    async reorder(id) {
      try {
        const response = await api.post(`/api/orders/${id}/reorder`)

        if (response.data.success) {
          return { success: true, message: response.data.message || 'Commande ajoutée au panier' }
        } else {
          return {
            success: false,
            message: response.data.message || 'Erreur lors de la re-commande',
          }
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Erreur lors de la re-commande',
        }
      }
    },

    // Télécharger la facture
    async downloadInvoice(id) {
      try {
        const response = await api.get(`/api/orders/${id}/invoice`, {
          responseType: 'blob',
        })

        // Créer un blob et déclencher le téléchargement
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        // Récupérer le nom du fichier depuis les headers ou utiliser un nom par défaut
        const contentDisposition = response.headers['content-disposition']
        let filename = `facture-${id}.pdf`
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }

        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        return { success: true, message: 'Facture téléchargée avec succès' }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Erreur lors du téléchargement de la facture',
        }
      }
    },

    // Réinitialiser tous les filtres
    resetFilters() {
      this.q = ''
      this.status = null
      this.dateFrom = null
      this.dateTo = null
      this.page = 1
    },

    // Supprimer un filtre spécifique
    removeFilter(filterKey) {
      switch (filterKey) {
        case 'q':
          this.q = ''
          break
        case 'status':
          this.status = null
          break
        case 'dateFrom':
          this.dateFrom = null
          break
        case 'dateTo':
          this.dateTo = null
          break
      }
      this.page = 1
    },

    // Mettre à jour un filtre
    updateFilter(key, value) {
      this[key] = value
      this.page = 1
    },

    // Effacer les erreurs
    clearError() {
      this.error = null
    },

    clearDetailError() {
      this.errorDetail = null
    },
  },
})
