# Documentation du Catalogue

## Vue d'ensemble

Le catalogue de produits est implémenté avec une architecture modulaire comprenant :

- **Store Pinia** (`src/stores/catalog.js`) : Gestion de l'état et des actions
- **Page principale** (`src/pages/ProductsPage.vue`) : Interface utilisateur
- **Composant filtres** (`src/components/FiltersSidebar.vue`) : Filtres avancés
- **Synchronisation URL** : Filtres persistés dans l'URL

## Fonctionnalités

### 🔍 Recherche

- Recherche textuelle dans les produits
- Suggestions en temps réel
- Debounce de 300ms pour éviter les requêtes excessives

### 🎛️ Filtres

- **Catégorie** : Filtrage par catégorie de produit
- **Prix** : Plage de prix avec slider et inputs numériques
- **Marques** : Sélection multiple avec recherche
- **Note** : Note minimale avec étoiles
- **Disponibilité** : En stock seulement
- **Éco-score** : Score environnemental minimum
- **Promotions** : Produits en promo

### 📊 Tri

- Pertinence (défaut)
- Prix croissant/décroissant
- Nouveautés
- Meilleures notes

### 📱 Responsive

- **Desktop** : Sidebar fixe avec filtres
- **Mobile** : Drawer pour les filtres, dialog pour le tri

### 🔗 Synchronisation URL

- Tous les filtres sont persistés dans l'URL
- Navigation directe possible avec paramètres
- Mise à jour automatique de l'URL lors des changements

## Utilisation

### Navigation programmatique

```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// Recherche simple
router.push({ path: '/products', query: { q: 'smartphone' } })

// Filtres multiples
router.push({
  path: '/products',
  query: {
    q: 'robe',
    category: 'clothing',
    price_min: 20,
    price_max: 80,
    sort: 'price_asc',
  },
})
```

### Utilisation du store

```javascript
import { useCatalogStore } from 'stores/catalog'

const catalog = useCatalogStore()

// Appliquer des filtres
catalog.q = 'smartphone'
catalog.category = 'electronics'
catalog.brands = ['samsung', 'apple']

// Charger les produits
await catalog.fetch()

// Charger plus de produits
await catalog.fetchNext()

// Réinitialiser les filtres
catalog.resetFilters()
```

## Structure des données

### Produit

```javascript
{
  id: 1,
  name: "T-shirt Premium",
  price: 29.99,
  oldPrice: null,
  image: "https://example.com/image.jpg",
  rating: 4.5,
  reviewsCount: 123,
  brand: "nike",
  ecoScore: 80,
  inStock: true,
  category: "clothing"
}
```

### Filtres actifs

```javascript
{
  key: 'q',
  label: '"smartphone"',
  value: 'smartphone'
}
```

## API Endpoints

### GET /api/products

Paramètres supportés :

- `q` : Terme de recherche
- `category` : Catégorie
- `brands[]` : Marques (array)
- `price_min` / `price_max` : Plage de prix
- `rating_min` : Note minimale
- `in_stock` : En stock (boolean)
- `eco_min` : Éco-score minimum
- `promo` : En promo (boolean)
- `sort` : Tri
- `page` / `perPage` : Pagination

Réponse :

```json
{
  "success": true,
  "items": [...],
  "total": 327
}
```

## Tests manuels

### ✅ Checklist de tests

1. **Navigation directe** : `/products?q=robe&category=femme&price_min=20&price_max=80&sort=price_asc`
2. **Changement de filtre** : URL mise à jour + refetch (debounce)
3. **Voir plus** : +50 items, jusqu'à `hasMore = false`
4. **Reset** : URL nettoyée + fetch défaut
5. **Mobile** : drawer filtres s'ouvre/ferme
6. **Recherche** : SearchBar redirige vers `/products?q=...`

### 🐛 Dépannage

**Problème** : Filtres ne se synchronisent pas avec l'URL
**Solution** : Vérifier que `updateURL()` est appelé après chaque changement de filtre

**Problème** : Requêtes API multiples
**Solution** : Vérifier que `hasQueryChanged()` fonctionne correctement

**Problème** : Filtres ne se réinitialisent pas
**Solution** : Vérifier que `resetFilters()` remet bien tous les filtres à zéro

## Performance

### Optimisations implémentées

- **Debounce** : 300ms pour les filtres, 500ms pour le prix
- **Cache** : Évite les requêtes identiques avec `lastQuery`
- **Pagination** : Chargement par lots de 50 produits
- **Lazy loading** : Composants chargés à la demande

### Recommandations

- Utiliser des index sur les colonnes filtrées en base
- Implémenter la mise en cache côté serveur
- Optimiser les images avec des formats modernes (WebP, AVIF)
- Utiliser la compression gzip pour les réponses API
