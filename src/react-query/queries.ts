import { useQuery } from '@tanstack/react-query';

interface Newsletter {
  id: string;
  title: string;
  description: string;
  site: string;
  image: string;
  subscriptions: string[];
}

export async function fetchNewsletters(): Promise<Newsletter[]> {
  // URL relative - s'adapte automatiquement à l'environnement
  const response = await fetch('/api/newsletters');
  if (!response.ok) {
    throw new Error("Pas de newsletters trouvées !");
  }
  return response.json();
}

export function useNewsletters() {
  return useQuery({
    queryKey: ['newsletters'],
    queryFn: fetchNewsletters,
  });
}

export const NEWSLETTERS_QUERY_KEY = ['newsletters'];