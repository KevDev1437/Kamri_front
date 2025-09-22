<template>
  <q-page class="checkout-page">
    <div class="container">
      <!-- Header -->
      <div class="text-center q-mb-xl">
        <h1 class="text-h4 text-weight-bold q-mb-sm">Paiement sécurisé</h1>
        <div class="text-body1 text-grey-7">
          Finalisez votre commande en quelques étapes simples
        </div>
      </div>

      <!-- Vérification panier vide -->
      <div v-if="cartStore.items.length === 0" class="text-center q-py-xl">
        <q-icon name="shopping_cart" size="64px" color="grey-5" />
        <div class="text-h6 q-mt-md text-grey-7">Votre panier est vide</div>
        <div class="text-body2 text-grey-6 q-mt-sm">
          Ajoutez des produits à votre panier avant de passer commande
        </div>
        <q-btn color="primary" label="Découvrir nos produits" to="/products" class="q-mt-md" />
      </div>

      <!-- Checkout principal -->
      <div v-else class="row q-col-gutter-xl">
        <!-- Stepper principal -->
        <div class="col-12" :class="$q.screen.gt.md ? 'col-8' : ''">
          <q-stepper
            v-model="currentStep"
            :vertical="$q.screen.lt.md"
            color="primary"
            animated
            flat
            bordered
          >
            <!-- Étape 1: Adresse & Contact -->
            <q-step
              :name="1"
              title="Adresse & Contact"
              icon="person"
              :done="currentStep > 1"
              :header-nav="currentStep > 1"
            >
              <q-form @submit.prevent="nextStep" class="q-gutter-md">
                <!-- Contact -->
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">
                      <q-icon name="contact_mail" class="q-mr-sm" />
                      Informations de contact
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="checkout.email"
                          type="email"
                          label="Email *"
                          outlined
                          :rules="[
                            (val) => !!val || 'L\'email est requis',
                            (val) => /.+@.+\..+/.test(val) || 'Email invalide',
                          ]"
                          @update:model-value="checkout.persist()"
                          aria-label="Adresse email"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="checkout.phone"
                          label="Téléphone"
                          outlined
                          @update:model-value="checkout.persist()"
                          aria-label="Numéro de téléphone"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Carnet d'adresses -->
                <q-card v-if="addressStore.count > 0" flat bordered class="q-mb-md">
                  <q-card-section>
                    <div class="text-h6 q-mb-md">
                      <q-icon name="bookmark" class="q-mr-sm" />
                      Choisir une adresse enregistrée
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-6">
                        <q-select
                          v-model="selectedShippingAddress"
                          :options="shippingAddressOptions"
                          label="Adresse de livraison"
                          outlined
                          clearable
                          @update:model-value="useShippingAddress"
                          aria-label="Choisir une adresse de livraison"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-select
                          v-model="selectedBillingAddress"
                          :options="billingAddressOptions"
                          label="Adresse de facturation"
                          outlined
                          clearable
                          @update:model-value="useBillingAddress"
                          aria-label="Choisir une adresse de facturation"
                        />
                      </div>
                    </div>
                    <div class="row q-gutter-sm q-mt-md">
                      <q-btn
                        color="primary"
                        outline
                        label="+ Nouvelle adresse"
                        icon="add"
                        @click="openAddressDialog"
                        aria-label="Ajouter une nouvelle adresse"
                      />
                      <q-btn
                        flat
                        color="primary"
                        label="Gérer mes adresses"
                        icon="settings"
                        to="/account/addresses"
                        aria-label="Gérer mes adresses"
                      />
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Adresse de livraison -->
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">
                      <q-icon name="local_shipping" class="q-mr-sm" />
                      Adresse de livraison
                      <q-btn
                        v-if="!isManualAddress"
                        flat
                        dense
                        label="Modifier"
                        color="primary"
                        @click="enableManualAddress"
                        class="q-ml-sm"
                        aria-label="Modifier l'adresse manuellement"
                      />
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="checkout.shippingAddress.firstName"
                          label="Prénom *"
                          outlined
                          :readonly="!isManualAddress"
                          :rules="[(val) => !!val || 'Le prénom est requis']"
                          @update:model-value="checkout.persist()"
                          aria-label="Prénom"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="checkout.shippingAddress.lastName"
                          label="Nom *"
                          outlined
                          :readonly="!isManualAddress"
                          :rules="[(val) => !!val || 'Le nom est requis']"
                          @update:model-value="checkout.persist()"
                          aria-label="Nom"
                        />
                      </div>
                      <div class="col-12">
                        <q-input
                          v-model="checkout.shippingAddress.line1"
                          label="Adresse ligne 1 *"
                          outlined
                          :readonly="!isManualAddress"
                          :rules="[(val) => !!val || 'L\'adresse est requise']"
                          @update:model-value="checkout.persist()"
                          aria-label="Adresse ligne 1"
                        />
                      </div>
                      <div class="col-12">
                        <q-input
                          v-model="checkout.shippingAddress.line2"
                          label="Adresse ligne 2"
                          outlined
                          :readonly="!isManualAddress"
                          @update:model-value="checkout.persist()"
                          aria-label="Adresse ligne 2"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-input
                          v-model="checkout.shippingAddress.city"
                          label="Ville *"
                          outlined
                          :readonly="!isManualAddress"
                          :rules="[(val) => !!val || 'La ville est requise']"
                          @update:model-value="checkout.persist()"
                          aria-label="Ville"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-input
                          v-model="checkout.shippingAddress.zip"
                          label="Code postal *"
                          outlined
                          :readonly="!isManualAddress"
                          :rules="[(val) => !!val || 'Le code postal est requis']"
                          @update:model-value="checkout.persist()"
                          aria-label="Code postal"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-select
                          v-model="checkout.shippingAddress.country"
                          :options="countryOptions"
                          label="Pays *"
                          :readonly="!isManualAddress"
                          outlined
                          @update:model-value="onCountryChange"
                          aria-label="Pays"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Adresse de facturation -->
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">
                      <q-icon name="receipt" class="q-mr-sm" />
                      Adresse de facturation
                    </div>
                    <q-toggle
                      v-model="checkout.useSameAddress"
                      label="Utiliser la même adresse pour la facturation"
                      @update:model-value="onSameAddressChange"
                      class="q-mb-md"
                    />

                    <div v-if="!checkout.useSameAddress" class="row q-col-gutter-md">
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="checkout.billingAddress.firstName"
                          label="Prénom *"
                          outlined
                          :rules="[(val) => !!val || 'Le prénom est requis']"
                          @update:model-value="checkout.persist()"
                          aria-label="Prénom facturation"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="checkout.billingAddress.lastName"
                          label="Nom *"
                          outlined
                          :rules="[(val) => !!val || 'Le nom est requis']"
                          @update:model-value="checkout.persist()"
                          aria-label="Nom facturation"
                        />
                      </div>
                      <div class="col-12">
                        <q-input
                          v-model="checkout.billingAddress.line1"
                          label="Adresse ligne 1 *"
                          outlined
                          :rules="[(val) => !!val || 'L\'adresse est requise']"
                          @update:model-value="checkout.persist()"
                          aria-label="Adresse facturation ligne 1"
                        />
                      </div>
                      <div class="col-12">
                        <q-input
                          v-model="checkout.billingAddress.line2"
                          label="Adresse ligne 2"
                          outlined
                          @update:model-value="checkout.persist()"
                          aria-label="Adresse facturation ligne 2"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-input
                          v-model="checkout.billingAddress.city"
                          label="Ville *"
                          outlined
                          :rules="[(val) => !!val || 'La ville est requise']"
                          @update:model-value="checkout.persist()"
                          aria-label="Ville facturation"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-input
                          v-model="checkout.billingAddress.zip"
                          label="Code postal *"
                          outlined
                          :rules="[(val) => !!val || 'Le code postal est requis']"
                          @update:model-value="checkout.persist()"
                          aria-label="Code postal facturation"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-select
                          v-model="checkout.billingAddress.country"
                          :options="countryOptions"
                          label="Pays *"
                          outlined
                          @update:model-value="checkout.persist()"
                          aria-label="Pays facturation"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-form>
            </q-step>

            <!-- Étape 2: Livraison -->
            <q-step
              :name="2"
              title="Livraison"
              icon="local_shipping"
              :done="currentStep > 2"
              :header-nav="currentStep > 2"
            >
              <q-form @submit.prevent="nextStep" class="q-gutter-md">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">
                      <q-icon name="local_shipping" class="q-mr-sm" />
                      Méthode de livraison
                    </div>

                    <!-- Loading skeleton -->
                    <div v-if="checkout.loading" class="q-gutter-md">
                      <q-skeleton type="rect" height="80px" v-for="n in 3" :key="n" />
                    </div>

                    <!-- Options de livraison -->
                    <div v-else-if="checkout.deliveryOptions.length > 0" class="q-gutter-sm">
                      <q-option-group
                        v-model="checkout.deliveryMethod"
                        :options="deliveryOptionsFormatted"
                        type="radio"
                        @update:model-value="onDeliveryChange"
                        aria-label="Méthodes de livraison"
                      />
                    </div>

                    <!-- Empty state -->
                    <div v-else class="text-center q-py-md">
                      <q-icon name="local_shipping" size="48px" color="grey-5" />
                      <div class="text-body2 text-grey-7 q-mt-sm">
                        Aucune option de livraison disponible
                      </div>
                      <q-btn
                        flat
                        color="primary"
                        label="Actualiser"
                        @click="checkout.fetchDeliveryOptions()"
                        class="q-mt-sm"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </q-form>
            </q-step>

            <!-- Étape 3: Paiement -->
            <q-step
              :name="3"
              title="Paiement"
              icon="payment"
              :done="currentStep > 3"
              :header-nav="currentStep > 3"
            >
              <q-form @submit.prevent="nextStep" class="q-gutter-md">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">
                      <q-icon name="payment" class="q-mr-sm" />
                      Mode de paiement
                    </div>

                    <q-btn-toggle
                      v-model="checkout.paymentMethod"
                      :options="checkout.paymentOptions"
                      @update:model-value="checkout.persist()"
                      class="full-width"
                      toggle-color="primary"
                      aria-label="Modes de paiement"
                    />

                    <!-- Intégration Stripe -->
                    <div v-if="checkout.paymentMethod === 'card'" class="q-mt-md">
                      <q-card flat bordered>
                        <q-card-section>
                          <div class="text-subtitle1 q-mb-sm">Montant à payer</div>
                          <div class="text-h5 text-primary">{{ formatPrice(checkout.total) }}</div>
                        </q-card-section>

                        <q-separator />

                        <q-card-section>
                          <div v-if="!clientSecret" class="q-pa-md">
                            <q-btn
                              color="primary"
                              :loading="loadingIntent"
                              label="Préparer le paiement"
                              @click="initPaymentIntent"
                              aria-label="Préparer le paiement"
                            />
                            <div class="text-caption text-grey-7 q-mt-sm">
                              Cliquez pour initialiser le paiement sécurisé.
                            </div>
                          </div>

                          <div v-else>
                            <StripePaymentElement
                              :client-secret="clientSecret"
                              :billing-details="billingForStripe"
                              @success="handlePaymentSuccess"
                              @error="handlePaymentError"
                              @ready="paymentReady = true"
                            />
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </q-card-section>
                </q-card>
              </q-form>
            </q-step>

            <!-- Étape 4: Récapitulatif -->
            <q-step
              :name="4"
              title="Récapitulatif"
              icon="receipt"
              :done="false"
              :header-nav="false"
            >
              <q-form @submit.prevent="placeOrder" class="q-gutter-md">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">
                      <q-icon name="receipt" class="q-mr-sm" />
                      Confirmation de commande
                    </div>

                    <div class="text-body1 q-mb-md">
                      Vérifiez les informations ci-dessous avant de confirmer votre commande.
                    </div>

                    <!-- Erreur -->
                    <q-banner v-if="checkout.error" class="bg-negative text-white q-mb-md" rounded>
                      <template #avatar>
                        <q-icon name="error" />
                      </template>
                      {{ checkout.error }}
                    </q-banner>

                    <!-- Bouton de confirmation -->
                    <div class="text-center q-mt-xl">
                      <q-btn
                        type="submit"
                        color="primary"
                        size="lg"
                        label="Confirmer et payer"
                        :loading="checkout.loading"
                        icon="payment"
                        class="full-width"
                        :disable="!canPlaceOrder"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </q-form>
            </q-step>
          </q-stepper>
        </div>

        <!-- Sidebar récap -->
        <div v-if="$q.screen.gt.md" class="col-4">
          <CheckoutSidebar />
        </div>
      </div>

      <!-- Sidebar mobile -->
      <div v-if="$q.screen.lt.lg" class="q-mt-xl">
        <CheckoutSidebar />
      </div>
    </div>

    <!-- Dialog pour ajouter une nouvelle adresse -->
    <q-dialog v-model="addressDialogOpen" persistent>
      <q-card style="min-width: 500px; max-width: 600px">
        <q-card-section>
          <div class="text-h6">Ajouter une nouvelle adresse</div>
        </q-card-section>

        <q-card-section>
          <AddressForm
            :model-value="newAddress"
            mode="create"
            :loading="addressLoading"
            @submit="handleAddressSubmit"
            @cancel="closeAddressDialog"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from 'stores/checkout'
