import { defineStore } from 'pinia'
import { Notify } from 'quasar'

export const useAddressStore = defineStore('address', {
  state: () => ({
    items: [], // [{ id, label, firstName, lastName, line1, line2, city, postalCode, country, phone, isDefaultShipping, isDefaultBilling }]
    loading: false,
    error: null,
    lastId: 0,
  }),

  getters: {
    count: (state) => state.items.length,
    shippingDefault: (state) => state.items.find((a) => a.isDefaultShipping) || null,
    billingDefault: (state) => state.items.find((a) => a.isDefaultBilling) || null,
    getById: (state) => (id) => state.items.find((a) => a.id === id) || null,
    hasReachedLimit: (state) => state.items.length >= 10, // Limite de 10 adresses
  },

  actions: {
    restore() {
      try {
        const raw = localStorage.getItem('address_book')
        if (raw) this.items = JSON.parse(raw)
        const last = localStorage.getItem('address_last_id')
        this.lastId = last ? parseInt(last) : this.items.at(-1)?.id || 0
      } catch (e) {
        console.error('restore address_book failed', e)
        this.items = []
        this.lastId = 0
      }
    },

    persist() {
      try {
        localStorage.setItem('address_book', JSON.stringify(this.items))
        localStorage.setItem('address_last_id', String(this.lastId))
      } catch (e) {
        console.error('persist address_book failed', e)
      }
    },

    add(addr) {
      if (this.hasReachedLimit) {
        Notify.create({
          type: 'negative',
          message: 'Limite de 10 adresses atteinte',
          position: 'top',
        })
        return null
      }

      // Un seul défaut livraison / facturation
      if (addr.isDefaultShipping) this._clearDefault('shipping')
      if (addr.isDefaultBilling) this._clearDefault('billing')

      this.lastId += 1
      const newAddress = { id: this.lastId, ...addr }
      this.items.push(newAddress)
      this.persist()

      Notify.create({
        type: 'positive',
        message: 'Adresse ajoutée avec succès',
        position: 'top',
      })

      return this.lastId
    },

    update(id, patch) {
      const i = this.items.findIndex((a) => a.id === id)
      if (i === -1) {
        Notify.create({
          type: 'negative',
          message: 'Adresse introuvable',
          position: 'top',
        })
        return
      }

      // Gestion défauts
      if (patch.isDefaultShipping) this._clearDefault('shipping', id)
      if (patch.isDefaultBilling) this._clearDefault('billing', id)

      this.items[i] = { ...this.items[i], ...patch }
      this.persist()

      Notify.create({
        type: 'positive',
        message: 'Adresse mise à jour avec succès',
        position: 'top',
      })
    },

    remove(id) {
      const i = this.items.findIndex((a) => a.id === id)
      if (i === -1) {
        Notify.create({
          type: 'negative',
          message: 'Adresse introuvable',
          position: 'top',
        })
        return
      }

      const wasShipDef = this.items[i].isDefaultShipping
      const wasBillDef = this.items[i].isDefaultBilling
      this.items.splice(i, 1)

      // Si on supprime l'adresse défaut, réaffecter la première si dispo
      if (wasShipDef && this.items[0]) this.items[0].isDefaultShipping = true
      if (wasBillDef && this.items[0]) this.items[0].isDefaultBilling = true

      this.persist()

      Notify.create({
        type: 'info',
        message: 'Adresse supprimée',
        position: 'top',
      })
    },

    setDefaultShipping(id) {
      this._clearDefault('shipping')
      const a = this.getById(id)
      if (!a) {
        Notify.create({
          type: 'negative',
          message: 'Adresse introuvable',
          position: 'top',
        })
        return
      }
      a.isDefaultShipping = true
      this.persist()

      Notify.create({
        type: 'positive',
        message: 'Adresse de livraison par défaut mise à jour',
        position: 'top',
      })
    },

    setDefaultBilling(id) {
      this._clearDefault('billing')
      const a = this.getById(id)
      if (!a) {
        Notify.create({
          type: 'negative',
          message: 'Adresse introuvable',
          position: 'top',
        })
        return
      }
      a.isDefaultBilling = true
      this.persist()

      Notify.create({
        type: 'positive',
        message: 'Adresse de facturation par défaut mise à jour',
        position: 'top',
      })
    },

    _clearDefault(type, keepId = null) {
      const key = type === 'shipping' ? 'isDefaultShipping' : 'isDefaultBilling'
      this.items.forEach((a) => {
        if (a.id !== keepId) a[key] = false
      })
    },

    // Optionnel : API si backend dispo (Laravel)
    async syncFromApi() {
      // TODO: Implémenter quand l'API sera prête
      // GET /api/addresses
      return Promise.resolve()
    },

    async pushToApi() {
      // TODO: Implémenter quand l'API sera prête
      // POST /api/addresses
      return Promise.resolve()
    },

    async updateToApi() {
      // TODO: Implémenter quand l'API sera prête
      // PUT /api/addresses/:id
      return Promise.resolve()
    },

    async deleteFromApi() {
      // TODO: Implémenter quand l'API sera prête
      // DELETE /api/addresses/:id
      return Promise.resolve()
    },

    // Effacer les erreurs
    clearError() {
      this.error = null
    },
  },
})
