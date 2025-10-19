import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NewslettersList from './NewslettersList';
import { UserContext } from '../../components/newsletters-container/NewslettersContainer';

jest.mock('../../utils/Utils.tsx', () => ({
  getButtonLabel: jest.fn(),
}));

import { getButtonLabel } from '../../utils/Utils.tsx';
const mockGetButtonLabel = jest.mocked(getButtonLabel);

interface MockNewsletterCardProps {
  title: string;
  description: string;
  image: string;
  label: React.ReactNode;
}

jest.mock('../../components/newsletter-card/NewsletterCard.tsx', () => {
  return function MockNewsletterCard({ title, description, image, label }: MockNewsletterCardProps) {
    return (
      <div data-testid="newsletter-card">
        <div data-testid="card-title">{title}</div>
        <div data-testid="card-description">{description}</div>
        <div data-testid="card-image" data-image={image}></div>
        <div data-testid="card-label">{label}</div>
      </div>
    );
  };
});

const mockUseNewsletters = jest.fn();
jest.mock('../../react-query/queries.ts', () => ({
  useNewsletters: () => mockUseNewsletters(),
}));

const theme = createTheme();

const mockNewsletters = [
    {
        id: "000000000000000000000000",
        image: "https://via.placeholder.com/150",
        description: "Dive into the unknown with this week's spotlight!",
        title: "Weekly Wonders",
        site: "DEN",
        subscriptions: ["RIGHT_1"]
    },
    {
        id: "000000000000000000000001",
        image: "https://via.placeholder.com/150",
        description: "Kickstart your week with a burst of inspiration.",
        title: "Marvelous Mondays",
        site: "DAN",
        subscriptions  : ["RIGHT_2"]
    },
    {
        id: "000000000000000000000002",
        image: "https://via.placeholder.com/150",
        description: "Tuesdays just got a lot more exciting!",
        title: "Terrific Tuesdays",
        site: "LAN",
        subscriptions: []
    },
];

const renderWithProviders = (
  component: React.ReactElement,
  userType = 'USER_WITHOUT_SUBSCRIPTION'
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ userType }}>
          {component}
        </UserContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('NewslettersList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetButtonLabel.mockImplementation((subscriptions, userType) => (
      <button data-testid={`button-${userType}`}>
        {subscriptions.length > 0 ? 'S\'inscrire' : 'S\'abonner'}
      </button>
    ));
  });

  test('renders loading state', () => {
    mockUseNewsletters.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      isFetching: false,
    });

    renderWithProviders(<NewslettersList />);

    expect(screen.getByText('Chargement des newsletters')).toBeInTheDocument();
  });

  test('renders error state', () => {
    mockUseNewsletters.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Erreur réseau'),
      isFetching: false,
    });

    renderWithProviders(<NewslettersList />);

    expect(screen.getByText('Erreur lors du chargement des newsletters')).toBeInTheDocument();
  });

  test('renders fetching state', () => {
    mockUseNewsletters.mockReturnValue({
      data: mockNewsletters,
      isLoading: false,
      error: null,
      isFetching: true,
    });

    renderWithProviders(<NewslettersList />);

    expect(screen.getByText('Mise à jour des newsletters')).toBeInTheDocument();
  });

  test('renders newsletters', async () => {
    mockUseNewsletters.mockReturnValue({
      data: mockNewsletters,
      isLoading: false,
      error: null,
      isFetching: false,
    });

    renderWithProviders(<NewslettersList />);

    expect(screen.getByText('DEN')).toBeInTheDocument();
    expect(screen.getByText('DAN')).toBeInTheDocument();
    expect(screen.getByText('LAN')).toBeInTheDocument();

    expect(screen.getByText('Weekly Wonders')).toBeInTheDocument();
    expect(screen.getByText('Marvelous Mondays')).toBeInTheDocument();
    expect(screen.getByText('Terrific Tuesdays')).toBeInTheDocument();

    const newsletterCards = screen.getAllByTestId('newsletter-card');
    expect(newsletterCards).toHaveLength(3);
  });

  test('render with USER_WITHOUT_SUBSCRIPTION', () => {
    mockUseNewsletters.mockReturnValue({
      data: mockNewsletters,
      isLoading: false,
      error: null,
      isFetching: false,
    });

    renderWithProviders(<NewslettersList />, 'USER_WITHOUT_SUBSCRIPTION');

    expect(mockGetButtonLabel).toHaveBeenCalledWith(['RIGHT_1'], 'USER_WITHOUT_SUBSCRIPTION');
    expect(mockGetButtonLabel).toHaveBeenCalledWith(['RIGHT_2'], 'USER_WITHOUT_SUBSCRIPTION');
    expect(mockGetButtonLabel).toHaveBeenCalledWith([], 'USER_WITHOUT_SUBSCRIPTION');
  });

  test('render with USER_WITH_ONE_SUBSCRIPTION', () => {
    mockUseNewsletters.mockReturnValue({
      data: mockNewsletters,
      isLoading: false,
      error: null,
      isFetching: false,
    });

    renderWithProviders(<NewslettersList />, 'USER_WITH_ONE_SUBSCRIPTION');

    expect(mockGetButtonLabel).toHaveBeenCalledWith(['RIGHT_1'], 'USER_WITH_ONE_SUBSCRIPTION');
    expect(mockGetButtonLabel).toHaveBeenCalledWith(['RIGHT_2'], 'USER_WITH_ONE_SUBSCRIPTION');
    expect(mockGetButtonLabel).toHaveBeenCalledWith([], 'USER_WITH_ONE_SUBSCRIPTION');
  });

  test('render with USER_WITH_MULTIPLE_SUBSCRIPTION', () => {
    mockUseNewsletters.mockReturnValue({
      data: mockNewsletters,
      isLoading: false,
      error: null,
      isFetching: false,
    });

    renderWithProviders(<NewslettersList />, 'USER_WITH_MULTIPLE_SUBSCRIPTION');

    expect(mockGetButtonLabel).toHaveBeenCalledWith(['RIGHT_1'], 'USER_WITH_MULTIPLE_SUBSCRIPTION');
    expect(mockGetButtonLabel).toHaveBeenCalledWith(['RIGHT_2'], 'USER_WITH_MULTIPLE_SUBSCRIPTION');
    expect(mockGetButtonLabel).toHaveBeenCalledWith([], 'USER_WITH_MULTIPLE_SUBSCRIPTION');
  });

  test('renders sections with correct structure', () => {
    mockUseNewsletters.mockReturnValue({
      data: mockNewsletters,
      isLoading: false,
      error: null,
      isFetching: false,
    });

    const { container } = renderWithProviders(<NewslettersList />);

    const sections = container.querySelectorAll('section');
    expect(sections).toHaveLength(3);
  });
});