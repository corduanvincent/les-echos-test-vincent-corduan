import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Récupérer l'état déshydraté du SSR
const dehydratedState = (window as unknown as { __REACT_QUERY_STATE__?: unknown }).__REACT_QUERY_STATE__;

const root = ReactDOM.createRoot(document.getElementById('root')!);

if (dehydratedState) {
  // Mode SSR : hydrater l'application avec l'état préchargé
  root.render(
    <React.StrictMode>
      <App dehydratedState={dehydratedState} />
    </React.StrictMode>
  );
} else {
  // Mode CSR classique : rendu normal
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}