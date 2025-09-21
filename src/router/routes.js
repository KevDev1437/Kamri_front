// src/router/routes.js
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/HomePage.vue') },
      { path: 'search', name: 'search', component: () => import('pages/SearchPage.vue') },
      { path: 'product/:id', name: 'product', component: () => import('pages/ProductPage.vue') },
      { path: 'category/:id', name: 'category', component: () => import('pages/CategoryPage.vue') },
      { path: 'login', name: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/RegisterPage.vue') },
      {
        path: 'account',
        name: 'account',
        redirect: '/account/profile',
        children: [
          {
            path: 'profile',
            name: 'account-profile',
            component: () => import('pages/account/ProfilePage.vue'),
          },
          {
            path: 'orders',
            name: 'account-orders',
            component: () => import('pages/account/OrdersPage.vue'),
          },
          {
            path: 'wishlist',
            name: 'account-wishlist',
            component: () => import('pages/account/WishlistPage.vue'),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
