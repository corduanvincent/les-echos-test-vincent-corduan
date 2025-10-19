import React from 'react';
import { useUser } from '../../components/newsletters-container/NewslettersContainer.tsx';
import NewsletterCard from '../../components/newsletter-card/NewsletterCard.tsx';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { getButtonLabel } from '../../utils/Utils.tsx';
import { useNewsletters } from '../../react-query/queries.ts';

interface Newsletter {
  id: string;
  title: string;
  description: string;
  site: string;
  image: string;
  subscriptions: string[];
}

type UserType = 'USER_WITHOUT_SUBSCRIPTION' | 'USER_WITH_ONE_SUBSCRIPTION' | 'USER_WITH_MULTIPLE_SUBSCRIPTION';

function NewsletterList() {
  const { data: newsletters, isLoading, error, isFetching } = useNewsletters();
  const { userType } = useUser() as { userType: UserType };

  // Gestion errors
  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" gutterBottom>
          Erreur lors du chargement des newsletters
        </Typography>
      </Container>
    );
  }

  // Gestion loading
  if (isLoading && !newsletters) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" gutterBottom>
          Chargement des newsletters
        </Typography>
      </Container>
    );
  }

  // Gestion fetching
  if (isFetching && newsletters) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" gutterBottom>
          Mise à jour des newsletters
        </Typography>
      </Container>
    );
  }

  // regroupement des newsletters par "site" en utilisant la methode reduce pour créer un objet de tableaux
  const groupedBySite = (Array.isArray(newsletters) ? newsletters : []).reduce((acc: Record<string, Newsletter[]>, newsletter: Newsletter) => {
    const site = newsletter.site;
    if (!acc[site]) {
      acc[site] = [];
    }
    acc[site].push(newsletter);
    return acc;
  }, {} as Record<string, Newsletter[]>);

  return (
    <>
      <Container maxWidth="lg">
        {/* utilisation de Object.entries afficher chaque groupe avec son titre */}
        {groupedBySite && Object.entries(groupedBySite).map(([site, siteNewsletters]) => (
        <section key={site}>
          <Box mb={2} mt={6}>
            <Typography
              variant="h2"
              fontSize={{ xs: '1rem', sm: '1.5rem' }}
            >
              {site}
            </Typography>
          </Box>
          <Grid container spacing={4} direction="row">
              {(siteNewsletters as Newsletter[]).map((newsletter) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={newsletter.id}>
                    <NewsletterCard
                      title={newsletter.title}
                      description={newsletter.description}
                      image={newsletter.image}
                      label={getButtonLabel(newsletter.subscriptions, userType as UserType)}
                    />
                </Grid>
              ))}
          </Grid>
        </section>
      ))}
      </Container>
    </>
  );
}

export default NewsletterList;