import { useCartStore } from 'stores/cart'
import { useAuthStore } from 'stores/auth'
import { useAddressStore } from 'stores/address'
import { Notify } from 'quasar'
import { api } from 'boot/axios'
import CheckoutSidebar from 'components/CheckoutSidebar.vue'
import AddressForm from 'components/address/AddressForm.vue'
import StripePaymentElement from 'components/payment/StripePaymentElement.vue'

const router = useRouter()
const checkout = useCheckoutStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const addressStore = useAddressStore()

// State
const currentStep = ref(1)

// Options de pays
const countryOptions = [
  { label: 'Belgique', value: 'BE' },
  { label: 'France', value: 'FR' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Pays-Bas', value: 'NL' },
  { label: 'Allemagne', value: 'DE' },
]

// Computed
const deliveryOptionsFormatted = computed(() => {
  return checkout.deliveryOptions.map((option) => ({
    label: `${option.label} - ${option.eta} (${formatPrice(option.price)})`,
    value: option.code,
    ...option,
  }))
})

const canPlaceOrder = computed(() => {
  return (
    checkout.isAddressStepValid &&
    checkout.isDeliveryStepValid &&
    checkout.isPaymentStepValid &&
    cartStore.items.length > 0
  )
})

// Variables pour le carnet d'adresses
const selectedShippingAddress = ref(null)
const selectedBillingAddress = ref(null)
const isManualAddress = ref(true)
const addressDialogOpen = ref(false)
const newAddress = ref({})
const addressLoading = ref(false)

// Variables pour Stripe
const clientSecret = ref(null)
const loadingIntent = ref(false)
const paymentReady = ref(false)

// Options pour les sélecteurs d'adresses
const shippingAddressOptions = computed(() =>
  addressStore.items.map((address) => ({
    label: `${address.label} - ${address.firstName} ${address.lastName}, ${address.city}`,
    value: address.id,
    address,
  })),
)

const billingAddressOptions = computed(() =>
  addressStore.items.map((address) => ({
    label: `${address.label} - ${address.firstName} ${address.lastName}, ${address.city}`,
    value: address.id,
    address,
  })),
)

// Computed pour les billing details Stripe
const billingForStripe = computed(() => ({
  name: `${checkout.billingAddress.firstName || ''} ${checkout.billingAddress.lastName || ''}`.trim(),
  email: checkout.email || '',
  phone: checkout.phone || '',
  address: {
    line1: checkout.billingAddress.line1 || '',
    line2: checkout.billingAddress.line2 || '',
    city: checkout.billingAddress.city || '',
    postal_code: checkout.billingAddress.zip || '',
    country: checkout.billingAddress.country || 'BE',
  },
}))

// Méthodes
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const onCountryChange = () => {
  checkout.persist()
  // Recharger les options de livraison si le pays change
  checkout.fetchDeliveryOptions()
}

const onSameAddressChange = () => {
  checkout.setSameAddress(checkout.useSameAddress)
  checkout.persist()
}

const onDeliveryChange = () => {
  const selectedOption = checkout.deliveryOptions.find(
    (option) => option.code === checkout.deliveryMethod,
  )
  checkout.selectDelivery(selectedOption)
  checkout.persist()
}

const placeOrder = async () => {
  try {
    const result = await checkout.placeOrder()
    if (result.success) {
      Notify.create({
        type: 'positive',
        message: 'Commande créée avec succès !',
        position: 'top',
      })
      router.push(`/checkout/success/${result.orderId}`)
    }
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Erreur lors de la création de la commande',
      position: 'top',
    })
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

// Méthodes pour le carnet d'adresses
const useShippingAddress = (addressId) => {
  if (!addressId) {
    selectedShippingAddress.value = null
    isManualAddress.value = true
    return
  }

  const address = addressStore.getById(addressId)
  if (address) {
    checkout.shippingAddress = {
      firstName: address.firstName,
      lastName: address.lastName,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      zip: address.postalCode,
      country: address.country,
    }
    isManualAddress.value = false
    checkout.persist()
  }
}

const useBillingAddress = (addressId) => {
  if (!addressId) {
    selectedBillingAddress.value = null
    return
  }

  const address = addressStore.getById(addressId)
  if (address) {
    checkout.billingAddress = {
      firstName: address.firstName,
      lastName: address.lastName,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      zip: address.postalCode,
      country: address.country,
    }
    checkout.persist()
  }
}

const enableManualAddress = () => {
  isManualAddress.value = true
  selectedShippingAddress.value = null
  selectedBillingAddress.value = null
}

const openAddressDialog = () => {
  newAddress.value = {}
  addressDialogOpen.value = true
}

const closeAddressDialog = () => {
  addressDialogOpen.value = false
  newAddress.value = {}
}

const handleAddressSubmit = async (addressData) => {
  addressLoading.value = true
  try {
    const addressId = addressStore.add(addressData)
    if (addressId) {
      // Utiliser la nouvelle adresse
      useShippingAddress(addressId)
      selectedShippingAddress.value = addressId

      // Si c'est défini comme défaut, mettre à jour les sélecteurs
      if (addressData.isDefaultShipping) {
        selectedShippingAddress.value = addressId
      }
      if (addressData.isDefaultBilling) {
        selectedBillingAddress.value = addressId
        useBillingAddress(addressId)
      }

      closeAddressDialog()
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'adresse:", error)
  } finally {
    addressLoading.value = false
  }
}

// Méthodes pour Stripe
async function initPaymentIntent() {
  try {
    loadingIntent.value = true
    // Appel backend pour créer PaymentIntent
    // body minimal requis: amount (en cents), currency, metadata éventuelle
    const resp = await api.post('/api/payments/create-intent', {
      amount: Math.round(checkout.total * 100),
      currency: 'EUR',
    })
    clientSecret.value = resp.data?.client_secret || null
    if (!clientSecret.value) {
      throw new Error('client_secret manquant')
    }
    Notify.create({ type: 'positive', message: 'Paiement initialisé.' })
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: err?.message || 'Erreur init paiement' })
  } finally {
    loadingIntent.value = false
  }
}

