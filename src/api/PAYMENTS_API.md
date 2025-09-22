# API Paiements (Stripe) — Backend Laravel

## 1) Créer un PaymentIntent

**POST** `/api/payments/create-intent`

### Body JSON:

```json
{
  "amount": 6490, // en cents
  "currency": "EUR",
  "metadata": { "cartId": "abc123" } // optionnel
}
```

### Réponse:

```json
{
  "success": true,
  "client_secret": "pi_XXX_secret_YYY"
}
```

### Erreurs possibles:

- `400 Bad Request` : montant invalide
- `401 Unauthorized` : utilisateur non connecté
- `500 Internal Server Error` : erreur Stripe

## 2) Webhooks Stripe (recommandé)

**POST** `/api/payments/webhook`

### Événements minimum à gérer:

- `payment_intent.succeeded` → marquer la commande payée
- `payment_intent.payment_failed` → log + e-mail éventuel
- `charge.refunded` → statut remboursé

### Vérification de la signature du webhook:

```php
$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$endpoint_secret = config('services.stripe.webhook_secret');

try {
    $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
} catch(\UnexpectedValueException $e) {
    // Invalid payload
    http_response_code(400);
    exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    // Invalid signature
    http_response_code(400);
    exit();
}
```

## 3) Stratégies recommandées

### Option A (simple) - Actuellement implémentée:

1. Frontend → `POST /api/payments/create-intent` → backend crée PaymentIntent, retourne `client_secret`
2. Frontend confirme le paiement avec `client_secret`
3. Après succès, Frontend appelle `/api/checkout` pour créer la commande
4. Frontend redirige vers `/checkout/success/:orderId`

### Option B (robuste) - Recommandée pour la production:

1. Frontend → `POST /api/checkout/init` → backend crée Order "pending" + PaymentIntent, retourne `client_secret` + `order_id`
2. Frontend confirme le paiement avec `client_secret`
3. Webhook Stripe `payment_intent.succeeded` → backend marque Order `paid`
4. Frontend redirige vers `/checkout/success/:orderId`

## 4) Configuration Laravel

### .env

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### config/services.php

```php
'stripe' => [
    'model' => App\Models\User::class,
    'key' => env('STRIPE_KEY'),
    'secret' => env('STRIPE_SECRET'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
],
```

## 5) Exemple d'implémentation Laravel

### Controller PaymentController.php

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|integer|min:50', // minimum 50 centimes
            'currency' => 'required|string|in:EUR',
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount,
                'currency' => $request->currency,
                'metadata' => $request->metadata ?? [],
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return response()->json([
                'success' => true,
                'client_secret' => $paymentIntent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du PaymentIntent',
            ], 500);
        }
    }

    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch(\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'payment_intent.succeeded':
                $paymentIntent = $event->data->object;
                // Marquer la commande comme payée
                $this->handlePaymentSucceeded($paymentIntent);
                break;
            case 'payment_intent.payment_failed':
                $paymentIntent = $event->data->object;
                // Log l'échec du paiement
                $this->handlePaymentFailed($paymentIntent);
                break;
            default:
                // Log des événements non gérés
                \Log::info('Unhandled event type: ' . $event->type);
        }

        return response()->json(['status' => 'success']);
    }

    private function handlePaymentSucceeded($paymentIntent)
    {
        // Récupérer la commande via metadata ou autre
        // Marquer comme payée
        \Log::info('Payment succeeded: ' . $paymentIntent->id);
    }

    private function handlePaymentFailed($paymentIntent)
    {
        // Log l'échec
        \Log::error('Payment failed: ' . $paymentIntent->id);
    }
}
```

### Routes api.php

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/payments/create-intent', [PaymentController::class, 'createIntent']);
});

// Webhook Stripe (sans middleware auth)
Route::post('/payments/webhook', [PaymentController::class, 'webhook']);
```

## 6) Cartes de test Stripe

### Cartes de test pour le développement:

- **Succès** : `4242 4242 4242 4242`
- **3D Secure** : `4000 0027 6000 3184`
- **Échec** : `4000 0000 0000 9995`
- **CVC incorrect** : `4000 0000 0000 0127`
- **Date expirée** : `4000 0000 0000 0069`

### Codes 3D Secure:

- **Succès** : `1234`
- **Échec** : `0000`

## 7) Sécurité

### Côté Frontend:

- ✅ Clé publique Stripe uniquement
- ✅ Validation côté backend
- ✅ HTTPS obligatoire en production

### Côté Backend:

- ✅ Clé secrète Stripe sécurisée
- ✅ Vérification signature webhook
- ✅ Validation des montants
- ✅ Logs des transactions

## 8) Monitoring & Logs

### Événements à logger:

- Création PaymentIntent
- Succès/échec paiement
- Erreurs Stripe
- Webhooks reçus

### Métriques à surveiller:

- Taux de succès des paiements
- Temps de réponse Stripe
- Erreurs 3D Secure
- Échecs de webhooks

## 9) Migration vers Option B (recommandée)

### Étapes de migration:

1. Créer endpoint `/api/checkout/init` qui crée Order + PaymentIntent
2. Modifier frontend pour utiliser le nouvel endpoint
3. Implémenter webhooks pour marquer les commandes payées
4. Tester en mode test Stripe
5. Déployer en production

### Avantages Option B:

- ✅ Commandes créées même si paiement échoue
- ✅ Gestion robuste des webhooks
- ✅ Possibilité de retry automatique
- ✅ Meilleure traçabilité
- ✅ Conformité PCI DSS
