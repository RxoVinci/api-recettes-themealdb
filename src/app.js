import express from 'express'

const app = express()

app.get('/health', (req, res) => {
    res.json({ version: '1.0.0' })
})

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
