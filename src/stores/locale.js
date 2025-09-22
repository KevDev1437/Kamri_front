import { defineStore } from 'pinia'

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    locale: 'fr',
    currency: 'EUR',
    supportedLocales: ['fr', 'en'],
    supportedCurrencies: ['EUR', 'USD'],
    rates: { EUR: 1, USD: 1.08 },
  }),

  getters: {
    isRTL: () => false,
    numberFmt: (state) => (n) => new Intl.NumberFormat(state.locale).format(n),
    dateFmt: (state) => (d) => new Intl.DateTimeFormat(state.locale).format(new Date(d)),
    priceFmt:
      (state) =>
      (amount, currency = state.currency) =>
        new Intl.NumberFormat(state.locale, { style: 'currency', currency }).format(amount),
  },

  actions: {
    setLocale(l) {
      if (this.supportedLocales.includes(l)) {
        this.locale = l
        this.persist()
      }
    },
    setCurrency(c) {
      if (this.supportedCurrencies.includes(c)) {
        this.currency = c
        this.persist()
      }
    },
    convert(amount, from = 'EUR', to = this.currency) {
      const rFrom = this.rates[from] || 1
      const rTo = this.rates[to] || 1
      return (amount / rFrom) * rTo
    },
    restore() {
      const l = localStorage.getItem('kamri_locale')
      const c = localStorage.getItem('kamri_currency')
      if (l) this.locale = l
      if (c) this.currency = c
    },
    persist() {
      localStorage.setItem('kamri_locale', this.locale)
      localStorage.setItem('kamri_currency', this.currency)
    },
  },
})
