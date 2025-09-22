// Configuration Stripe
export const STRIPE_CONFIG = {
  // Clé publique Stripe (à définir dans .env)
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,

  // Configuration par défaut
  defaultCurrency: 'EUR',
  defaultCountry: 'BE',

  // Options de paiement
  paymentMethods: {
    card: true,
    applePay: false, // TODO: implémenter
    googlePay: false, // TODO: implémenter
  },

  // Messages d'erreur
  errorMessages: {
    noKey: 'Clé publique Stripe manquante',
    initError: "Erreur d'initialisation du paiement",
    paymentFailed: 'Le paiement a été refusé',
    networkError: 'Erreur de connexion',
  },

  // Cartes de test
  testCards: {
    success: '4242 4242 4242 4242',
    threeDSecure: '4000 0027 6000 3184',
    declined: '4000 0000 0000 9995',
    incorrectCvc: '4000 0000 0000 0127',
    expired: '4000 0000 0000 0069',
  },
}
