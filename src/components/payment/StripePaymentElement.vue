<template>
  <div class="q-gutter-md">
    <div v-if="!ready" class="q-pa-md">
      <q-skeleton type="rect" height="48px" />
      <q-skeleton type="rect" height="24px" />
    </div>

    <div v-show="ready">
      <!-- Le conteneur Stripe -->
      <div
        ref="elementHost"
        class="stripe-element-host"
        aria-label="Formulaire de paiement sécurisé"
      ></div>

      <!-- Boutons -->
      <div class="row items-center justify-between q-mt-md">
        <div class="text-caption text-grey-7">
          <q-icon name="lock" size="16px" class="q-mr-xs" />
          Paiement sécurisé par Stripe
        </div>
        <q-btn
          color="primary"
          :loading="submitting"
          :disable="!ready || submitting"
          label="Payer maintenant"
          @click="onPay"
          aria-label="Confirmer le paiement"
        />
      </div>
    </div>

    <q-banner
      v-if="errorMessage"
      class="bg-negative text-white q-mt-sm"
      rounded
      dense
      role="alert"
      aria-live="assertive"
    >
      <q-icon name="error" class="q-mr-sm" />
      {{ errorMessage }}
    </q-banner>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getStripe } from 'boot/stripe'

const props = defineProps({
  clientSecret: { type: String, required: true },
  billingDetails: { type: Object, default: () => ({}) },
  returnUrl: { type: String, default: null }, // optionnel si on veut un redirect
})

const emit = defineEmits(['success', 'error', 'ready'])

const stripe = ref(null)
const elements = ref(null)
const paymentElement = ref(null)

const elementHost = ref(null)
const ready = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    stripe.value = await getStripe()
    if (!stripe.value) {
      errorMessage.value = 'Stripe non initialisé. Clé publique manquante.'
      return
    }
    elements.value = stripe.value.elements({ clientSecret: props.clientSecret })
    paymentElement.value = elements.value.create('payment')
    paymentElement.value.on('ready', () => {
      ready.value = true
      emit('ready')
    })
    paymentElement.value.mount(elementHost.value)
  } catch (err) {
    errorMessage.value = err?.message || "Erreur d'initialisation du paiement."
    emit('error', errorMessage.value)
  }
})

onBeforeUnmount(() => {
  if (paymentElement.value) paymentElement.value.unmount()
  elements.value = null
})

async function onPay() {
  if (!stripe.value || !elements.value) return
  submitting.value = true
  errorMessage.value = ''

  // Billing details optionnels
  const params = {}
  if (props.returnUrl) params.redirect = 'if_required'

  try {
    const { error, paymentIntent } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: props.returnUrl || window.location.origin + '/checkout',
        payment_method_data: {
          billing_details: props.billingDetails,
        },
      },
      ...params,
    })

    if (error) {
      // 3DS échoué / carte refusée / etc.
      errorMessage.value = error.message || 'Le paiement a été refusé.'
      emit('error', errorMessage.value)
    } else if (paymentIntent && paymentIntent.status) {
      // succeeded | processing | requires_payment_method
      emit('success', paymentIntent)
    }
  } catch (err) {
    errorMessage.value = err?.message || 'Erreur lors de la confirmation du paiement.'
    emit('error', errorMessage.value)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.stripe-element-host {
  padding: 12px;
  border: 1px solid var(--q-grey-4);
  border-radius: 8px;
  background: white;
}
</style>
