import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'http://localhost:8000' })

// Variables pour gérer le refresh token
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

export default defineBoot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  // Request interceptor - injecter automatiquement le token
  api.interceptors.request.use(
    (config) => {
      // Éviter les boucles infinies
      if (config._retry) {
        return config
      }

      // Récupérer le token depuis le store auth
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // Response interceptor - gérer les 401 et refresh token
  api.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config

      // Gérer les erreurs 5xx
      if (error.response?.status >= 500) {
        Notify.create({
          type: 'negative',
          message: 'Une erreur serveur est survenue. Veuillez réessayer.',
          position: 'top',
        })
        return Promise.reject(error)
      }

      // Gérer les 401 (non autorisé)
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Si un refresh est déjà en cours, ajouter à la file d'attente
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return api(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Tenter de rafraîchir le token
          const refreshResponse = await api.post('/api/refresh')

          if (refreshResponse.data.success) {
            const newToken = refreshResponse.data.token
            localStorage.setItem('auth_token', newToken)
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

            processQueue(null, newToken)

            // Rejouer la requête originale
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          } else {
            throw new Error('Refresh failed')
          }
        } catch (refreshError) {
          // Refresh échoué - déconnecter l'utilisateur
          processQueue(refreshError, null)

          // Nettoyer le localStorage et les headers
          localStorage.removeItem('auth_token')
          delete api.defaults.headers.common['Authorization']

          // Rediriger vers login avec la page actuelle
          const currentPath = router.currentRoute.value.fullPath
          router.push({
            path: '/login',
            query: { redirect: currentPath },
          })

          Notify.create({
            type: 'negative',
            message: 'Votre session a expiré. Veuillez vous reconnecter.',
            position: 'top',
          })

          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    },
  )
})

export { api }
