import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import { useLocaleStore } from 'src/stores/locale'
import { loadMessages } from 'src/i18n'

export default boot(async ({ app }) => {
  const localeStore = useLocaleStore()
  localeStore.restore()

  const i18n = createI18n({
    legacy: false,
    locale: localeStore.locale || 'fr',
    fallbackLocale: 'fr',
    messages: { fr: await loadMessages('fr') },
  })

  app.use(i18n)

  // Update <html> lang/dir
  const applyHtml = () => {
    const el = document.documentElement
    el.setAttribute('lang', localeStore.locale)
    el.setAttribute('dir', localeStore.isRTL ? 'rtl' : 'ltr')
  }
  applyHtml()

  // Watch for locale changes
  localeStore.$subscribe((mutation, state) => {
    if (mutation.events?.key === 'locale') {
      // Load new locale messages if needed
      loadMessages(state.locale).then((messages) => {
        i18n.global.setLocaleMessage(state.locale, messages)
        i18n.global.locale.value = state.locale
        applyHtml()
      })
    }
  })
})
