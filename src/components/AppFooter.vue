&lt;template&gt;
  &lt;footer class=&quot;bg-dark text-white q-pa-lg&quot;&gt;
    &lt;div class=&quot;row q-col-gutter-lg&quot;&gt;
      &lt;!-- Nous connaître --&gt;
      &lt;div class=&quot;col-12 col-sm-6 col-md-3&quot;&gt;
        &lt;h6 class=&quot;text-weight-bold q-mb-md&quot;&gt;Nous connaître&lt;/h6&gt;
        &lt;div class=&quot;column q-gutter-y-sm&quot;&gt;
          &lt;router-link to=&quot;/about&quot; class=&quot;text-white&quot;&gt;À propos de Kamri&lt;/router-link&gt;
          &lt;router-link to=&quot;/shopping&quot; class=&quot;text-white&quot;&gt;Kamri – Achats et Mode en Ligne&lt;/router-link&gt;
          &lt;router-link to=&quot;/affiliate&quot; class=&quot;text-white&quot;&gt;Affilié et influenceur : gagnez une commission&lt;/router-link&gt;
          &lt;router-link to=&quot;/contact&quot; class=&quot;text-white&quot;&gt;Contactez-nous&lt;/router-link&gt;
          &lt;router-link to=&quot;/legal&quot; class=&quot;text-white&quot;&gt;Mentions légales&lt;/router-link&gt;
          &lt;router-link to=&quot;/careers&quot; class=&quot;text-white&quot;&gt;Carrières&lt;/router-link&gt;
          &lt;router-link to=&quot;/press&quot; class=&quot;text-white&quot;&gt;Presse&lt;/router-link&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- Service client --&gt;
      &lt;div class=&quot;col-12 col-sm-6 col-md-3&quot;&gt;
        &lt;h6 class=&quot;text-weight-bold q-mb-md&quot;&gt;Service client&lt;/h6&gt;
        &lt;div class=&quot;column q-gutter-y-sm&quot;&gt;
          &lt;router-link to=&quot;/returns&quot; class=&quot;text-white&quot;&gt;Politique de retour et de remboursement&lt;/router-link&gt;
          &lt;router-link to=&quot;/intellectual-property&quot; class=&quot;text-white&quot;&gt;Politique en matière de propriété intellectuelle&lt;/router-link&gt;
          &lt;router-link to=&quot;/shipping&quot; class=&quot;text-white&quot;&gt;Informations de livraison&lt;/router-link&gt;
          &lt;router-link to=&quot;/security-alerts&quot; class=&quot;text-white&quot;&gt;Alertes sur la sécurité des produits&lt;/router-link&gt;
          &lt;router-link to=&quot;/report&quot; class=&quot;text-white&quot;&gt;Signaler une activité suspecte&lt;/router-link&gt;
          &lt;router-link to=&quot;/minimum-order&quot; class=&quot;text-white&quot;&gt;Montant minimum de commande&lt;/router-link&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- Aide --&gt;
      &lt;div class=&quot;col-12 col-sm-6 col-md-3&quot;&gt;
        &lt;h6 class=&quot;text-weight-bold q-mb-md&quot;&gt;Aide&lt;/h6&gt;
        &lt;div class=&quot;column q-gutter-y-sm&quot;&gt;
          &lt;router-link to=&quot;/faq&quot; class=&quot;text-white&quot;&gt;Centre d'aide et FAQ&lt;/router-link&gt;
          &lt;router-link to=&quot;/security&quot; class=&quot;text-white&quot;&gt;Centre de sécurité&lt;/router-link&gt;
          &lt;router-link to=&quot;/buyer-protection&quot; class=&quot;text-white&quot;&gt;Protection des achats sur Kamri&lt;/router-link&gt;
          &lt;router-link to=&quot;/partnership&quot; class=&quot;text-white&quot;&gt;Devenir partenaire de Kamri&lt;/router-link&gt;
          &lt;router-link to=&quot;/dsa&quot; class=&quot;text-white&quot;&gt;Règlement sur les services numériques (DSA)&lt;/router-link&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- Téléchargez l'app --&gt;
      &lt;div class=&quot;col-12 col-sm-6 col-md-3&quot;&gt;
        &lt;h6 class=&quot;text-weight-bold q-mb-md&quot;&gt;Téléchargez l'app Kamri&lt;/h6&gt;

        &lt;!-- Features list --&gt;
        &lt;div class=&quot;column q-gutter-y-sm q-mb-md&quot;&gt;
          &lt;div class=&quot;row items-center q-gutter-x-sm&quot;&gt;
            &lt;q-icon name=&quot;notifications&quot; size=&quot;xs&quot; /&gt;
            &lt;span&gt;Alertes de baisse de prix&lt;/span&gt;
          &lt;/div&gt;
          &lt;div class=&quot;row items-center q-gutter-x-sm&quot;&gt;
            &lt;q-icon name=&quot;local_shipping&quot; size=&quot;xs&quot; /&gt;
            &lt;span&gt;Suivez vos commandes&lt;/span&gt;
          &lt;/div&gt;
          &lt;div class=&quot;row items-center q-gutter-x-sm&quot;&gt;
            &lt;q-icon name=&quot;payments&quot; size=&quot;xs&quot; /&gt;
            &lt;span&gt;Paiement plus rapide&lt;/span&gt;
          &lt;/div&gt;
          &lt;div class=&quot;row items-center q-gutter-x-sm&quot;&gt;
            &lt;q-icon name=&quot;local_offer&quot; size=&quot;xs&quot; /&gt;
            &lt;span&gt;Offres exclusives&lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;!-- App store buttons --&gt;
        &lt;div class=&quot;row q-col-gutter-sm&quot;&gt;
          &lt;div class=&quot;col-6&quot;&gt;
            &lt;q-btn flat class=&quot;full-width&quot; href=&quot;https://apps.apple.com/your-app&quot; target=&quot;_blank&quot;&gt;
              &lt;img src=&quot;/images/app-store-badge.png&quot; alt=&quot;Télécharger sur l'App Store&quot; style=&quot;height: 40px&quot;&gt;
            &lt;/q-btn&gt;
          &lt;/div&gt;
          &lt;div class=&quot;col-6&quot;&gt;
            &lt;q-btn flat class=&quot;full-width&quot; href=&quot;https://play.google.com/store/your-app&quot; target=&quot;_blank&quot;&gt;
              &lt;img src=&quot;/images/google-play-badge.png&quot; alt=&quot;Disponible sur Google Play&quot; style=&quot;height: 40px&quot;&gt;
            &lt;/q-btn&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- Social Media + Certifications --&gt;
    &lt;div class=&quot;row items-center justify-between q-mt-xl&quot;&gt;
      &lt;!-- Social Media --&gt;
      &lt;div class=&quot;col-12 col-md-auto q-mb-md q-mb-md-0&quot;&gt;
        &lt;div class=&quot;text-subtitle2 q-mb-sm&quot;&gt;Connectez-vous avec Kamri&lt;/div&gt;
        &lt;div class=&quot;row q-gutter-md&quot;&gt;
          &lt;q-btn round flat color=&quot;white&quot; icon=&quot;fab fa-instagram&quot; href=&quot;#&quot; target=&quot;_blank&quot; /&gt;
          &lt;q-btn round flat color=&quot;white&quot; icon=&quot;fab fa-facebook&quot; href=&quot;#&quot; target=&quot;_blank&quot; /&gt;
          &lt;q-btn round flat color=&quot;white&quot; icon=&quot;fab fa-twitter&quot; href=&quot;#&quot; target=&quot;_blank&quot; /&gt;
          &lt;q-btn round flat color=&quot;white&quot; icon=&quot;fab fa-tiktok&quot; href=&quot;#&quot; target=&quot;_blank&quot; /&gt;
          &lt;q-btn round flat color=&quot;white&quot; icon=&quot;fab fa-youtube&quot; href=&quot;#&quot; target=&quot;_blank&quot; /&gt;
          &lt;q-btn round flat color=&quot;white&quot; icon=&quot;fab fa-pinterest&quot; href=&quot;#&quot; target=&quot;_blank&quot; /&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- Certifications --&gt;
      &lt;div class=&quot;col-12 col-md-auto&quot;&gt;
        &lt;div class=&quot;row q-col-gutter-md justify-center justify-md-end&quot;&gt;
          &lt;img src=&quot;/images/certif/visa.png&quot; alt=&quot;Visa&quot; style=&quot;height: 30px&quot;&gt;
          &lt;img src=&quot;/images/certif/mastercard.png&quot; alt=&quot;Mastercard&quot; style=&quot;height: 30px&quot;&gt;
          &lt;img src=&quot;/images/certif/paypal.png&quot; alt=&quot;PayPal&quot; style=&quot;height: 30px&quot;&gt;
          &lt;img src=&quot;/images/certif/apple-pay.png&quot; alt=&quot;Apple Pay&quot; style=&quot;height: 30px&quot;&gt;
          &lt;img src=&quot;/images/certif/google-pay.png&quot; alt=&quot;Google Pay&quot; style=&quot;height: 30px&quot;&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- Copyright --&gt;
    &lt;div class=&quot;text-center q-mt-xl text-caption&quot;&gt;
      &lt;p class=&quot;q-mb-xs&quot;&gt;© {{ new Date().getFullYear() }} Kamri Inc. Tous droits réservés.&lt;/p&gt;
      &lt;div class=&quot;row justify-center q-gutter-x-md&quot;&gt;
        &lt;router-link to=&quot;/terms&quot; class=&quot;text-white&quot;&gt;Conditions d'utilisation&lt;/router-link&gt;
        &lt;router-link to=&quot;/privacy&quot; class=&quot;text-white&quot;&gt;Politique de confidentialité&lt;/router-link&gt;
        &lt;router-link to=&quot;/cookies&quot; class=&quot;text-white&quot;&gt;Vos choix en matière de cookies&lt;/router-link&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/footer&gt;
&lt;/template&gt;

&lt;script setup&gt;
// Aucune logique nécessaire pour l'instant
&lt;/script&gt;

&lt;style scoped&gt;
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
&lt;/style&gt;
