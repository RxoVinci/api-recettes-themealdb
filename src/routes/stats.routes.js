import { Router } from 'express'
import { chercherRecettes } from '../services/mealdb.service.js'

const router = Router()

router.get('/', async (req, res, next) => {
    try {
        const recettes = await chercherRecettes(req.query.nom || '')

        if (recettes.length === 0) {
            return res.status(404).json({ erreur: 'Aucune recette trouvée pour calculer des stats' })
        }

        const parCategorie = {}
        const parOrigine = {}
        const compteurIngredients = {}
        let totalIngredients = 0
        let recetteLaPlusLongue = recettes[0]

        for (const recette of recettes) {
            if (parCategorie[recette.categorie]) {
                parCategorie[recette.categorie] = parCategorie[recette.categorie] + 1
            } else {
                parCategorie[recette.categorie] = 1
            }

            if (parOrigine[recette.origine]) {
                parOrigine[recette.origine] = parOrigine[recette.origine] + 1
            } else {
                parOrigine[recette.origine] = 1
            }

            for (const ingredient of recette.ingredients) {
                const nom = ingredient.nom.toLowerCase()

                if (compteurIngredients[nom]) {
                    compteurIngredients[nom] = compteurIngredients[nom] + 1
                } else {
                    compteurIngredients[nom] = 1
                }
            }

            totalIngredients = totalIngredients + recette.nbIngredients

            if (recette.nbIngredients > recetteLaPlusLongue.nbIngredients) {
                recetteLaPlusLongue = recette
            }
        }

        let ingredientLePlusUtilise = ''

        for (const nom of Object.keys(compteurIngredients)) {
            if (ingredientLePlusUtilise === '' || compteurIngredients[nom] > compteurIngredients[ingredientLePlusUtilise]) {
                ingredientLePlusUtilise = nom
            }
        }

        res.json({
            recherche: req.query.nom || '',
            nbRecettes: recettes.length,
            parCategorie: parCategorie,
            parOrigine: parOrigine,
            moyenneIngredients: Math.round((totalIngredients / recettes.length) * 10) / 10,
            recetteAvecLePlusDIngredients: {
                nom: recetteLaPlusLongue.nom,
                nbIngredients: recetteLaPlusLongue.nbIngredients
            },
            ingredientLePlusUtilise: {
                nom: ingredientLePlusUtilise,
                nbRecettes: compteurIngredients[ingredientLePlusUtilise]
            }
        })
    } catch (erreur) {
        next(erreur)
    }
})

export default router
