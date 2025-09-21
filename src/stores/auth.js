import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token'),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    // Initialiser l'authentification au démarrage
    async initAuth() {
      if (this.token) {
        try {
          // Vérifier si le token est encore valide
          const response = await api.get('/api/user', {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          })

          if (response.data.success) {
            this.user = response.data.user
            this.setAuthHeader()
          } else {
            this.logout()
          }
        } catch (error) {
          console.error('Token invalide:', error)
          this.logout()
        }
      }
    },

    // Inscription
    async register(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/register', userData)

        if (response.data.success) {
          this.user = response.data.user
          this.token = response.data.token
          localStorage.setItem('auth_token', this.token)
          this.setAuthHeader()

          return { success: true, message: response.data.message }
        } else {
          this.error = response.data.message
          return { success: false, message: response.data.message }
        }
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de l'inscription"
        return {
          success: false,
          message: this.error,
          errors: error.response?.data?.errors,
        }
      } finally {
        this.loading = false
      }
    },

    // Connexion
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/api/login', credentials)

        if (response.data.success) {
          this.user = response.data.user
          this.token = response.data.token
          localStorage.setItem('auth_token', this.token)
          this.setAuthHeader()

          return { success: true, message: response.data.message }
        } else {
          this.error = response.data.message
          return { success: false, message: response.data.message }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la connexion'
        return {
          success: false,
          message: this.error,
          errors: error.response?.data?.errors,
        }
      } finally {
        this.loading = false
      }
    },

    // Déconnexion
    async logout() {
      try {
        if (this.token) {
          await api.post(
            '/api/logout',
            {},
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            },
          )
        }
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
      } finally {
        this.user = null
        this.token = null
        localStorage.removeItem('auth_token')
        this.clearAuthHeader()
      }
    },

    // Mettre à jour le profil
    async updateProfile(profileData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.put('/api/profile', profileData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })

        if (response.data.success) {
          this.user = response.data.user
          return { success: true, message: response.data.message }
        } else {
          this.error = response.data.message
          return { success: false, message: response.data.message }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour'
        return {
          success: false,
          message: this.error,
          errors: error.response?.data?.errors,
        }
      } finally {
        this.loading = false
      }
    },

    // Changer le mot de passe
    async changePassword(passwordData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.put('/api/change-password', passwordData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })

        if (response.data.success) {
          return { success: true, message: response.data.message }
        } else {
          this.error = response.data.message
          return { success: false, message: response.data.message }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du changement de mot de passe'
        return {
          success: false,
          message: this.error,
          errors: error.response?.data?.errors,
        }
      } finally {
        this.loading = false
      }
    },

    // Configurer l'en-tête d'authentification
    setAuthHeader() {
      if (this.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    },

    // Supprimer l'en-tête d'authentification
    clearAuthHeader() {
      delete api.defaults.headers.common['Authorization']
    },

    // Effacer les erreurs
    clearError() {
      this.error = null
    },
  },
})
