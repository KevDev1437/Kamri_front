# API Checkout - Endpoints Attendus

## GET /api/shipping/methods

Récupère les méthodes de livraison disponibles pour un pays donné.

### Paramètres de requête

| Paramètre | Type   | Description   | Exemple      |
| --------- | ------ | ------------- | ------------ |
| `country` | string | Code pays ISO | `country=BE` |

### Réponse

```json
{
  "success": true,
  "methods": [
    {
      "code": "standard",
      "label": "Livraison Standard",
      "eta": "2-3 jours ouvrables",
      "price": 4.99,
      "description": "Livraison standard avec suivi"
    },
    {
      "code": "express",
      "label": "Livraison Express",
      "eta": "1 jour ouvrable",
      "price": 9.99,
      "description": "Livraison express avec suivi prioritaire"
    }
  ]
}
```

## POST /api/checkout

Crée une nouvelle commande à partir du panier de l'utilisateur.

### Corps de la requête

```json
{
  "email": "user@example.com",
  "phone": "+32412345678",
  "shippingAddress": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "line1": "123 Rue de la Paix",
    "line2": "Appartement 4B",
    "city": "Bruxelles",
    "zip": "1000",
    "country": "BE"
  },
  "billingAddress": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "line1": "123 Rue de la Paix",
    "line2": "Appartement 4B",
    "city": "Bruxelles",
    "zip": "1000",
    "country": "BE"
  },
  "deliveryMethod": "standard",
  "paymentMethod": "card",
  "coupon": "WELCOME10",
  "items": [
    {
      "id": 1,
      "qty": 2,
      "price": 29.99,
      "variant": "M / Noir"
    }
  ]
}
```

### Réponse

```json
{
  "success": true,
  "order": {
    "id": 123,
    "number": "CMD-2025-000123",
    "total": 64.97,
    "currency": "EUR",
    "status": "pending"
  }
}
```

## POST /api/coupons/validate

Valide un code coupon et retourne la réduction applicable.

### Corps de la requête

```json
{
  "code": "WELCOME10",
  "subtotal": 100.0
}
```

### Réponse

```json
{
  "success": true,
  "coupon": {
    "code": "WELCOME10",
    "type": "percentage",
    "value": 10,
    "discount": 10.0,
    "description": "10% de réduction sur votre première commande"
  }
}
```

## POST /api/payment/intent

Crée une intention de paiement (pour Stripe).

### Corps de la requête

```json
{
  "amount": 64.97,
  "currency": "eur",
  "orderId": 123
}
```

### Réponse

```json
{
  "success": true,
  "clientSecret": "pi_1234567890_secret_abcdef",
  "paymentIntentId": "pi_1234567890"
}
```

## Gestion des erreurs

### 400 Bad Request

```json
{
  "success": false,
  "message": "Données invalides",
  "errors": {
    "email": ["L'email est requis"],
    "shippingAddress.firstName": ["Le prénom est requis"]
  }
}
```

### 422 Unprocessable Entity

```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": {
    "coupon": ["Code coupon invalide ou expiré"],
    "items": ["Certains produits ne sont plus disponibles"]
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Erreur interne du serveur"
}
```

## Exemples d'utilisation

```bash
# Récupérer les méthodes de livraison
GET /api/shipping/methods?country=BE

# Valider un coupon
POST /api/coupons/validate
{
  "code": "WELCOME10",
  "subtotal": 100.00
}

# Créer une commande
POST /api/checkout
{
  "email": "user@example.com",
  "shippingAddress": {...},
  "items": [...]
}

# Créer une intention de paiement
POST /api/payment/intent
{
  "amount": 64.97,
  "currency": "eur",
  "orderId": 123
}
```

## Notes d'implémentation

1. **Authentification** : Tous les endpoints nécessitent un token JWT valide
2. **Validation** : Validation stricte des données côté serveur
3. **Stock** : Vérifier la disponibilité des produits avant création de commande
4. **Prix** : Recalculer les prix côté serveur pour éviter les manipulations
5. **Coupons** : Validation des conditions d'utilisation (date, utilisateur, montant minimum)
6. **Paiement** : Intégration Stripe pour les cartes bancaires
7. **Emails** : Envoi automatique d'email de confirmation
8. **Stock** : Réduction du stock après confirmation de paiement
