import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import { useMeta } from 'quasar'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Fallback canonical pour les pages qui n'ont pas de SEO
  const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:9000'

  Router.afterEach((to) => {
    const canonical = SITE_URL.replace(/\/+$/, '') + (to.fullPath || '/')
    // Fallback très light: si aucune page n'a mis de meta, on met au moins canonical
    useMeta({
      link: [{ rel: 'canonical', href: canonical }],
    })
  })

  return Router
})
