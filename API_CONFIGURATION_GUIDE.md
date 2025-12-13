# Exercise API Configuration Guide

## How to Configure the New RapidAPI Exercise Endpoint

This guide shows you how to configure the application to use the new RapidAPI exercise endpoint: `exercise-db-fitness-workout-gym.p.rapidapi.com`

## Step 1: Create `.env` File

Create a `.env` file in the `client` folder with the following variables:

```env
# Required: Your RapidAPI Key
VITE_EXERCISE_API_KEY=your_rapidapi_key_here

# Optional: New API Configuration
# If you want to use the new API endpoint, uncomment and set these:
VITE_EXERCISE_API_BASE_URL=https://exercise-db-fitness-workout-gym.p.rapidapi.com
VITE_EXERCISE_API_HOST=exercise-db-fitness-workout-gym.p.rapidapi.com

# Optional: YouTube API (for exercise videos)
VITE_YOUTUBE_API_KEY=your_youtube_rapidapi_key_here

# Optional: Backend Server URL
VITE_API_BASE_URL=http://localhost:5000
```

## Step 2: Get Your RapidAPI Key

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up or log in
3. Subscribe to the Exercise DB API:
   - Old API: [ExerciseDB](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
   - New API: [Exercise DB Fitness Workout Gym](https://rapidapi.com/hub)
4. Copy your API key from the dashboard
5. Paste it in your `.env` file as `VITE_EXERCISE_API_KEY`

## Step 3: Configure for New API

To use the new API endpoint (`exercise-db-fitness-workout-gym.p.rapidapi.com`), set these in your `.env`:

```env
VITE_EXERCISE_API_BASE_URL=https://exercise-db-fitness-workout-gym.p.rapidapi.com
VITE_EXERCISE_API_HOST=exercise-db-fitness-workout-gym.p.rapidapi.com
```

## Step 4: Restart Development Server

After updating your `.env` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## API Endpoint Differences

### Old API (Default)
- Base URL: `https://exercisedb.p.rapidapi.com`
- Host: `exercisedb.p.rapidapi.com`
- Endpoints:
  - `/exercises` - Get all exercises
  - `/exercises/bodyPartList` - Get body parts list
  - `/exercises/bodyPart/{bodyPart}` - Get exercises by body part
  - `/exercises/exercise/{id}` - Get exercise by ID
  - `/exercises/target/{target}` - Get exercises by target muscle
  - `/exercises/equipment/{equipment}` - Get exercises by equipment

### New API
- Base URL: `https://exercise-db-fitness-workout-gym.p.rapidapi.com`
- Host: `exercise-db-fitness-workout-gym.p.rapidapi.com`
- Endpoints (may differ):
  - `/list/equipment` - Get equipment list
  - `/list/bodyPart` - Get body parts list
  - Other endpoints may vary

**Note:** The code automatically tries the new API endpoints first and falls back to old endpoints if the new ones don't work.

## Testing Your Configuration

1. Check that your `.env` file is in the `client` folder
2. Verify your API key is correct
3. Start the development server
4. Navigate to the Exercise page
5. Check the browser console for any API errors

## Troubleshooting

### Error: "Failed to load resource: 429"
- **Cause:** Rate limit exceeded
- **Solution:** Wait a few minutes or upgrade your RapidAPI plan

### Error: "Failed to load resource: 403"
- **Cause:** Invalid API key or subscription expired
- **Solution:** Check your API key and ensure your subscription is active

### Error: "Failed to load resource: 401"
- **Cause:** Missing or invalid API key
- **Solution:** Verify `VITE_EXERCISE_API_KEY` in your `.env` file

### API Not Working
- Make sure you've restarted the dev server after changing `.env`
- Check that your `.env` file is in the `client` folder (not root)
- Verify the API key is correct (no extra spaces or quotes)
- Check the RapidAPI dashboard to ensure your subscription is active

## Example `.env` File

```env
# For New API
VITE_EXERCISE_API_KEY=abc123xyz789
VITE_EXERCISE_API_BASE_URL=https://exercise-db-fitness-workout-gym.p.rapidapi.com
VITE_EXERCISE_API_HOST=exercise-db-fitness-workout-gym.p.rapidapi.com
VITE_YOUTUBE_API_KEY=def456uvw012
VITE_API_BASE_URL=http://localhost:5000
```

## Security Note

⚠️ **Never commit your `.env` file to version control!** It contains sensitive API keys. The `.env` file should already be in `.gitignore`.

