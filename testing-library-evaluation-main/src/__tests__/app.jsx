// tests/App.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/app.jsx';  // Assurez-vous que le chemin vers app.jsx est correct
import React from 'react';

// Test de la page d'accueil
test('Affichage de la page d\'accueil et redirection vers le formulaire', () => {
  render(<App />);

  // Vérifier la présence du titre "Welcome home"
  expect(screen.getByText('Welcome home')).toBeInTheDocument();

  // Vérifier la présence du lien "Fill out the form"
  expect(screen.getByText('Fill out the form')).toBeInTheDocument();

  // Simuler un clic sur le lien "Fill out the form"
  fireEvent.click(screen.getByText('Fill out the form'));

  // Vérifier la redirection vers la page du formulaire
  expect(screen.getByText('Page 1')).toBeInTheDocument();
});

// Test de la soumission du formulaire avec des champs remplis
test('Soumission du formulaire avec des champs valides', async () => {
  render(<App />);

  // Aller à la page du formulaire
  fireEvent.click(screen.getByText('Fill out the form'));

  // Remplir le champ "Favorite food"
  fireEvent.change(screen.getByLabelText('Favorite food'), { target: { value: 'Les pâtes' } });

  // Remplir le champ "Favorite drink"
  fireEvent.change(screen.getByLabelText('Favorite drink'), { target: { value: 'Eau' } });

  // Cliquer sur le bouton "Next"
  fireEvent.click(screen.getByText('Next'));

  // Vérifier que la soumission a réussi et que l'utilisateur est redirigé vers la page 2
  await waitFor(() => expect(screen.getByText('Page 2')).toBeInTheDocument());
  expect(screen.getByText('Formulaire soumis avec succès')).toBeInTheDocument();
});

// Test de la soumission du formulaire avec un champ vide (erreur)
test('Soumission du formulaire avec un champ vide', async () => {
  render(<App />);

  // Aller à la page du formulaire
  fireEvent.click(screen.getByText('Fill out the form'));

  // Remplir uniquement le champ "Favorite food"
  fireEvent.change(screen.getByLabelText('Favorite food'), { target: { value: 'Les pâtes' } });

  // Laisser le champ "Favorite drink" vide
  fireEvent.change(screen.getByLabelText('Favorite drink'), { target: { value: '' } });

  // Cliquer sur le bouton "Next"
  fireEvent.click(screen.getByText('Next'));

  // Vérifier que l'erreur est affichée
  await waitFor(() => expect(screen.getByText('Les champs food et drink sont obligatoires')).toBeInTheDocument());
});
