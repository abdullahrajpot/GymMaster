# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Environment variables

Create a `.env` file in the client folder by copying `.env.example` and populating the values:

```bash
cp .env.example .env
# Or manually create .env and add the keys
```

### Required Variables:
- `VITE_EXERCISE_API_KEY` — RapidAPI key for exercise DB (get from RapidAPI dashboard)

### Optional Variables (with defaults):
- `VITE_EXERCISE_API_BASE_URL` — Base URL for exercise API
  - Default: `https://exercisedb.p.rapidapi.com` (old API)
  - Alternative: `https://exercise-db-fitness-workout-gym.p.rapidapi.com` (new API)
- `VITE_EXERCISE_API_HOST` — Host header for exercise API
  - Default: `exercisedb.p.rapidapi.com` (old API)
  - Alternative: `exercise-db-fitness-workout-gym.p.rapidapi.com` (new API)
- `VITE_YOUTUBE_API_KEY` — RapidAPI key for YouTube search
- `VITE_API_BASE_URL` — API base URL for backend server (default: `http://localhost:5000`)

### Using the New Exercise API

To use the new RapidAPI endpoint (`exercise-db-fitness-workout-gym.p.rapidapi.com`), add these to your `.env` file:

```env
VITE_EXERCISE_API_KEY=your_rapidapi_key_here
VITE_EXERCISE_API_BASE_URL=https://exercise-db-fitness-workout-gym.p.rapidapi.com
VITE_EXERCISE_API_HOST=exercise-db-fitness-workout-gym.p.rapidapi.com
```

**Note:** The new API may have different endpoint structures. The code will try the new endpoints first and fallback to old endpoints if needed.

Restart the dev server after making changes to `.env`.
