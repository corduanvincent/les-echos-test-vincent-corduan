import React from 'react';
import { QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getQueryClient } from './react-query/queryClient.ts';
import RouteLayout from './routes/RootLayout.tsx';
import NewsletterList from './routes/newsletters-list/NewslettersList.tsx';
import Login, { action as postUserAction } from './routes/login/Login.tsx';

interface AppProps {
  dehydratedState?: unknown;
}

function App({ dehydratedState }: AppProps) {
  const queryClient = getQueryClient();

  const router = createBrowserRouter([
    {
      element: <RouteLayout />,
      children: [
        {
          index: true,
          path: '/',
          element: <NewsletterList />,
        },
        { 
          path: '/login', 
          element: <Login />,
          action: postUserAction,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default App;