# API Reviews - Endpoints Attendus

## GET /api/products/:id/reviews

Récupère les avis d'un produit avec filtres et pagination.

### Paramètres de requête

| Paramètre     | Type    | Description              | Exemple            |
| ------------- | ------- | ------------------------ | ------------------ |
| `page`        | number  | Numéro de page           | `page=1`           |
| `perPage`     | number  | Nombre d'avis par page   | `perPage=10`       |
| `sort`        | string  | Tri des avis             | `sort=recent`      |
| `rating`      | number  | Filtre par note minimale | `rating=4`         |
| `with_photos` | boolean | Filtre avis avec photos  | `with_photos=true` |

### Options de tri

- `recent` : Plus récents (défaut)
- `top` : Plus utiles
- `rating_desc` : Note décroissante
- `rating_asc` : Note croissante

### Réponse

```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "user": {
        "name": "Marie Dubois"
      },
      "rating": 5,
      "comment": "Excellent produit ! La qualité est au rendez-vous...",
      "createdAt": "2024-01-15T10:30:00Z",
      "verified": true,
      "photos": ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
      "helpfulCount": 12,
      "reported": false
    }
  ],
  "total": 123,
  "average": 4.3,
  "counts": {
    "5": 80,
    "4": 25,
    "3": 10,
    "2": 5,
    "1": 3
  }
}
```

## POST /api/products/:id/reviews

Crée un nouvel avis pour un produit (authentification requise).

### Corps de la requête (multipart/form-data)

| Champ       | Type    | Description                       | Requis |
| ----------- | ------- | --------------------------------- | ------ |
| `rating`    | number  | Note de 1 à 5                     | Oui    |
| `comment`   | string  | Commentaire (20-500 chars)        | Oui    |
| `anonymous` | boolean | Publier de manière anonyme        | Non    |
| `photos[]`  | file    | Photos (max 5, images uniquement) | Non    |

### Réponse

```json
{
  "success": true,
  "message": "Avis publié avec succès",
  "review": {
    "id": 124,
    "user": {
      "name": "Utilisateur"
    },
    "rating": 5,
    "comment": "Excellent produit !",
    "createdAt": "2024-01-20T10:30:00Z",
    "verified": true,
    "photos": [],
    "helpfulCount": 0,
    "reported": false
  }
}
```

## POST /api/reviews/:id/helpful

Marque un avis comme "utile" (authentification requise).

### Réponse

```json
{
  "success": true,
  "helpfulCount": 13
}
```

## POST /api/reviews/:id/report

Signale un avis inapproprié (authentification requise).

### Réponse

```json
{
  "success": true,
  "message": "Avis signalé avec succès"
}
```

## Gestion des erreurs

### 400 Bad Request

```json
{
  "success": false,
  "message": "Données invalides",
  "errors": {
    "rating": ["La note est requise"],
    "comment": ["Le commentaire doit contenir entre 20 et 500 caractères"]
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentification requise"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Vous devez avoir acheté ce produit pour laisser un avis"
}
```

### 422 Unprocessable Entity

```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": {
    "photos": ["Maximum 5 photos autorisées"],
    "rating": ["La note doit être entre 1 et 5"]
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

### Récupérer les avis récents

```bash
GET /api/products/123/reviews?page=1&perPage=10&sort=recent
```

### Filtrer les avis avec photos

```bash
GET /api/products/123/reviews?with_photos=true&rating=4
```

### Publier un avis

```bash
POST /api/products/123/reviews
Content-Type: multipart/form-data

rating=5
comment=Excellent produit, je recommande !
anonymous=false
photos[]=@photo1.jpg
photos[]=@photo2.jpg
```

### Marquer un avis comme utile

```bash
POST /api/reviews/456/helpful
Authorization: Bearer <token>
```

### Signaler un avis

```bash
POST /api/reviews/456/report
Authorization: Bearer <token>
```

## Règles métier

### Publication d'avis

1. **Authentification requise** : Seuls les utilisateurs connectés peuvent publier
2. **Achat vérifié** : L'utilisateur doit avoir acheté le produit
3. **Un avis par produit** : Un utilisateur ne peut laisser qu'un seul avis par produit
4. **Modération** : Les avis sont modérés avant publication

### Votes "utile"

1. **Authentification requise** : Seuls les utilisateurs connectés peuvent voter
2. **Un vote par avis** : Un utilisateur ne peut voter qu'une fois par avis
3. **Pas de vote sur ses propres avis** : Un utilisateur ne peut pas voter sur ses propres avis

### Signalement

1. **Authentification requise** : Seuls les utilisateurs connectés peuvent signaler
2. **Un signalement par avis** : Un utilisateur ne peut signaler qu'une fois par avis
3. **Modération** : Les avis signalés sont examinés par l'équipe de modération

### Photos

1. **Format** : JPG, PNG, WebP uniquement
2. **Taille** : Maximum 5MB par photo
3. **Quantité** : Maximum 5 photos par avis
4. **Stockage** : Photos stockées sur CDN avec URLs sécurisées

## Notes d'implémentation

1. **Pagination** : Utiliser la pagination côté serveur pour de meilleures performances
2. **Cache** : Mettre en cache les statistiques (moyenne, compteurs) avec TTL approprié
3. **Validation** : Validation stricte côté serveur de tous les champs
4. **Sécurité** : Sanitisation des commentaires pour éviter les injections
5. **Performance** : Index sur les colonnes de tri et filtrage
6. **Modération** : Système de modération pour les avis signalés
7. **Analytics** : Tracking des interactions (votes, signalements) pour analytics
