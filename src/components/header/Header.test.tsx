import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './Header';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
  );
};

describe('Header Component', () => {

  test('renders header', () => {
    renderWithProviders(<Header />);
    
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  test('render navigation', () => {
    renderWithProviders(<Header />);
    
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });

  test('render correct container structure', () => {
    renderWithProviders(<Header />);
    
    const headerElement = screen.getByRole('banner');
    const navElement = screen.getByRole('navigation');
  
    expect(headerElement).toContainElement(navElement);
  });
});