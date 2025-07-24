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

# Running the Application

## 1. Running with Docker (Recommended for Consistency)

### Build and Start All Services
```sh
docker-compose down -v  # Stop and remove any existing containers/volumes
docker-compose up --build
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/health
- **Database:** Connect on port 5433 (user: postgres, password: admin, db: rmavuluri)

> **Note:** No sample data is loaded by default. The database will be empty on first run.

---

## 2. Running Locally (Without Docker)

### Backend
1. Make sure you have Node.js and Postgres installed locally.
2. Set up your `.env` file in the `backend/` directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=youruser
   DB_PASS=yourpass
   DB_NAME=yourdb
   PORT=4000
   ```
3. Start your local Postgres and ensure the database and user exist.
4. Install dependencies and start the backend:
   ```sh
   cd backend
   npm install
   node index.js
   ```

### Frontend
1. In `vite.config.js`, set the proxy to your local backend:
   ```js
   server: {
     proxy: {
       '/api': 'http://localhost:4000'
     }
   }
   ```
2. Install dependencies and start the frontend:
   ```sh
   npm install
   npm run dev
   ```
3. Access the app at http://localhost:5173 (or the port Vite shows).

---

## 3. Switching Between Docker and Local
- **Vite Proxy:**
  - Docker: `/api` → `http://backend:4000`
  - Local: `/api` → `http://localhost:4000`
- **Backend DB Host:**
  - Docker: `DB_HOST=db`
  - Local: `DB_HOST=localhost`

**Change these settings in `vite.config.js` and your backend `.env` as needed when switching environments.** 