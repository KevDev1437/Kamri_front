import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useLiveStore = defineStore('live', {
  state: () => ({
    currentStream: null,
    scheduledStreams: [],
    loading: false,
    error: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getCurrentStream: (state) => state.currentStream,
    getScheduledStreams: (state) => state.scheduledStreams,
    isLive: (state) => state.currentStream?.is_live || false,
  },

  actions: {
    async fetchCurrentStream() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/live')
        this.currentStream = response.data
      } catch (error) {
        this.error = 'Erreur lors du chargement du stream'
        console.error('Error fetching current stream:', error)

        // Fallback avec un stream par défaut
        this.currentStream = {
          url: 'https://via.placeholder.com/800x450/FF6B6B/FFFFFF?text=LIVE+SHOPPING',
          title: 'Shopping Live - Nouvelle Collection',
          description: 'Découvrez notre nouvelle collection avec des offres exclusives !',
          is_live: true,
          viewer_count: 127,
        }
      } finally {
        this.loading = false
      }
    },

    async fetchScheduledStreams() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/api/live/scheduled')
        this.scheduledStreams = response.data
      } catch (error) {
        this.error = 'Erreur lors du chargement des streams programmés'
        console.error('Error fetching scheduled streams:', error)
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
})
