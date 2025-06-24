<template>
  <footer class="bg-dark text-white q-pa-lg">
    <!-- Sections principales -->
    <div class="row q-col-gutter-xl justify-center">
      <!-- À propos -->
      <div class="col-12 col-sm-6 col-md-3">
        <h6 class="text-weight-bold q-mb-md">À propos</h6>
        <q-list dense>
          <q-item clickable to="/about">
            <q-item-section>Notre histoire</q-item-section>
          </q-item>
          <q-item clickable to="/careers">
            <q-item-section>Carrières</q-item-section>
          </q-item>
          <q-item clickable to="/affiliate">
            <q-item-section>Programme d'affiliation</q-item-section>
          </q-item>
          <q-item clickable to="/press">
            <q-item-section>Presse</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Support -->
      <div class="col-12 col-sm-6 col-md-3">
        <h6 class="text-weight-bold q-mb-md">Support</h6>
        <q-list dense>
          <q-item clickable to="/faq">
            <q-item-section>FAQ</q-item-section>
          </q-item>
          <q-item clickable to="/contact">
            <q-item-section>Contactez-nous</q-item-section>
          </q-item>
          <q-item clickable to="/shipping">
            <q-item-section>Livraison</q-item-section>
          </q-item>
          <q-item clickable to="/returns">
            <q-item-section>Retours</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Légal -->
      <div class="col-12 col-sm-6 col-md-3">
        <h6 class="text-weight-bold q-mb-md">Légal</h6>
        <q-list dense>
          <q-item clickable to="/terms">
            <q-item-section>CGV</q-item-section>
          </q-item>
          <q-item clickable to="/privacy">
            <q-item-section>Confidentialité</q-item-section>
          </q-item>
          <q-item clickable to="/cookies">
            <q-item-section>Cookies</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- App Mobile -->
      <div class="col-12 col-sm-6 col-md-3">
        <h6 class="text-weight-bold q-mb-md">Application Mobile</h6>
        <div class="column q-gutter-y-sm">
          <div class="row items-center q-gutter-x-sm">
            <q-icon name="notifications" size="xs" />
            <span>Alertes de baisse de prix</span>
          </div>
          <div class="row items-center q-gutter-x-sm">
            <q-icon name="local_shipping" size="xs" />
            <span>Suivi de commandes</span>
          </div>
          <div class="row items-center q-gutter-x-sm">
            <q-icon name="local_offer" size="xs" />
            <span>Offres exclusives</span>
          </div>
        </div>
        <!-- App store buttons -->
        <div class="row q-col-gutter-sm q-mt-md">
          <div class="col-6">
            <q-btn flat class="full-width bg-white" href="#" target="_blank">
              <q-img src="/images/app-store-badge.png" alt="App Store" style="height: 40px" />
            </q-btn>
          </div>
          <div class="col-6">
            <q-btn flat class="full-width bg-white" href="#" target="_blank">
              <q-img src="/images/google-play-badge.png" alt="Google Play" style="height: 40px" />
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Réseaux sociaux + Paiements -->
    <div class="row items-center justify-between q-mt-xl">
      <!-- Réseaux sociaux -->
      <div class="col-12 col-md-auto q-mb-md q-mb-md-0">
        <div class="text-subtitle2 q-mb-sm">Suivez-nous</div>
        <div class="row q-gutter-md">
          <q-btn round flat color="white" icon="fab fa-facebook" href="#" target="_blank" />
          <q-btn round flat color="white" icon="fab fa-instagram" href="#" target="_blank" />
          <q-btn round flat color="white" icon="fab fa-twitter" href="#" target="_blank" />
          <q-btn round flat color="white" icon="fab fa-youtube" href="#" target="_blank" />
        </div>
      </div>

      <!-- Moyens de paiement -->
      <div class="col-12 col-md-auto">
        <div class="row q-col-gutter-md justify-center justify-md-end items-center">
          <q-icon name="fab fa-cc-visa" size="2em" />
          <q-icon name="fab fa-cc-mastercard" size="2em" />
          <q-icon name="fab fa-cc-paypal" size="2em" />
          <q-icon name="fab fa-apple-pay" size="2em" />
          <q-icon name="fab fa-google-pay" size="2em" />
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="text-center q-mt-xl text-caption">
      <p class="q-mb-xs">&copy; {{ new Date().getFullYear() }} Marché KAMRI. Tous droits réservés.</p>
      <div class="row justify-center q-gutter-x-md">
        <router-link to="/terms" class="text-white">Conditions d'utilisation</router-link>
        <router-link to="/privacy" class="text-white">Politique de confidentialité</router-link>
        <router-link to="/cookies" class="text-white">Paramètres des cookies</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Pas de logique nécessaire pour l'instant
</script>

<style scoped>
footer {
  background: #2D3748;
}

.text-white {
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.text-white:hover {
  opacity: 1;
}

.q-item {
  min-height: 32px;
}
</style>
