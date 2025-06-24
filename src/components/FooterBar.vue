<template>
  <div>
    <div class="row justify-center text-white">
      <div class="column q-pa-md">
        <h6 class="text-white">À propos</h6>
        <q-list dense>
          <q-item clickable to="/about"><q-item-section>Notre histoire</q-item-section></q-item>
          <q-item clickable to="/careers"><q-item-section>Carrières</q-item-section></q-item>
        </q-list>
      </div>
      <div class="column q-pa-md">
        <h6 class="text-white">Support</h6>
        <q-list dense>
          <q-item clickable to="/faq"><q-item-section>FAQ</q-item-section></q-item>
          <q-item clickable to="/contact"><q-item-section>Contactez-nous</q-item-section></q-item>
        </q-list>
      </div>
      <div class="column q-pa-md">
        <h6 class="text-white">Légal</h6>
        <q-list dense>
          <q-item clickable to="/terms"><q-item-section>CGV</q-item-section></q-item>
          <q-item clickable to="/privacy"><q-item-section>Confidentialité</q-item-section></q-item>
        </q-list>
      </div>
    </div>
    <div class="text-center text-white q-pa-sm">
      &copy; 2025 Marché KAMRI. Tous droits réservés.
    </div>
  </div>
</template>
