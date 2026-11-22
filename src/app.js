import express from 'express'
import recettesRoutes from './routes/recettes.routes.js'
import statsRoutes from './routes/stats.routes.js'

const app = express()

app.get('/health', (req, res) => {
    res.json({ version: '1.0.0' })
})

app.use('/api/recettes', recettesRoutes)
app.use('/api/stats', statsRoutes)

// route qui n'existe pas
app.use((req, res) => {
    res.status(404).json({ erreur: 'Route introuvable' })
})

// erreur pendant une requête (ex : TheMealDB ne répond pas)
app.use((erreur, req, res, next) => {
    console.error(erreur.message)
    res.status(500).json({ erreur: 'Erreur serveur, réessayez plus tard' })
})

export default app
