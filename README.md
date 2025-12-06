# APIs Populi

**REST APIs for Everyone** - A collection of 5 fully-featured RESTful APIs for testing, learning, and development.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

**Live Demo:** [https://testapi.contractkit.app](https://testapi.contractkit.app)

## Overview

APIs Populi provides 5 diverse REST APIs with:
- Real-world data (actual airports, classic books, real planets)
- Multiple authentication methods (JWT, OAuth2, API Key, Basic Auth, Session Cookies)
- Async processing patterns (polling and webhooks)
- Comprehensive OpenAPI documentation
- Rate limiting with standard headers
- Pagination, filtering, and sorting

## Available APIs

| API | Description | Authentication |
|-----|-------------|----------------|
| **Flights** | Aviation API with airports, airlines, flights, and bookings | JWT Bearer, OAuth2 |
| **Books** | Library API with classic literature, authors, and reviews | API Key |
| **Warehouse** | Inventory management with polymorphic items | Basic Auth, Custom Header |
| **School** | Education management with students, teachers, and grades | Session Cookie, API Key |
| **Space** | Cosmic database with planets, stars, galaxies, and missions | JWT Bearer, Basic Auth |

## Quick Start

### Installation

```bash
git clone https://github.com/MarkoVcode/apis-populi.git
cd apis-populi
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
# Optional: Vercel KV (uses in-memory store if not configured)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# JWT Secret (defaults to 'development-secret' in dev)
JWT_SECRET=your-secret-key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## API Usage Examples

### Flights API (JWT + OAuth2)

```bash
# Get JWT token
curl -X POST http://localhost:3000/api/flights/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'

# Use token to access endpoints
curl http://localhost:3000/api/flights/airports \
  -H "Authorization: Bearer <token>"

# Create async booking (returns job_id for polling)
curl -X POST http://localhost:3000/api/flights/bookings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"flight_id":"...","passengers":[{"first_name":"John","last_name":"Doe"}]}'
```

### Books API (API Key)

```bash
# List books
curl http://localhost:3000/api/books/books \
  -H "X-API-Key: test-api-key-1"

# Search books
curl "http://localhost:3000/api/books/search?q=pride" \
  -H "X-API-Key: test-api-key-1"

# API key also works as query parameter
curl "http://localhost:3000/api/books/books?api_key=test-api-key-1"
```

### Warehouse API (Basic Auth + Custom Header)

```bash
# Using Basic Auth
curl http://localhost:3000/api/warehouse/items \
  -u warehouse_user:warehouse_pass

# Using Custom Header
curl http://localhost:3000/api/warehouse/items \
  -H "X-Warehouse-Token: warehouse-token-1"

# Create order with webhook (async)
curl -X POST http://localhost:3000/api/warehouse/orders \
  -u warehouse_user:warehouse_pass \
  -H "Content-Type: application/json" \
  -d '{"items":[{"sku":"ELEC-TV-001","quantity":1}],"customer":{"name":"John"},"webhook_url":"https://your-webhook.com/callback"}'
```

### School API (Session Cookie + API Key)

```bash
# Login to get session cookie
curl -X POST http://localhost:3000/api/school/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"school123"}' \
  -c cookies.txt

# Use session cookie
curl http://localhost:3000/api/school/students \
  -b cookies.txt

# Or use API Key
curl http://localhost:3000/api/school/students \
  -H "X-API-Key: school-api-key-1"
```

### Space API (JWT + Basic Auth)

```bash
# Using Basic Auth
curl http://localhost:3000/api/space/planets \
  -u space_user:space_pass

# Calculate distance between objects
curl "http://localhost:3000/api/space/distance?from=planet-earth&to=planet-mars" \
  -u space_user:space_pass

# Compare celestial bodies
curl "http://localhost:3000/api/space/compare?ids=planet-earth,planet-mars,planet-jupiter" \
  -u space_user:space_pass
```

## Common Features

### Pagination

All list endpoints support pagination:

```bash
curl "http://localhost:3000/api/books/books?page=1&limit=20&sort=title&order=asc" \
  -H "X-API-Key: test-api-key-1"
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### Filtering

```bash
# Equality filter
curl "http://localhost:3000/api/books/books?genre=fiction"

# Multiple values
curl "http://localhost:3000/api/flights/flights?status=scheduled,boarding"

# Range filter
curl "http://localhost:3000/api/books/books?year_min=1900&year_max=1950"

# Search
curl "http://localhost:3000/api/books/books?q=shakespeare"

# Date range
curl "http://localhost:3000/api/flights/flights?departure_from=2024-01-01&departure_to=2024-12-31"
```

### Rate Limiting

All APIs include rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699900000
```

When exceeded, returns `429 Too Many Requests` with `Retry-After` header.

| API | Requests/minute |
|-----|-----------------|
| Flights | 60 |
| Books | 100 |
| Warehouse | 50 |
| School | 80 |
| Space | 120 |

### OpenAPI Specs

Each API provides its OpenAPI 3.0 specification:

```bash
curl http://localhost:3000/api/books/openapi.yaml
curl http://localhost:3000/api/flights/openapi.yaml
curl http://localhost:3000/api/warehouse/openapi.yaml
curl http://localhost:3000/api/school/openapi.yaml
curl http://localhost:3000/api/space/openapi.yaml
```

### Data Reset

Reset any API to its initial state:

```bash
curl -X POST http://localhost:3000/api/books/reset \
  -H "X-API-Key: test-api-key-1"
```

## Authentication Reference

### JWT Bearer Token

Used by: Flights, Space

```bash
# Get token
curl -X POST http://localhost:3000/api/flights/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'

# Use token
curl http://localhost:3000/api/flights/airports \
  -H "Authorization: Bearer eyJhbG..."
```

### OAuth2 (Flights API only)

```bash
# 1. Get authorization code
curl -X POST http://localhost:3000/api/flights/auth/oauth/authorize \
  -H "Content-Type: application/json" \
  -d '{"client_id":"demo-client","redirect_uri":"http://localhost:3000/callback","scope":"read write"}'

# 2. Exchange code for token
curl -X POST http://localhost:3000/api/flights/auth/oauth/token \
  -H "Content-Type: application/json" \
  -d '{"grant_type":"authorization_code","code":"<auth_code>","client_id":"demo-client","client_secret":"demo-secret"}'
```

### API Key

Used by: Books, School

```bash
# Header
curl http://localhost:3000/api/books/books \
  -H "X-API-Key: test-api-key-1"

# Query parameter
curl "http://localhost:3000/api/books/books?api_key=test-api-key-1"
```

### Basic Auth

Used by: Warehouse, Space

```bash
curl http://localhost:3000/api/warehouse/items \
  -u warehouse_user:warehouse_pass
```

### Session Cookie

Used by: School

```bash
# Login
curl -X POST http://localhost:3000/api/school/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"school123"}' \
  -c cookies.txt

# Use cookie
curl http://localhost:3000/api/school/students -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/school/auth/logout -b cookies.txt
```

### Custom Header

Used by: Warehouse (X-Warehouse-Token)

```bash
curl http://localhost:3000/api/warehouse/items \
  -H "X-Warehouse-Token: warehouse-token-1"
```

## Demo Credentials

| API | Credential Type | Value |
|-----|-----------------|-------|
| Flights | Username/Password | `demo` / `demo123` |
| Flights OAuth | Client ID/Secret | `demo-client` / `demo-secret` |
| Books | API Key | `test-api-key-1`, `test-api-key-2` |
| Warehouse | Basic Auth | `warehouse_user` / `warehouse_pass` |
| Warehouse | Token | `warehouse-token-1` |
| School | Login | `admin` / `school123` |
| School | API Key | `school-api-key-1` |
| Space | Basic Auth | `space_user` / `space_pass` |

## Async Processing

### Polling Pattern (Flights)

Flight bookings use async processing with polling:

```bash
# 1. Create booking - returns job_id
curl -X POST http://localhost:3000/api/flights/bookings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"flight_id":"...","passengers":[...]}'

# Response: { "job_id": "abc123", "status": "processing" }

# 2. Poll for status
curl http://localhost:3000/api/flights/bookings/abc123/status \
  -H "Authorization: Bearer <token>"

# Response: { "status": "processing", "progress": 45, "eta_seconds": 25 }
# Or: { "status": "completed", "booking_id": "..." }
```

### Webhook Pattern (Warehouse)

Warehouse orders support webhook notifications:

```bash
# Create order with webhook URL
curl -X POST http://localhost:3000/api/warehouse/orders \
  -u warehouse_user:warehouse_pass \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"sku":"ELEC-TV-001","quantity":1}],
    "customer": {"name":"John Doe","email":"john@example.com"},
    "webhook_url": "https://your-server.com/webhook"
  }'

# Your webhook will receive a POST when the order is fulfilled
```

## Data Overview

| API | Data |
|-----|------|
| Flights | 25 airports, 15 airlines, 90+ flights, bookings |
| Books | 200+ books, 20 authors, 10 publishers, reviews |
| Warehouse | 25 items (5 per type), 5 locations, orders, shipments |
| School | 200 students, 50 teachers, 20 subjects, 40 classes, grades |
| Space | 12 planets, 20 stars, 10 galaxies, 88 constellations, missions |

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (KV credentials, JWT secret)
4. Deploy

### Environment Variables for Production

```env
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
JWT_SECRET=your-production-secret
```

## Project Structure

```
apis-populi/
├── app/
│   ├── page.tsx                 # Landing page
│   └── api/
│       ├── flights/             # Flights API routes
│       ├── books/               # Books API routes
│       ├── warehouse/           # Warehouse API routes
│       ├── school/              # School API routes
│       └── space/               # Space API routes
├── lib/
│   ├── auth/                    # Authentication modules
│   ├── data/                    # Seed data and stores
│   ├── db/                      # KV storage wrapper
│   └── utils/                   # Utilities
└── public/
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with care for developers, testers, and learners everywhere.
