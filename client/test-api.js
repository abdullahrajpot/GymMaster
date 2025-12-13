// Simple test script to check gym-fit API endpoints
const API_KEY = "854cfc005bmsh93c2df255ac5509p12e403jsne295bd5cceef";
const BASE_URL = "https://gym-fit.p.rapidapi.com";

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "gym-fit.p.rapidapi.com",
  },
};

async function testEndpoints() {
  const endpoints = [
    // Test the exact working example from your Node.js code
    `${BASE_URL}/v1/exercises/search?limit=50&offset=0&bodyPart=Legs&equipment=Barbell&type=Isolation`,
    // Test simpler versions
    `${BASE_URL}/v1/exercises/search?limit=10&offset=0&bodyPart=Legs`,
    `${BASE_URL}/v1/exercises/search?limit=10&offset=0&bodyPart=Chest`,
    `${BASE_URL}/v1/exercises/search?limit=10&offset=0`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(endpoint, options);
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Data type: ${Array.isArray(data) ? 'Array' : 'Object'}`);
        console.log(`Length/Keys: ${Array.isArray(data) ? data.length : Object.keys(data).length}`);
        if (Array.isArray(data) && data.length > 0) {
          console.log(`First item keys: ${Object.keys(data[0]).join(', ')}`);
          console.log(`Sample exercise:`, data[0].name || data[0].title);
        } else if (typeof data === 'object' && data !== null) {
          console.log(`Object keys: ${Object.keys(data).join(', ')}`);
        }
      }
      console.log('---');
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error.message);
    }
  }
}

testEndpoints();