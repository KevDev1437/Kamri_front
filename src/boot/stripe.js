import { loadStripe } from '@stripe/stripe-js'

let stripePromise = null

export function getStripe() {
  if (!stripePromise) {
    const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!pk) {
      // Ne crashe pas : on laisse un message en console
      console.warn('[Stripe] VITE_STRIPE_PUBLISHABLE_KEY manquant')
    }
    stripePromise = loadStripe(pk)
  }
  return stripePromise
}
