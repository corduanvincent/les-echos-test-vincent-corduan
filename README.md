# Projet Les Échos

Le projet est en React, Benjamin m'a dit que je pouvais choisir entre React et Next, j'ai choisi React car j'ai plus d'expérience que sur Next (seulement un projet dans mon background, mais très envie d'en faire plus).
J'ai conscience de toutes les possibilités avec Next, notamment sur le routing et le SSR qui sont gérés nativement et plus simplement, cependant je voulais vous montrer mes capacités et mon expertise sur React.


## Lancement du projet

À la racine du projet lancer :

### `npm run server:ssr`

Le serveur tourne avec Node.js sur le port 3001
Ouvrir dans le navigateur [http://localhost:3001](http://localhost:3001).

Une API a été créée via Express qui reprend le JSON présent dans /database/newsletter-data.json

Disponible avec cette URL : [http://localhost:3001/api/newsletters](http://localhost:3001/api/newsletters)

### `npm run test`

Les tests unitaires ont été développés avec React Testing Library.

### `npx eslint src/`

ESLint est configuré sur le projet, il faut lancer la commande manuellement dans le terminal.
ESLint est configuré pour lancer un fix à chaque commit sur les fichiers .tsx et .ts (voir lint-staged dans le package.json)

## react-router-dom

J'ai utilisé react-router-dom principalement pour gérer une page de login : [http://localhost:3001/login](http://localhost:3001/login). 

Visuellement c'est une modal mais en réalité c'est bien une page. Cette approche permet de retourner sur la page principale sans avoir à recharger la page.

C'est un enfant de ```<RootLayout>``` qui contient une action postUserAction dont le but est de remonter la valeur envoyée par le formulaire au Context Provider, dont j'expliquerai la fonction plus bas.
Cette approche permet de confier pleinement la gestion du formulaire à react-router-dom via le composant ```<Form>```.
Ici il récupère la valeur renvoyée par submit, la définit dans une action et l'envoie via l'URL en utilisant ```redirect()```.

Si vous ne m'aviez pas demandé de gérer les données côté serveur pour faire du server side rendering, j'aurais probablement géré l'appel via un ```Loader()``` que j'aurais rattaché à l'enfant ```<NewslettersList>```.
Ceci aurait permis de lancer "parallèlement" l'appel aux données et le render du composant. Dans le même but d'optimiser la performance.

## Context Provider

Étant donné que l'on ait besoin de la donnée "utilisateur" sur l'ensemble de l'application (ici uniquement pour la gestion des abonnements mais imaginons que l'on souhaite ajouter d'autres composants à l'avenir), il était selon moi évident d'utiliser le Context Provider.
J'aurais pu aussi utiliser le localStorage ou le sessionStorage mais c'était difficilement compatible avec le SSR.

## SSR

Dans un souci de temps et d'expérience, j'ai choisi volontairement de faire du server side rendering pour injecter UNIQUEMENT les données de newsletter-data.json dans le HTML.
J'aurais pu suivre un tutoriel pour faire une application full SSR mais je préfère vous montrer ce que je sais faire vraiment au quotidien.

Dans le projet, un serveur Express a été créé : server/server-ssr.js, à l'intérieur j'ai simulé une API REST pour aller chercher les newsletters dans le database/newsletter-data.json.
Ensuite, il y a une lecture du index.html actuel, un préchargement des données des newsletters, un HTML enrichi avec ces mêmes données et une injection de ce HTML enrichi dans le nouveau HTML rendu.
Enfin, côté client, les données sont déshydratées au niveau de ```<App>```.

Le serveur a été configuré pour garder les données rendues. Ainsi le SSR fonctionne lors du chargement des nouvelles données, mais lorsque vous rechargez la page par exemple, on repasse en mode CSR. On ne refait pas appel à toute la logique serveur à chaque render.
Tout ceci est visible dans ```<Index>``` avec l'état déshydraté.

Pour améliorer cette approche SSR, il faudrait render également les composants côté serveur.

## React Query

Ici React Query gère le cache des newsletters avec une hydratation SSR qui permet d'afficher les données immédiatement sans état de chargement initial.

Les données préchargées par le serveur dans ```window.__REACT_QUERY_STATE__``` sont automatiquement récupérées par React Query au niveau du composant <Hydrate>, évitant ainsi le premier appel API.
La configuration désactive les refetch automatiques (refetchOnWindowFocus: false) pour optimiser les performances.

## Sémantique HTML

J'ai bien pensé à livrer une structure HTML propre.
Les balises ```<header>```, ```<nav>```, ```<main>```, ```<section>``` sont utilisées à bon escient ainsi que l'ordre des titres ```<h1>```, ```<h2>``` etc.
Important pour le SEO et l'accessibilité numérique.

## Composant pur

Il est important pour moi de suivre une logique container / composant pur.
Par exemple ```<NewsletterContainer>```, est le premier container qui va servir notamment aux éléments les plus en amont comme le context Provider.
Ensuite ```<NewsletterList>``` va lui gérer la logique métier, la récupération de données via hooks, gérer les différents états, les fonctions de formatage, etc.
Quant à ```<NewsletterCard>```, il est un composant pur, c'est-à-dire qu'il prend des inputs en entrée et ne dépend que d'eux. Pas de useState ni de useEffect. Il peut être réutilisé partout.

## Material-UI

J'ai l'habitude de travailler avec une librairie de composants indépendante créée par mon entreprise actuelle (Société Générale).
J'ai donc choisi d'utiliser Material-UI qui y ressemble un peu. C'est la première fois que je l'utilise, je n'ai pas encore saisi tous les paramètres et les possibilités. J'ai essayé de produire quelque chose qui ressemble au maximum à la maquette fournie.
J'aurais pu développer des feuilles de style CSS moi-même car j'avais l'habitude de le faire il y a quelques années lorsque l'on n'utilisait pas encore React et donc la librairie actuelle mais cela aurait pris beaucoup plus de temps.
