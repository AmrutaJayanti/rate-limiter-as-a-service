/* Token Bucket Rate Limiter
   - Each client (IP) has its own bucket
   - Refill tokens based on elapsed time
   - If ≥ 1 token → allow request
   - Else → block (429 error)
*/

const express = require("express");
const app = express();

// Store token buckets for each user
const buckets = new Map();
let blockedCount = 0; // Track number of blocked requests

// =====================
// Create Rate Limiter Middleware
// =====================
function createRateLimiter(MAX_TOKENS, REFILL_RATE) {
  return (req, res, next) => {
    const userId = req.ip; // Using IP address as user identifier
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Initialize bucket if not exists
    if (!buckets.has(userId)) {
      buckets.set(userId, {
        tokens: MAX_TOKENS,
        lastRefill: currentTime,
      });
    }

    const bucket = buckets.get(userId);
    const elapsedTime = currentTime - bucket.lastRefill;
    const tokensToAdd = Math.floor(elapsedTime * REFILL_RATE);

    // Refill tokens
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(bucket.tokens + tokensToAdd, MAX_TOKENS);
      bucket.lastRefill = currentTime;
    }

    const remaining = Math.floor(bucket.tokens);
    const resetTime = Math.ceil((MAX_TOKENS - bucket.tokens) / REFILL_RATE);

    // Check if tokens are available
    if (bucket.tokens > 0) {
      bucket.tokens -= 1; // Consume one token

      res.set({
        "X-RateLimit-Limit": MAX_TOKENS,
        "X-RateLimit-Remaining": remaining - 1,
        "X-RateLimit-Reset": resetTime,
      });

      return next(); // Allow request
    } else {
      blockedCount += 1; // Increment blocked requests
      res.set({
        "X-RateLimit-Limit": MAX_TOKENS,
        "X-RateLimit-Remaining": 0,
        "X-RateLimit-Reset": resetTime,
      });

      return res.status(429).json({
        error: "Too Many Requests - Rate limit exceeded",
        message: `Please try again in ${resetTime} seconds.`,
      });
    }
  };
}

// =====================
// Routes
// =====================

// Public route → bigger bucket
app.get("/", createRateLimiter(100, 5), (req, res) => {
  res.send("Welcome to the rate-limited API!");
});

// Strict route → small bucket
app.get("/api", createRateLimiter(10, 2), (req, res) => {
  res.json({ success: true, time: new Date().toISOString() });
});

// Stats route
app.get("/stats", (req, res) => {
  res.json({
    totalUsers: buckets.size,
    blockedRequests: blockedCount,
    users: Array.from(buckets.keys()),
  });
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ----- END -----
