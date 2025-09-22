import { defineStore } from 'pinia'
import { Notify } from 'quasar'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [], // array de product {id, name, price, image, ...}
    loading: false,
    error: null,
  }),

  getters: {
    ids: (state) => new Set(state.items.map((p) => p.id)),
    count: (state) => state.items.length,
    has: (state) => (id) => state.items.some((p) => p.id === id),
    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    // Restaurer depuis localStorage
    restore() {
      try {
        const raw = localStorage.getItem('wishlist_items')
        if (!raw) return

        const savedItems = JSON.parse(raw)
        this.items = savedItems || []
      } catch (error) {
        console.warn('Impossible de restaurer la wishlist:', error)
        this.items = []
      }
    },

    // Persister dans localStorage
    persist() {
      try {
        localStorage.setItem('wishlist_items', JSON.stringify(this.items))
      } catch (error) {
        console.warn('Impossible de sauvegarder la wishlist:', error)
      }
    },

    // Ajouter un produit à la wishlist
    add(product) {
      if (this.has(product.id)) {
        Notify.create({
          type: 'info',
          message: 'Ce produit est déjà dans votre wishlist',
          position: 'top',
        })
        return
      }

      this.items.push(product)
      this.persist()

      Notify.create({
        type: 'positive',
        message: 'Produit ajouté à votre wishlist',
        position: 'top',
      })

      // Tenter de synchroniser avec l'API si connecté
      this.pushToApi(product)
    },

    // Retirer un produit de la wishlist
    remove(id) {
      const index = this.items.findIndex((p) => p.id === id)
      if (index === -1) return

      this.items.splice(index, 1)
      this.persist()

      Notify.create({
        type: 'info',
        message: 'Produit retiré de votre wishlist',
        position: 'top',
      })

      // Tenter de synchroniser avec l'API si connecté
      this.deleteFromApi(id)
    },

    // Toggle ajouter/retirer
    toggle(product) {
      if (this.has(product.id)) {
        this.remove(product.id)
      } else {
        this.add(product)
      }
    },

    // Vider la wishlist
    clear() {
      this.items = []
      this.persist()

      Notify.create({
        type: 'info',
        message: 'Wishlist vidée',
        position: 'top',
      })
    },

    // Ajouter tous les produits au panier
    addAllToCart() {
      if (this.isEmpty) return

      const { useCartStore } = require('stores/cart')
      const cartStore = useCartStore()

      let addedCount = 0
      this.items.forEach((product) => {
        if (cartStore.add(product, 1)) {
          addedCount++
        }
      })

      if (addedCount > 0) {
        Notify.create({
          type: 'positive',
          message: `${addedCount} produit${addedCount > 1 ? 's' : ''} ajouté${addedCount > 1 ? 's' : ''} au panier`,
          position: 'top',
        })
      }
    },

    // Synchroniser depuis l'API (si connecté)
    async syncFromApi() {
      // TODO: Implémenter quand l'API sera prête
      // Pour l'instant, on garde seulement la logique locale
      return Promise.resolve()
    },

    // Pousser un produit vers l'API (si connecté)
    async pushToApi() {
      // TODO: Implémenter quand l'API sera prête
      // Pour l'instant, on garde seulement la logique locale
      return Promise.resolve()
    },

    // Supprimer un produit de l'API (si connecté)
    async deleteFromApi() {
      // TODO: Implémenter quand l'API sera prête
      // Pour l'instant, on garde seulement la logique locale
      return Promise.resolve()
    },

    // Effacer les erreurs
    clearError() {
      this.error = null
    },
  },
})
