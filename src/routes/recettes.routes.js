import { Router } from 'express'
import {
    chercherRecettes,
    chercherUneRecette,
    chercherRecetteAuHasard
} from '../services/mealdb.service.js'

const router = Router()

router.get('/', async (req, res, next) => {
    try {
        let recettes = await chercherRecettes(req.query.nom || '')

        if (req.query.categorie) {
            recettes = recettes.filter((recette) =>
                recette.categorie && recette.categorie.toLowerCase() === req.query.categorie.toLowerCase()
            )
        }

        if (req.query.origine) {
            recettes = recettes.filter((recette) =>
                recette.origine && recette.origine.toLowerCase() === req.query.origine.toLowerCase()
            )
        }

        if (req.query.ingredient) {
            recettes = recettes.filter((recette) =>
                recette.ingredients.some((ingredient) =>
                    ingredient.nom.toLowerCase().includes(req.query.ingredient.toLowerCase())
                )
            )
        }

        res.json(recettes)
    } catch (erreur) {
        next(erreur)
    }
})

router.get('/hasard', async (req, res, next) => {
    try {
        const recette = await chercherRecetteAuHasard()
        res.json(recette)
    } catch (erreur) {
        next(erreur)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const recette = await chercherUneRecette(req.params.id)

        if (recette === null) {
            return res.status(404).json({ erreur: 'Recette introuvable' })
        }

        res.json(recette)
    } catch (erreur) {
        next(erreur)
    }
})

export default router
