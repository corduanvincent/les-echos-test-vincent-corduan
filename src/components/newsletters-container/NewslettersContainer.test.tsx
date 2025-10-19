import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NewsletterContainer, { UserContext, useUser } from './NewslettersContainer';

const theme = createTheme();

const MockUser = () => {
  const { userType } = useUser();
  return <div data-testid="user-type">{userType}</div>;
};

const MockOutlet = () => <div data-testid="outlet">Mock Outlet Content</div>;

// eslint-disable-next-line prefer-const
let mockOutletComponent = MockOutlet;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => mockOutletComponent(),
}));

const renderWithProviders = (component: React.ReactElement, initialEntries?: string[]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('NewsletterContainer Component', () => {
  beforeEach(() => {
    // Reset before each test
    mockOutletComponent = MockOutlet;
  });

  test('render main et outlet', () => {
    renderWithProviders(<NewsletterContainer />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    
    const outletElement = screen.getByTestId('outlet');
    expect(outletElement).toBeInTheDocument();
  });

  test('render with no user', () => {
    // Change outlet to render MockUser component
    mockOutletComponent = MockUser;

    renderWithProviders(<NewsletterContainer />);
    
    const userTypeElement = screen.getByTestId('user-type');
    expect(userTypeElement).toHaveTextContent('USER_WITHOUT_SUBSCRIPTION');
  });

  test('render with user USER_WITH_SUBSCRIPTION', () => {
    // Change outlet to render MockUser component
    mockOutletComponent = MockUser;

    renderWithProviders(
      <NewsletterContainer />,
      ['/?user=USER_WITH_SUBSCRIPTION']
    );
    
    const userTypeElement = screen.getByTestId('user-type');
    expect(userTypeElement).toHaveTextContent('USER_WITH_SUBSCRIPTION');
  });

  test('render user USER_WITH_MULTIPLE_SUBSCRIPTION', () => {
    // Change outlet to render MockUser component
    mockOutletComponent = MockUser;

    renderWithProviders(
      <NewsletterContainer />,
      ['/?user=USER_WITH_MULTIPLE_SUBSCRIPTION']
    );
    
    const userTypeElement = screen.getByTestId('user-type');
    expect(userTypeElement).toHaveTextContent('USER_WITH_MULTIPLE_SUBSCRIPTION');
  });

  test('useUser hook returns correct context value', () => {
    const TestComponent = () => {
      const { userType } = useUser();
      return <div data-testid="hook-result">{userType}</div>;
    };

    render(
      <UserContext.Provider value={{ userType: 'USER_WITHOUT_SUBSCRIPTION' }}>
        <TestComponent />
      </UserContext.Provider>
    );

    const hookResult = screen.getByTestId('hook-result');
    expect(hookResult).toHaveTextContent('USER_WITHOUT_SUBSCRIPTION');
  });
});