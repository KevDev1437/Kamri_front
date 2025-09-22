import { useAuthStore } from 'stores/auth'

export default ({ router }) => {
  router.beforeEach((to) => {
    const auth = useAuthStore()

    // Route protégée - utilisateur non connecté
    if (to.meta?.requiresAuth && !auth.isAuthenticated) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    // Route pour invités seulement - utilisateur connecté
    if (to.meta?.guestOnly && auth.isAuthenticated) {
      return { path: '/' }
    }
  })
}
