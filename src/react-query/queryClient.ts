import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Côté serveur : toujours créer un nouveau client
    return createQueryClient();
  } else {
    // Côté client : réutiliser le client existant ou en créer un nouveau
    if (!browserQueryClient) browserQueryClient = createQueryClient();
    return browserQueryClient;
  }
}