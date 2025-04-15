// src/mocks/server.js
import {setupServer} from 'msw/node'
import {rest} from 'msw'

/**
 * Handlers pour simuler les requêtes API.
 *
 * Vous pouvez ajouter, modifier ou supprimer des endpoints selon vos besoins.
 */
export const handlers = [
  // Handler pour la soumission du formulaire
  rest.post('/api/submitForm', (req, res, ctx) => {
    const {food, drink} = req.body

    // Si un champ est vide, renvoyer une erreur
    if (!food || !drink) {
      return res(
        ctx.status(400),
        ctx.json({message: 'Les champs food et drink sont obligatoires'}),
      )
    }

    // Sinon, la soumission réussit
    return res(
      ctx.status(200),
      ctx.json({message: 'Formulaire soumis avec succès'}),
    )
  }),

  // Exemple d'un autre endpoint (à adapter ou supprimer si non nécessaire)
  rest.post('/greeting', (req, res, ctx) =>
    res(ctx.json({data: {greeting: `Hello ${req.body.subject}`}})),
  ),

  // Exemple d'un endpoint paramétré
  rest.post('/post/:id', (req, res, ctx) => {
    if (!req.body.title) {
      return res(
        ctx.status(400),
        ctx.json({
          errorMessage: 'Format invalide, veuillez renseigner le titre',
        }),
      )
    }
    return res(ctx.json({data: req.body}))
  }),
]

/**
 * Configuration du serveur MSW avec les handlers définis.
 * Ce serveur sera utilisé pendant vos tests ou en développement afin de simuler les réponses de votre API.
 */
export const server = setupServer(...handlers)