async function handlePaymentSuccess() {
  // succeeded | processing...
  try {
    // Ici on finalise la commande côté backend (ou place l'ordre)
    // Tu as déjà un placeOrder() : on peut l'utiliser après paiement OK
    const order = await checkout.placeOrder() // Doit renvoyer { id, number, ... }
    cartStore.clear()
    Notify.create({ type: 'positive', message: 'Paiement confirmé. Commande créée.' })
    // redirection vers success
    // suppose /checkout/success/:orderId existe déjà
    window.location.assign(`/checkout/success/${order.id}`)
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'warning',
      message: 'Paiement OK mais création commande a échoué. Contactez le support.',
    })
  }
}

function handlePaymentError(message) {
  Notify.create({ type: 'negative', message: message || 'Paiement refusé.' })
}

// Lifecycle
onMounted(async () => {
  // Vérifier si le panier est vide
  if (cartStore.items.length === 0) {
    Notify.create({
      type: 'info',
      message: 'Votre panier est vide',
      position: 'top',
    })
    router.push('/products')
    return
  }

  // Restaurer l'état du checkout
  checkout.restore()

  // Restaurer le carnet d'adresses
  addressStore.restore()

  // Préremplir depuis l'utilisateur connecté
  checkout.hydrateFromUser(authStore.user)

  // Pré-sélectionner les adresses par défaut
  if (addressStore.shippingDefault) {
    selectedShippingAddress.value = addressStore.shippingDefault.id
    useShippingAddress(addressStore.shippingDefault.id)
  }
  if (addressStore.billingDefault) {
    selectedBillingAddress.value = addressStore.billingDefault.id
    useBillingAddress(addressStore.billingDefault.id)
  }

  // Calculer les totaux
  checkout.computeTotals()

  // Charger les options de livraison
  await checkout.fetchDeliveryOptions()
})

// Watchers pour la persistance
watch(
  () => checkout.email,
  () => checkout.persist(),
)

watch(
  () => checkout.phone,
  () => checkout.persist(),
)

watch(
  () => checkout.shippingAddress,
  () => checkout.persist(),
  { deep: true },
)

watch(
  () => checkout.billingAddress,
  () => checkout.persist(),
  { deep: true },
)

watch(
  () => checkout.paymentMethod,
  () => checkout.persist(),
)
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
</style>
