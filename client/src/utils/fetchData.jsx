// Exercise API Configuration - Updated for current ExerciseDB API
const EXERCISE_API_BASE_URL = import.meta.env.VITE_EXERCISE_API_BASE_URL || "https://exercisedb.p.rapidapi.com";
const EXERCISE_API_HOST = import.meta.env.VITE_EXERCISE_API_HOST || "exercisedb.p.rapidapi.com";

// Check if using new API
const IS_NEW_API = EXERCISE_API_BASE_URL.includes('gym-fit.p.rapidapi.com');

// Helper function to encode URL parameters
const encodeUrlParam = (param) => {
  return encodeURIComponent(param);
};

const exerciseOptions = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": import.meta.env.VITE_EXERCISE_API_KEY,
    "X-RapidAPI-Host": EXERCISE_API_HOST,
  },
};

const youtubeExerciseOptions = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": import.meta.env.VITE_YOUTUBE_API_KEY,
    "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
  },
};

// Simple cache to reduce API calls
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting: track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // Minimum 100ms between requests

const fetchData = async (url, options, retryCount = 0) => {
  try {
    // Check cache first
    const cacheKey = url;
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // Rate limiting: wait if needed
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();

    const response = await fetch(url, options);
    
    // Handle rate limit (429) with retry
    if (response.status === 429) {
      if (retryCount < 3) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, retryCount) * 1000;
        console.warn(`Rate limit hit (429). Retrying after ${waitTime}ms... (Attempt ${retryCount + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchData(url, options, retryCount + 1);
      } else {
        console.error(`API Error: 429 Rate Limit Exceeded for ${url}. Please wait a few minutes.`);
        return [];
      }
    }
    
    // Handle forbidden (403) - usually API key or subscription issue
    if (response.status === 403) {
      console.error(`API Error: 403 Forbidden for ${url}. Check your API key and subscription.`);
      return [];
    }
    
    // Check if response is OK (status 200-299)
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText} for ${url}`);
      
      // Log additional details for debugging
      if (response.status === 404) {
        console.error(`404 Not Found: The endpoint ${url} does not exist. Check if the API structure has changed.`);
      }
      
      return [];
    }
    
    const data = await response.json();
    
    // Cache successful responses
    if (data && (Array.isArray(data) || (typeof data === 'object' && !data.error))) {
      apiCache.set(cacheKey, { data, timestamp: Date.now() });
    }
    
    // Ensure we return an array if the endpoint should return an array
    if (Array.isArray(data)) {
      return data;
    }
    
    // If it's an object but might be an error, check for common error properties
    if (data && typeof data === 'object' && (data.message || data.error)) {
      console.error('API returned error:', data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};


const BASE_URL="http://localhost:5000";

export { fetchData, exerciseOptions, youtubeExerciseOptions, BASE_URL, EXERCISE_API_BASE_URL, encodeUrlParam, IS_NEW_API };
