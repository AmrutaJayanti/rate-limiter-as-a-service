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

### 🐳 How Docker and Kubernetes Help This Project

This project is a mini version of a real-world deployment setup that uses Docker and Kubernetes to make the app easier to run, manage, and scale.

##### 🧱 Docker – Containerization

Docker is used to package the project (code, dependencies, and environment) into a single container image.
This helps in:

- Running the app the same way on any system (no “it works on my machine” issues).
- Making setup easier — no need to install multiple dependencies manually.
- Allowing others to quickly test or run the app using one simple command.

```
docker build -t myapp .
docker run -p 3000:3000 myapp
```

##### ☸️ Kubernetes – Orchestration

Kubernetes is used to simulate **real-world deployment and scaling**.
Even though this is a mini project, it shows how production systems handle containers automatically.

It helps to:

- Run multiple instances (Pods) of the app for reliability.
- Restart Pods automatically if something fails.
- Expose the app via a Service for easy access.
- Manage deployments using simple YAML configuration files.

### ⚙️ In Simple Words

> Docker → Packs the app into a container.
>
> Kubernetes → Runs and manages those containers efficiently.
>
> Jenkins -> Automates CI/CD
