import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import FormDialog, { action } from './Login';

const mockNavigate = jest.fn();
const mockRedirect = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Form: ({ children, ...props }: React.ComponentProps<'form'>) => <form {...props}>{children}</form>,
  redirect: (...args: Parameters<typeof mockRedirect>) => mockRedirect(...args),
}));

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render structure', () => {
    renderWithProviders(<FormDialog />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    
    const title = screen.getByText('Login');
    expect(title).toBeInTheDocument();
    
    const description = screen.getByText('Veuillez sélectionner un utilisateur');
    expect(description).toBeInTheDocument();
  });

  test('render default value', () => {
    renderWithProviders(<FormDialog />);
    
    const select = screen.getByLabelText('Utilisateur');
    expect(select).toBeInTheDocument();
    expect(select).toHaveTextContent('Utilisateur sans souscription');
  });

  test('renders all options', async () => {
    renderWithProviders(<FormDialog />);
    
    const select = screen.getByLabelText('Utilisateur');
    userEvent.click(select);
    
    const options = screen.getAllByText('Utilisateur avec une souscription');
    expect(options.length).toBeGreaterThan(0);
    
    const multipleOptions = screen.getAllByText('Utilisateur avec plusieurs souscriptions');
    expect(multipleOptions.length).toBeGreaterThan(0);
    
    const noSubOptions = screen.getAllByText('Utilisateur sans souscription');
    expect(noSubOptions.length).toBeGreaterThan(0);
  });

  test('render  buttons', () => {
    renderWithProviders(<FormDialog />);
    
    const cancelButton = screen.getByText('Annuler');
    const submitButton = screen.getByText('Se connecter');
    
    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('calls navigate to "/" when cancel button is clicked', async () => {
    renderWithProviders(<FormDialog />);
    
    const cancelButton = screen.getByText('Annuler');
    userEvent.click(cancelButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

describe('Login redirections', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockActionArgs = (formData: FormData) => ({
    request: {
      formData: jest.fn().mockResolvedValue(formData)
    } as unknown as Request,
    params: {}
  });

  test('redirects to home page with selected user type', async () => {
    const formData = new FormData();
    formData.append('user', 'USER_WITH_ONE_SUBSCRIPTION');
    
    const mockArgs = createMockActionArgs(formData);
    
    await action(mockArgs);
    
    expect(mockRedirect).toHaveBeenCalledWith('/?user=USER_WITH_ONE_SUBSCRIPTION');
  });
});