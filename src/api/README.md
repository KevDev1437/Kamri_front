# API Catalogue - Endpoints Attendus

## GET /api/products

Récupère la liste des produits avec filtres, tri et pagination.

### Paramètres de requête

| Paramètre    | Type    | Description                  | Exemple                         |
| ------------ | ------- | ---------------------------- | ------------------------------- |
| `q`          | string  | Terme de recherche           | `q=smartphone`                  |
| `category`   | string  | Catégorie du produit         | `category=electronics`          |
| `brands[]`   | array   | Marques (peut être multiple) | `brands[]=nike&brands[]=adidas` |
| `price_min`  | number  | Prix minimum                 | `price_min=20`                  |
| `price_max`  | number  | Prix maximum                 | `price_max=100`                 |
| `rating_min` | number  | Note minimale (1-5)          | `rating_min=4`                  |
| `in_stock`   | boolean | En stock seulement           | `in_stock=true`                 |
| `eco_min`    | number  | Éco-score minimum (0-100)    | `eco_min=80`                    |
| `promo`      | boolean | En promo seulement           | `promo=true`                    |
| `sort`       | string  | Tri des résultats            | `sort=price_asc`                |
| `page`       | number  | Numéro de page               | `page=1`                        |
| `perPage`    | number  | Nombre d'éléments par page   | `perPage=50`                    |

### Options de tri

- `relevance` : Pertinence (défaut)
- `price_asc` : Prix croissant
- `price_desc` : Prix décroissant
- `new` : Nouveautés
- `rating_desc` : Meilleures notes

### Réponse

```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "name": "T-shirt Premium",
      "price": 29.99,
      "oldPrice": null,
      "image": "https://example.com/image.jpg",
      "rating": 4.5,
      "reviewsCount": 123,
      "brand": "nike",
      "ecoScore": 80,
      "inStock": true,
      "category": "clothing"
    }
  ],
  "total": 327
}
```

### Gestion des erreurs

- **400 Bad Request** : Paramètres invalides
- **500 Internal Server Error** : Erreur serveur

### Exemples d'utilisation

```bash
# Recherche simple
GET /api/products?q=smartphone

# Filtres multiples
GET /api/products?category=electronics&brands[]=samsung&price_min=200&price_max=800&sort=price_asc

# Pagination
GET /api/products?page=2&perPage=25
```

## Notes d'implémentation

1. **Pagination** : Le frontend gère automatiquement le chargement de plus de produits avec `fetchNext()`
2. **Filtres** : Tous les filtres sont optionnels et peuvent être combinés
3. **Recherche** : Le paramètre `q` recherche dans le nom et la description des produits
4. **Tri** : Le tri par défaut est `relevance` si non spécifié
5. **Performance** : Utiliser des index sur les colonnes filtrées (category, brand, price, etc.)
