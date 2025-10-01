// testClient.js
const axios = require("axios");

const URL = "http://localhost:3000/api"; // Your API endpoint
const TOTAL_REQUESTS = 20;

async function runTest() {
  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    try {
      const res = await axios.get(URL);
      console.log(
        `✅ Request ${i}: ${res.status} ${res.statusText} | Remaining: ${res.headers["x-ratelimit-remaining"]}`
      );
    } catch (err) {
      if (err.response) {
        console.log(
          `❌ Request ${i}: ${err.response.status} ${err.response.statusText} | ${err.response.data.error}`
        );
      } else {
        console.error(`Request ${i}: Failed - ${err.message}`);
      }
    }
  }
}

runTest();
