import { defineStore } from 'pinia'

const STORAGE_KEY = 'kamri_cart_v1'
const TAX_RATE = 0.21

function makeKey(id, color, size) {
  return [id, color || '', size || ''].join('::')
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: {},
    isOpen: false,
  }),

  getters: {
    list: (state) => Object.values(state.items),
    count: (state) => Object.values(state.items).reduce((a, i) => a + i.qty, 0),
    totalTTC: (state) => Object.values(state.items).reduce((a, i) => a + i.price * i.qty, 0),
    totalHT() {
      return this.totalTTC / (1 + TAX_RATE)
    },
    tva() {
      return this.totalTTC - this.totalHT
    },
  },

  actions: {
    add(product, qty = 1, variant = {}) {
      const { id, name, price, image } = product
      const color = variant?.color ?? product.color ?? null
      const size = variant?.size ?? product.size ?? null

      const key = makeKey(id, color, size)
      const safeQty = Math.max(1, Number(qty || 1))

      if (this.items[key]) {
        this.items[key].qty += safeQty
      } else {
        this.items[key] = { id, name, price, image, color, size, qty: safeQty }
      }
      this.persist()
      this.isOpen = true
    },

    remove(key) {
      delete this.items[key]
      this.persist()
    },

    updateQty(key, qty) {
      const safe = Math.max(1, Number(qty || 1))
      if (this.items[key]) {
        this.items[key].qty = safe
        this.persist()
      }
    },

    clear() {
      this.items = {}
      this.persist()
    },

    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    },

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          this.items = parsed.items || {}
        }
      } catch {
        // ignore
      }
    },

    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: this.items }))
    },

    keyOf(item) {
      return makeKey(item.id, item.color, item.size)
    },

    // Déplacer un item vers la wishlist
    moveToWishlist(key) {
      const item = this.items[key]
      if (!item) return false

      // Ajouter à la wishlist
      const { useWishlistStore } = require('stores/wishlist')
      const wishlistStore = useWishlistStore()

      const product = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        color: item.color,
        size: item.size,
      }

      wishlistStore.add(product)

      // Retirer du panier
      this.remove(key)

      return true
    },
  },
})
