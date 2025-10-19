import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(express.static(path.resolve(__dirname, '..', 'build')));

// API pour les newsletters - lecture du fichier JSON
app.get('/api/newsletters', (req, res) => {
  const newsletterDataPath = path.resolve(__dirname, '..', 'database', 'newsletter-data.json');
  
  fs.readFile(newsletterDataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading newsletter-data.json:', err);
      return res.status(500).json({ error: 'Unable to load newsletters' });
    }
    
    try {
      const newsletterData = JSON.parse(data);
        res.json(newsletterData.newsletters);
    } catch (parseError) {
      console.error('Error parsing newsletter-data.json:', parseError);
      res.status(500).json({ error: 'Invalid newsletter data format' });
    }
  });
});

// Pour toutes les autres routes, servir le fichier index.html avec données préchargées
app.use((req, res) => {
  const indexFile = path.resolve(__dirname, '..', 'build', 'index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return res.status(500).send('Something went wrong');
    }
    
    // Lire les données des newsletters depuis le fichier JSON pour le SSR
    const newsletterDataPath = path.resolve(__dirname, '..', 'database', 'newsletter-data.json');
    let preloadedData = { newsletters: [] };
    
    try {
      const newsletterFileData = fs.readFileSync(newsletterDataPath, 'utf8');
      const newsletterData = JSON.parse(newsletterFileData);
      preloadedData = { newsletters: newsletterData.newsletters };
    } catch (error) {
      console.error('Error loading newsletter data for SSR:', error);
      // En cas d'erreur, on utilise un tableau vide
    }
    
    // Injecter l'état préchargé dans la page
    const htmlWithData = data.replace(
      '</head>',
      `<script>
        window.__REACT_QUERY_STATE__ = {
          queries: [
            {
              queryKey: ["newsletters"],
              queryHash: '["newsletters"]',
              state: {
                data: ${JSON.stringify(preloadedData.newsletters)},
                dataUpdateCount: 1,
                dataUpdatedAt: ${Date.now()},
                error: null,
                errorUpdateCount: 0,
                errorUpdatedAt: 0,
                fetchFailureCount: 0,
                fetchFailureReason: null,
                fetchMeta: null,
                isInvalidated: false,
                status: "success",
                fetchStatus: "idle"
              }
            }
          ]
        };
      </script>
      </head>`
    );
    
    res.send(htmlWithData);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});