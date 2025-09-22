import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useCartStore } from 'stores/cart'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    // Contact
    email: '',
    phone: '',

    // Adresses
    shippingAddress: {
      firstName: '',
      lastName: '',
      line1: '',
      line2: '',
      city: '',
      zip: '',
      country: 'BE',
    },
    billingAddress: {
      firstName: '',
      lastName: '',
      line1: '',
      line2: '',
      city: '',
      zip: '',
      country: 'BE',
    },
    useSameAddress: true,

    // Livraison
    deliveryMethod: null, // 'standard' | 'express' | ...
    deliveryOptions: [], // récupérées depuis API
    shippingPrice: 0,

    // Paiement
    paymentMethod: 'card', // 'card' | 'paypal' | 'cod'
    cardToken: null, // si Stripe (placeholder)

    // Prix
    coupon: null,
    discount: 0,
    tax: 0,
    subtotal: 0,
    total: 0,

    loading: false,
    error: null,
  }),

  getters: {
    isAddressStepValid: (state) =>
      state.email &&
      state.shippingAddress.firstName &&
      state.shippingAddress.lastName &&
      state.shippingAddress.line1 &&
      state.shippingAddress.city &&
      state.shippingAddress.zip,

    isDeliveryStepValid: (state) => !!state.deliveryMethod,

    isPaymentStepValid: (state) => !!state.paymentMethod,

    // Options de paiement
    paymentOptions: () => [
      { label: 'Carte bancaire', value: 'card', icon: 'credit_card' },
      { label: 'PayPal', value: 'paypal', icon: 'paypal' },
      { label: 'Paiement à la livraison', value: 'cod', icon: 'local_shipping' },
    ],
  },

  actions: {
    // Préremplir depuis l'utilisateur connecté
    hydrateFromUser(user) {
      if (!user) return
      this.email = this.email || user.email
      this.phone = this.phone || user.phone || ''
    },

    // Gérer l'adresse de facturation
    setSameAddress(flag) {
      this.useSameAddress = flag
      if (flag) {
        this.billingAddress = { ...this.shippingAddress }
      }
    },

    // Récupérer les options de livraison
    async fetchDeliveryOptions() {
      // Éviter les appels si le total est 0
      if (this.total <= 0) {
        this.deliveryOptions = []
        return
      }

      this.loading = true
      try {
        const { data } = await api.get('/api/shipping/methods', {
          params: { country: this.shippingAddress.country },
        })
        this.deliveryOptions = data?.methods || []
      } catch (error) {
        this.error =
          error.response?.data?.message || 'Erreur lors du chargement des options de livraison'
      } finally {
        this.loading = false
      }
    },

    // Sélectionner une méthode de livraison
    selectDelivery(method) {
      this.deliveryMethod = method?.code || null
      this.shippingPrice = method?.price || 0
      this.computeTotals()
    },

    // Appliquer un coupon
    async applyCoupon(code) {
      if (!code) return

      try {
        // TODO: Appeler /api/coupons/validate
        // Pour l'instant, simulation
        if (code.toLowerCase() === 'welcome10') {
          this.coupon = code
          this.discount = Math.round(this.subtotal * 0.1 * 100) / 100 // 10% de réduction
          this.computeTotals()
          return { success: true, message: 'Coupon appliqué avec succès' }
        } else {
          return { success: false, message: 'Code coupon invalide' }
        }
      } catch {
        return { success: false, message: 'Erreur lors de la validation du coupon' }
      }
    },

    // Retirer le coupon
    removeCoupon() {
      this.coupon = null
      this.discount = 0
      this.computeTotals()
    },

    // Calculer les totaux
    computeTotals() {
      const cart = useCartStore()
      this.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
      this.tax = Math.round(this.subtotal * 0.21 * 100) / 100 // TVA 21%
      this.total = Math.max(0, this.subtotal + this.shippingPrice + this.tax - this.discount)
    },

    // Passer la commande
    async placeOrder() {
      this.loading = true
      try {
        const cart = useCartStore()
        const payload = {
          email: this.email,
          phone: this.phone,
          shippingAddress: this.shippingAddress,
          billingAddress: this.useSameAddress ? this.shippingAddress : this.billingAddress,
          deliveryMethod: this.deliveryMethod,
          paymentMethod: this.paymentMethod,
          coupon: this.coupon,
          items: cart.items.map((item) => ({
            id: item.id,
            qty: item.qty,
            price: item.price,
            variant: item.variant || null,
          })),
        }

        const { data } = await api.post('/api/checkout', payload)
        const orderId = data?.order?.id || data?.orderId

        if (orderId) {
          // Vider le panier après commande réussie
          cart.clear()
          // Nettoyer l'état du checkout
          this.reset()
          return { success: true, orderId }
        } else {
          throw new Error('Aucun ID de commande reçu')
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création de la commande'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Persister l'état dans localStorage
    persist() {
      try {
        const stateToSave = {
          email: this.email,
          phone: this.phone,
          shippingAddress: this.shippingAddress,
          billingAddress: this.billingAddress,
          useSameAddress: this.useSameAddress,
          deliveryMethod: this.deliveryMethod,
          paymentMethod: this.paymentMethod,
          coupon: this.coupon,
        }
        localStorage.setItem('checkout_state', JSON.stringify(stateToSave))
      } catch (error) {
        console.warn("Impossible de sauvegarder l'état du checkout:", error)
      }
    },

    // Restaurer l'état depuis localStorage
    restore() {
      try {
        const raw = localStorage.getItem('checkout_state')
        if (!raw) return

        const savedState = JSON.parse(raw)
        this.email = savedState.email || ''
        this.phone = savedState.phone || ''
        this.shippingAddress = { ...this.shippingAddress, ...savedState.shippingAddress }
        this.billingAddress = { ...this.billingAddress, ...savedState.billingAddress }
        this.useSameAddress = savedState.useSameAddress ?? true
        this.deliveryMethod = savedState.deliveryMethod || null
        this.paymentMethod = savedState.paymentMethod || 'card'
        this.coupon = savedState.coupon || null

        // Recalculer les totaux
        this.computeTotals()
      } catch (error) {
        console.warn("Impossible de restaurer l'état du checkout:", error)
      }
    },

    // Réinitialiser l'état
    reset() {
      this.$reset()
      localStorage.removeItem('checkout_state')
    },

    // Effacer les erreurs
    clearError() {
      this.error = null
    },
  },
})
