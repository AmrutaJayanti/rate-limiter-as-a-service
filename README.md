# 🚦 Rate Limiter as a Service

A simple **API Rate Limiter** built using Node.js + Express, implementing the **Token Bucket Algorithm**. Each client (IP) has its own bucket to control request rates, helping prevent abuse and manage traffic efficiently.

## 💡 Features

- Token Bucket Algorithm for precise rate limiting.
- Per-client (IP) buckets to track requests individually.
- Customizable limits per route:
    - Example: `/` → 100 requests max, 5 tokens/sec refill
    - `/api` → 10 requests max, 2 tokens/sec refill
- Rate-limit headers for clients:
    - `X-RateLimit-Limit` → maximum allowed tokens
    - `X-RateLimit-Remaining` → remaining tokens
    - `X-RateLimit-Reset` → seconds until tokens are refilled
- Blocked request tracking via /stats endpoint.
- Test scripts using Axios to simulate sequential or burst requests.

## 🛠 Tech Stack
- Node.js
- Express.js
- Axios (for test client script)

## 📡 API Endpoints
#### Public Route
```
GET /
```
- Less strict limits (100 tokens, 5/sec)

Example:
```
curl -i http://localhost:3000/
```

#### API Route
```
GET /api
```

- Strict limits (10 tokens, 2/sec)

Example:
```
curl -i http://localhost:3000/api
```

#### Stats Route

```
GET /stats
```

- Shows current users and blocked request count:

```
curl http://localhost:3000/stats
```


#### 🧪 Testing Rate Limiter
```
node testClient.js
```

- Sends requests one after another
- Logs which requests succeed and which are blocked

