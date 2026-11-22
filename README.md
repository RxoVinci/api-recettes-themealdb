# API Recettes - TheMealDB

API faite avec Node.js et Express qui récupère des recettes sur [TheMealDB](https://www.themealdb.com/api.php), les nettoie et calcule des statistiques.

**Auteur : Xavier Okola**

## Ce que fait l'API

- Recherche des recettes par nom, avec des filtres (catégorie, origine, ingrédient)
- Donne le détail d'une recette ou une recette au hasard
- Transforme les données de TheMealDB :
  - les 20 champs `strIngredient` / `strMeasure` sont regroupés dans un seul tableau `ingredients`
  - les champs vides ou `null` sont enlevés
  - les champs sont renommés en français
- Calcule des statistiques sur les recettes trouvées

## Lancer le projet

```bash
git clone https://github.com/RxoVinci/api-recettes-themealdb.git
cd api-recettes-themealdb
npm install
npm start
```

Le serveur tourne sur http://localhost:3000 (ou `npm run dev` pour le relancer à chaque modification).

## Routes

| Méthode | Route | Description |
|---|---|---|
| GET | `/health` | Vérifie que l'API tourne |
| GET | `/api/recettes` | Liste des recettes |
| GET | `/api/recettes?nom=chicken` | Recherche par nom |
| GET | `/api/recettes?categorie=Dessert` | Filtre par catégorie |
| GET | `/api/recettes?origine=Italian` | Filtre par origine |
| GET | `/api/recettes?ingredient=garlic` | Filtre par ingrédient |
| GET | `/api/recettes/hasard` | Une recette au hasard |
| GET | `/api/recettes/:id` | Détail d'une recette (ex : `/api/recettes/52772`) |
| GET | `/api/stats` | Statistiques sur les recettes |
| GET | `/api/stats?nom=chicken` | Statistiques sur une recherche |

Les filtres peuvent se combiner : `/api/recettes?nom=chicken&origine=Indian`

## Exemple de recette renvoyée

```json
{
  "id": "52772",
  "nom": "Teriyaki Chicken Casserole",
  "categorie": "Chicken",
  "origine": "Japanese",
  "instructions": "Preheat oven to 350° F...",
  "image": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  "youtube": "https://www.youtube.com/watch?v=4aZr5hZXP_s",
  "tags": ["Meat", "Casserole"],
  "nbIngredients": 9,
  "ingredients": [
    { "nom": "soy sauce", "quantite": "3/4 cup" },
    { "nom": "water", "quantite": "1/2 cup" }
  ]
}
```

## Exemple de statistiques

```json
{
  "recherche": "chicken",
  "nbRecettes": 25,
  "parCategorie": { "Chicken": 18, "Side": 3 },
  "parOrigine": { "Japanese": 3, "Indian": 4 },
  "moyenneIngredients": 11.2,
  "recetteAvecLePlusDIngredients": { "nom": "Chicken Congee", "nbIngredients": 16 },
  "ingredientLePlusUtilise": { "nom": "salt", "nbRecettes": 14 }
}
```

## Erreurs

- `404` si la route n'existe pas ou si la recette est introuvable
- `500` si TheMealDB ne répond pas

## Structure

```
├── server.js
└── src
    ├── app.js
    ├── routes
    │   ├── recettes.routes.js
    │   └── stats.routes.js
    └── services
        └── mealdb.service.js
```
