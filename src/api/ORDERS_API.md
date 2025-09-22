# API Commandes - Endpoints Attendus

## GET /api/orders

Récupère la liste des commandes de l'utilisateur connecté avec filtres et pagination.

### Paramètres de requête

| Paramètre   | Type   | Description                 | Exemple                |
| ----------- | ------ | --------------------------- | ---------------------- |
| `q`         | string | Recherche (numéro, produit) | `q=CMD-2025-000123`    |
| `status`    | string | Statut de la commande       | `status=shipped`       |
| `date_from` | date   | Date de début (YYYY-MM-DD)  | `date_from=2025-01-01` |
| `date_to`   | date   | Date de fin (YYYY-MM-DD)    | `date_to=2025-01-31`   |
| `page`      | number | Numéro de page              | `page=1`               |
| `perPage`   | number | Nombre d'éléments par page  | `perPage=10`           |

### Statuts disponibles

- `pending` : En attente de paiement
- `paid` : Payée
- `shipped` : Expédiée
- `delivered` : Livrée
- `canceled` : Annulée

### Réponse

```json
{
  "success": true,
  "items": [
    {
      "id": 123,
      "number": "CMD-2025-000123",
      "date": "2025-01-15T10:12:00Z",
      "status": "delivered",
      "itemsCount": 3,
      "total": 129.9,
      "currency": "EUR"
    }
  ],
  "total": 27
}
```

## GET /api/orders/:id

Récupère le détail complet d'une commande.

### Réponse

```json
{
  "success": true,
  "order": {
    "id": 123,
    "number": "CMD-2025-000123",
    "date": "2025-01-15T10:12:00Z",
    "status": "delivered",
    "shipping": {
      "name": "Jean Dupont",
      "address": {
        "street": "123 Rue de la Paix",
        "city": "Paris",
        "postal_code": "75001",
        "country": "France"
      },
      "method": "Bpost",
      "tracking": "BP123456789",
      "trackingUrl": "https://tracking.bpost.be/track/BP123456789"
    },
    "billing": {
      "name": "Jean Dupont",
      "address": {
        "street": "123 Rue de la Paix",
        "city": "Paris",
        "postal_code": "75001",
        "country": "France"
      }
    },
    "payment": {
      "method": "card",
      "last4": "4242"
    },
    "lines": [
      {
        "id": 1,
        "image": "https://example.com/image.jpg",
        "title": "T-shirt Premium",
        "variant": "M / Noir",
        "unit": 29.99,
        "qty": 2,
        "subtotal": 59.98
      }
    ],
    "totals": {
      "subtotal": 149.97,
      "discount": 10.0,
      "shipping": 4.99,
      "tax": 21.0,
      "total": 165.96,
      "currency": "EUR"
    },
    "timeline": [
      {
        "key": "created",
        "at": "2025-01-15T10:12:00Z"
      },
      {
        "key": "paid",
        "at": "2025-01-15T10:13:00Z"
      },
      {
        "key": "shipped",
        "at": "2025-01-16T08:00:00Z"
      },
      {
        "key": "delivered",
        "at": "2025-01-17T15:42:00Z"
      }
    ]
  }
}
```

## GET /api/orders/:id/invoice

Télécharge la facture PDF de la commande.

### Réponse

- **Content-Type** : `application/pdf`
- **Content-Disposition** : `attachment; filename="facture-CMD-2025-000123.pdf"`
- **Body** : Fichier PDF binaire

## POST /api/orders/:id/reorder

Re-commande tous les articles d'une commande précédente.

### Réponse

```json
{
  "success": true,
  "message": "Commande ajoutée au panier avec succès",
  "cart": {
    "items": [...],
    "total": 129.90
  }
}
```

## Gestion des erreurs

### 404 Not Found

```json
{
  "success": false,
  "message": "Commande non trouvée"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Vous n'avez pas accès à cette commande"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "message": "Paramètres invalides",
  "errors": {
    "status": ["Le statut doit être l'un des suivants: pending, paid, shipped, delivered, canceled"]
  }
}
```

## Exemples d'utilisation

```bash
# Liste des commandes
GET /api/orders

# Commandes expédiées
GET /api/orders?status=shipped

# Commandes du mois de janvier
GET /api/orders?date_from=2025-01-01&date_to=2025-01-31

# Recherche par numéro
GET /api/orders?q=CMD-2025-000123

# Détail d'une commande
GET /api/orders/123

# Télécharger la facture
GET /api/orders/123/invoice

# Re-commander
POST /api/orders/123/reorder
```

## Notes d'implémentation

1. **Authentification** : Tous les endpoints nécessitent un token JWT valide
2. **Autorisation** : Un utilisateur ne peut accéder qu'à ses propres commandes
3. **Pagination** : Par défaut, 10 commandes par page
4. **Filtres** : Tous les filtres sont optionnels et peuvent être combinés
5. **Timeline** : Les étapes sont ordonnées chronologiquement
6. **Factures** : Générées dynamiquement en PDF
7. **Re-commande** : Ajoute les articles au panier existant ou crée un nouveau panier
