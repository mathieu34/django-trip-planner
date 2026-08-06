# Frontend `findmyattractions_frontend`

React + Vite + Tailwind CSS avec un thème Wanderlust. Consomme l'API du backend Django (`findmyattractions_backend/`) via axios, pas d'accès direct à TripAdvisor côté front.

## Architecture

```
src/
    api/
    services/
    context/
    components/
    pages/
    assets/
    .......
```

## Comment ça marche

- `src/App.jsx` : routes (`react-router-dom`) -> une page par route (`src/pages/`)
- `src/api/api.js` : instance axios partagée, `baseURL: http://localhost:8000/api`
- `src/components/` : composants réutilisables entre plusieurs pages (ex: `AttractionCard`, `Navbar`)
- `tailwind.config.js` : thème "Sunset Wanderlust" (couleurs/variables CSS custom)
- `src/context/` : utilisation de `UserContext` qui permet de partager dans toute l'application le profil utilisateur sélectionné
- `src/services/` : appels API backend (ex: `createProfile()`)

## Lancer le frontend

```powershell
npm install
npm run dev
```

Ouvre `http://localhost:3000` (port fixé dans `vite.config.js` pour matcher `CORS_ALLOWED_ORIGINS` côté Django — ne pas changer l'un sans l'autre).

Le backend doit tourner en parallèle (voir le `README.md` global pour le lancer).