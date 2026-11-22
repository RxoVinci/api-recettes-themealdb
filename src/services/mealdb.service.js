// Seul fichier du projet qui connait l'API TheMealDB.

const BASE = 'https://www.themealdb.com/api/json/v1/1'

function recupererIngredients (recette) {
    const ingredients = []

    // TheMealDB donne strIngredient1 à strIngredient20, on les met dans un seul tableau
    for (let i = 1; i <= 20; i++) {
        const nom = recette['strIngredient' + i]
        const quantite = recette['strMeasure' + i]

        if (nom && nom.trim() !== '') {
            ingredients.push({
                nom: nom.trim(),
                quantite: quantite ? quantite.trim() : ''
            })
        }
    }

    return ingredients
}

function enleverChampsVides (objet) {
    const resultat = {}

    for (const cle of Object.keys(objet)) {
        const valeur = objet[cle]

        if (valeur === null || valeur === undefined || valeur === '') {
            continue
        }
        if (Array.isArray(valeur) && valeur.length === 0) {
            continue
        }

        resultat[cle] = valeur
    }

    return resultat
}

function nettoyer (recette) {
    let tags = []
    if (recette.strTags) {
        tags = recette.strTags.split(',').filter((tag) => tag.trim() !== '')
    }

    const ingredients = recupererIngredients(recette)

    return enleverChampsVides({
        id: recette.idMeal,
        nom: recette.strMeal,
        categorie: recette.strCategory,
        origine: recette.strArea,
        instructions: recette.strInstructions,
        image: recette.strMealThumb,
        youtube: recette.strYoutube,
        source: recette.strSource,
        tags: tags,
        nbIngredients: ingredients.length,
        ingredients: ingredients
    })
}

async function appelerApi (chemin) {
    const response = await fetch(BASE + chemin)

    if (!response.ok) {
        throw new Error('Erreur TheMealDB : ' + response.status)
    }

    return response.json()
}

export async function chercherRecettes (nom = '') {
    const donnees = await appelerApi('/search.php?s=' + encodeURIComponent(nom))

    // quand rien n'est trouvé, TheMealDB renvoie meals: null
    if (!donnees.meals) {
        return []
    }

    return donnees.meals.map(nettoyer)
}

export async function chercherUneRecette (id) {
    const donnees = await appelerApi('/lookup.php?i=' + encodeURIComponent(id))

    if (!donnees.meals) {
        return null
    }

    return nettoyer(donnees.meals[0])
}

export async function chercherRecetteAuHasard () {
    const donnees = await appelerApi('/random.php')

    return nettoyer(donnees.meals[0])
}
