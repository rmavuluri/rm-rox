# rm-rox

A medium-sized React web app scaffolded with Vite and Tailwind CSS.

## Features
- React 18 with functional components
- Routing with react-router-dom
- Global dark mode with context
- Error boundary and loading spinner
- Mock API service
- Modular folder structure

## Getting Started

### Install dependencies
```bash
npm install
```

### Run the app
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

## Project Structure
```
src/
  components/      # Reusable UI components
  hooks/           # Custom hooks and context
  pages/           # Route-based pages
  services/        # API and data services
  utils/           # Utility functions
  App.jsx          # Main app component
  main.jsx         # Entry point
  index.css        # Tailwind CSS imports
```

## Customization
- Add more pages to `src/pages/` and routes in `App.jsx`.
- Add more services to `src/services/`.
- Add more components to `src/components/`.

---

MIT License 