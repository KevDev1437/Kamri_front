// src/router/routes.js
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/HomePage.vue') },
      { path: 'search', name: 'search', component: () => import('pages/SearchPage.vue') },
      {
        path: 'product/:id',
        name: 'product',
        component: () => import('pages/ProductDetailPage.vue'),
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('pages/ProductsPage.vue'),
      },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            name: 'checkout-main',
            component: () => import('pages/checkout/CheckoutPage.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'success/:orderId',
            name: 'checkout-success',
            component: () => import('pages/checkout/CheckoutSuccessPage.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      { path: 'category/:id', name: 'category', component: () => import('pages/CategoryPage.vue') },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/RegisterPage.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('pages/auth/ForgotPasswordPage.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('pages/auth/ResetPasswordPage.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'account',
        name: 'account',
        redirect: '/account/profile',
        meta: { requiresAuth: true },
        children: [
          {
            path: 'profile',
            name: 'account-profile',
            component: () => import('pages/account/ProfilePage.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'orders',
            name: 'account-orders',
            component: () => import('pages/account/OrdersPage.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'orders/:id',
            name: 'account-order-detail',
            component: () => import('pages/account/OrderDetailPage.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'wishlist',
            name: 'account-wishlist',
            component: () => import('pages/account/WishlistPage.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'addresses',
            name: 'account-addresses',
            component: () => import('pages/account/AddressesPage.vue'),
            meta: { requiresAuth: true },
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
