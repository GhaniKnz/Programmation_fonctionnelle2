// src/mocks/server.js
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Définir les handlers pour simuler les requêtes API
export const handlers = [
  // Handler pour la soumission du formulaire
  rest.post('/api/submitForm', (req, res, ctx) => {
    const { food, drink } = req.body;

    // Si un champ est vide, on retourne une erreur
    if (!food || !drink) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'Les champs food et drink sont obligatoires' })
      );
    }

    // Si les champs sont remplis, la soumission réussit
    return res(
      ctx.status(200),
      ctx.json({ message: 'Formulaire soumis avec succès' })
    );
  }),

  // Autre exemple de requête générique (éventuellement à adapter pour d'autres API)
  rest.post('/greeting', (req, res, ctx) =>
    res(ctx.json({ data: { greeting: `Hello ${req.body.subject}` } }))
  ),
  rest.post('/post/:id', (req, res, ctx) => {
    if (!req.body.title) {
      return res(
        ctx.status(400),
        ctx.json({
          errorMessage: 'Format invalide, veuillez renseigner le titre',
        })
      );
    }
    return res(ctx.json({ data: req.body }));
  }),
];

// Configurer le serveur MSW avec les handlers
export const server = setupServer(...handlers);
