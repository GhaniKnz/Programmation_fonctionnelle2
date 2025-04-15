// src/__tests__/app.jsx
import React from 'react'
import {render, screen, waitFor, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {BrowserRouter} from 'react-router-dom'
import App from '../app.jsx'

// MOCK de l'API
jest.mock('../api', () => ({
  submitForm: jest.fn((form) => {
    if (!form.food || !form.drink) {
      return Promise.reject(
        new Error('Les champs food et drink sont obligatoires'),
      )
    }
    return Promise.resolve({message: 'Formulaire soumis avec succès'})
  }),
}))

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Tests fonctionnels - Scénarios demandés', () => {
  test('✅ Cas passant : soumission complète', async () => {
    renderWithRouter(<App />)

    // Home
    expect(
      screen.getByRole('heading', {name: 'Welcome home'}),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', {name: 'Fill out the form'}))

    // Page 1
    expect(screen.getByRole('heading', {name: 'Page 1'})).toBeInTheDocument()
    expect(screen.getByLabelText('Favorite Food')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Favorite Food'), 'Les pâtes')
    await userEvent.click(screen.getByRole('link', {name: 'Next'}))

    // Page 2
    await waitFor(() =>
      expect(screen.getByRole('heading', {name: 'Page 2'})).toBeInTheDocument(),
    )
    expect(screen.getByLabelText('Favorite Drink')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Favorite Drink'), 'Bière')
    await userEvent.click(screen.getByRole('link', {name: 'Review'}))

    // Confirm
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {name: 'Confirm'}),
      ).toBeInTheDocument(),
    )
    expect(screen.getByText('Please confirm your choices')).toBeInTheDocument()
    expect(screen.getByText('Les pâtes')).toBeInTheDocument()
    expect(screen.getByText('Bière')).toBeInTheDocument()

    // Click "Confirm" with act to avoid warning
    await act(async () => {
      await userEvent.click(screen.getByRole('button', {name: 'Confirm'}))
    })

    // Success
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {name: 'Congrats. You did it.'}),
      ).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('link', {name: 'Go home'}))
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {name: 'Welcome home'}),
      ).toBeInTheDocument()
    })
  })

  test('❌ Cas non passant : champ vide -> erreur', async () => {
    renderWithRouter(<App />)

    // Home
    expect(
      screen.getByRole('heading', {name: 'Welcome home'}),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', {name: 'Fill out the form'}))

    // Page 1
    expect(screen.getByRole('heading', {name: 'Page 1'})).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Favorite Food'), '')
    await userEvent.click(screen.getByRole('link', {name: 'Next'}))

    // Page 2
    await waitFor(() =>
      expect(screen.getByRole('heading', {name: 'Page 2'})).toBeInTheDocument(),
    )
    await userEvent.type(screen.getByLabelText('Favorite Drink'), 'Bière')
    await userEvent.click(screen.getByRole('link', {name: 'Review'}))

    // Confirm
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {name: 'Confirm'}),
      ).toBeInTheDocument(),
    )

    // Click Confirm (avec champ vide)
    await act(async () => {
      await userEvent.click(screen.getByRole('button', {name: 'Confirm'}))
    })

    // Error Page
    await waitFor(() => {
      expect(screen.getByText('Oh no. There was an error.')).toBeInTheDocument()
      expect(
        screen.getByText('Les champs food et drink sont obligatoires'),
      ).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('link', {name: 'Try again'}))
    await waitFor(() => {
      expect(screen.getByRole('heading', {name: 'Page 1'})).toBeInTheDocument()
    })
  })
})
