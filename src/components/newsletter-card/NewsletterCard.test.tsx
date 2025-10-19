import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NewsletterCard from './NewsletterCard';

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

const defaultProps = {
  title: 'Weekly Wonders',
  description: 'Dive into the unknown with this week\'s spotlight!',
  image: 'https://via.placeholder.com/150',
  label: "S'inscrire",
};

describe('NewsletterCard Component', () => {
  test('Afficher title', () => {
    renderWithProviders(<NewsletterCard {...defaultProps} />);
    
    const titleElement = screen.getByText('Weekly Wonders');
    expect(titleElement).toBeInTheDocument();
  });

  test('Afficher description', () => {
    renderWithProviders(<NewsletterCard {...defaultProps} />);
    
    const descriptionElement = screen.getByText('Dive into the unknown with this week\'s spotlight!');
    expect(descriptionElement).toBeInTheDocument();
  });

  test('Afficher image avec le bon alt text', () => {
    renderWithProviders(<NewsletterCard {...defaultProps} />);
    
    const imageElement = screen.getByAltText('Weekly Wonders');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'https://via.placeholder.com/150');
  });

  test('Afficher le bouton d\'action avec le bon label', () => {
    renderWithProviders(<NewsletterCard {...defaultProps} />);
    
    const buttonElement = screen.getByText("S'inscrire");
    expect(buttonElement).toBeInTheDocument();
  });
});