import { NextResponse } from 'next/server';

const openApiSpec = `openapi: 3.0.3
info:
  title: Flights API
  description: |
    ## Overview

    The **Flights API** is a comprehensive, production-ready aviation API that provides complete access to airports, airlines, flights, and booking management. Built for developers who need realistic flight data for testing, prototyping, or educational purposes.

    ### Key Features

    | Feature | Description |
    |---------|-------------|
    | **Real IATA Codes** | 25+ major international airports with accurate IATA codes |
    | **15+ Airlines** | Major carriers including American Airlines, British Airways, Emirates, and more |
    | **90+ Flight Routes** | Realistic routes between major hubs worldwide |
    | **Async Booking** | Simulates real-world payment processing with polling pattern |
    | **OAuth2 & JWT** | Enterprise-grade authentication options |

    ## Getting Started

    ### Quick Start (3 Steps)

    1. **Get an access token:**
       \`\`\`bash
       curl -X POST https://testapi.contractkit.app/api/flights/auth/token \\
         -H "Content-Type: application/json" \\
         -d '{"username": "demo", "password": "demo123"}'
       \`\`\`

    2. **Search for flights:**
       \`\`\`bash
       curl https://testapi.contractkit.app/api/flights/flights?origin=JFK&destination=LAX \\
         -H "Authorization: Bearer YOUR_TOKEN"
       \`\`\`

    3. **Create a booking:**
       \`\`\`bash
       curl -X POST https://testapi.contractkit.app/api/flights/bookings \\
         -H "Authorization: Bearer YOUR_TOKEN" \\
         -H "Content-Type: application/json" \\
         -d '{"flight_id": "flight-0-0", "cabin_class": "economy", "passengers": [{"first_name": "John", "last_name": "Doe", "date_of_birth": "1990-01-15"}]}'
       \`\`\`

    ## Authentication

    This API supports two authentication methods:

    ### JWT Bearer Token (Recommended for Testing)

    Use this method for quick access during development and testing:

    1. Obtain a token via \`POST /auth/token\` with your credentials
    2. Include the token in the \`Authorization\` header: \`Bearer <token>\`
    3. Tokens expire after **24 hours**

    ### OAuth2 Authorization Code Flow (Recommended for Production)

    Use this method for delegated access in production applications:

    1. Initiate authorization via \`POST /auth/oauth/authorize\`
    2. Exchange the authorization code for tokens via \`POST /auth/oauth/token\`
    3. Access tokens expire after **1 hour**; use refresh tokens to obtain new ones

    ## Async Booking Process

    Flight bookings are processed **asynchronously** to simulate real-world payment and seat allocation systems:

    \`\`\`
    ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
    │  POST /bookings │────▶│  Poll /status   │────▶│  Get Booking    │
    │  Returns job_id │     │  Every 2-5 sec  │     │  When completed │
    └─────────────────┘     └─────────────────┘     └─────────────────┘
    \`\`\`

    1. Submit booking via \`POST /bookings\` - returns a \`job_id\`
    2. Poll \`GET /bookings/{job_id}/status\` every 2-5 seconds
    3. When status is \`completed\`, retrieve the booking details
    4. Processing typically takes **20-50 seconds**

    ## Rate Limiting

    To ensure fair usage, the API enforces rate limits:

    | Limit | Value |
    |-------|-------|
    | Requests per minute | 60 |
    | Burst limit | 10 requests |

    Rate limit information is included in response headers:
    - \`X-RateLimit-Limit\`: Maximum requests per window
    - \`X-RateLimit-Remaining\`: Requests remaining
    - \`X-RateLimit-Reset\`: Unix timestamp when limit resets

    When exceeded, the API returns \`429 Too Many Requests\` with a \`Retry-After\` header.

    ## Error Handling

    All errors follow a consistent format:

    \`\`\`json
    {
      "error": {
        "code": "ERROR_CODE",
        "message": "Human-readable description",
        "details": [...]
      }
    }
    \`\`\`

    | HTTP Status | Error Code | Description |
    |-------------|------------|-------------|
    | 400 | BAD_REQUEST | Invalid request parameters |
    | 400 | VALIDATION_ERROR | Request body validation failed |
    | 401 | UNAUTHORIZED | Missing or invalid authentication |
    | 404 | NOT_FOUND | Resource not found |
    | 409 | CONFLICT | Resource conflict (e.g., no seats available) |
    | 429 | RATE_LIMITED | Too many requests |
    | 500 | INTERNAL_ERROR | Server error |

    ## Demo Credentials

    Use these credentials to test the API immediately:

    | Credential | Value |
    |------------|-------|
    | Username | \`demo\` |
    | Password | \`demo123\` |
    | OAuth Client ID | \`demo-client\` |
    | OAuth Client Secret | \`demo-secret\` |

    ## SDKs and Client Libraries

    While official SDKs are not yet available, you can generate client libraries using:
    - [OpenAPI Generator](https://openapi-generator.tech/)
    - [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)

    ## Support and Feedback

    - **Issues**: [GitHub Issues](https://github.com/MarkoVcode/apis-populi/issues)
    - **Documentation**: [GitHub Repository](https://github.com/MarkoVcode/apis-populi)
    - **Email**: support@contractkit.app

  version: 1.0.0
  termsOfService: https://github.com/MarkoVcode/apis-populi/blob/main/LICENSE
  contact:
    name: APIs Populi Support
    url: https://github.com/MarkoVcode/apis-populi
    email: support@contractkit.app
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT
  x-logo:
    url: https://raw.githubusercontent.com/MarkoVcode/apis-populi/main/public/logo.png
    altText: Flights API Logo
    backgroundColor: '#FFFFFF'

externalDocs:
  description: Full documentation, source code, and contribution guidelines on GitHub
  url: https://github.com/MarkoVcode/apis-populi

servers:
  - url: https://testapi.contractkit.app/api/flights
    description: Production server - stable, rate-limited, suitable for integration testing
    x-environment: production
  - url: http://localhost:3000/api/flights
    description: Local development server - no rate limits, data resets on restart
    x-environment: development

x-tagGroups:
  - name: Getting Started
    tags:
      - Authentication
  - name: Reference Data
    tags:
      - Airports
      - Airlines
  - name: Flight Operations
    tags:
      - Flights
      - Bookings
      - Passengers
  - name: Administration
    tags:
      - Admin

tags:
  - name: Authentication
    description: |
      ## Authentication & Authorization

      Endpoints for obtaining and managing authentication tokens. The Flights API supports two authentication methods to accommodate different use cases.

      ### JWT Bearer Token

      Best for: **Testing, development, and simple integrations**

      - Obtain via \`POST /auth/token\` with username/password
      - Tokens are valid for 24 hours
      - Include in requests: \`Authorization: Bearer <token>\`

      ### OAuth2 Authorization Code Flow

      Best for: **Production applications with delegated access**

      - Initiate with \`POST /auth/oauth/authorize\`
      - Exchange code for tokens via \`POST /auth/oauth/token\`
      - Access tokens valid for 1 hour
      - Use refresh tokens to obtain new access tokens

      ### Token Lifecycle

      \`\`\`
      [Credentials] → [Auth Endpoint] → [Access Token] → [API Requests]
                                              ↓
                                      [Token Expires]
                                              ↓
                                   [Refresh or Re-auth]
      \`\`\`
    externalDocs:
      description: OAuth2 Specification
      url: https://oauth.net/2/
  - name: Airports
    description: |
      ## Airport Information

      Access comprehensive airport information including IATA codes, geographic coordinates, and timezone data. The API contains **25+ major international airports** from cities worldwide.

      ### Available Data

      | Field | Description | Example |
      |-------|-------------|---------|
      | code | 3-letter IATA code | JFK, LHR, NRT |
      | name | Full airport name | John F. Kennedy International Airport |
      | city | City location | New York |
      | country | Country location | United States |
      | latitude | Geographic latitude | 40.6413 |
      | longitude | Geographic longitude | -73.7781 |
      | timezone | IANA timezone | America/New_York |

      ### Regions Covered

      - **North America**: JFK, LAX, ORD, SFO, MIA, ATL, DFW, YYZ, MEX
      - **Europe**: LHR, CDG, FRA, AMS, MAD, FCO, MUC, ZRH
      - **Asia-Pacific**: NRT, HND, SIN, HKG, ICN, PEK, SYD, DXB
    externalDocs:
      description: IATA Airport Codes Reference
      url: https://www.iata.org/en/publications/directories/code-search/
  - name: Airlines
    description: |
      ## Airline Information

      Access airline information including IATA carrier codes, hub airports, and alliance memberships. The API includes **15+ major international carriers**.

      ### Available Data

      | Field | Description | Example |
      |-------|-------------|---------|
      | code | 2-letter IATA code | AA, BA, LH |
      | name | Full airline name | American Airlines |
      | country | Country of origin | United States |
      | hub_airports | Primary hub airports | [DFW, MIA, ORD] |
      | alliance | Airline alliance membership | Oneworld |

      ### Alliances Represented

      - **Oneworld**: American Airlines, British Airways, Cathay Pacific, Japan Airlines, Qantas, Iberia
      - **Star Alliance**: United Airlines, Lufthansa, Singapore Airlines, All Nippon Airways
      - **SkyTeam**: Delta Air Lines, Air France, KLM, ITA Airways
      - **Independent**: Emirates
    externalDocs:
      description: IATA Airline Codes Reference
      url: https://www.iata.org/en/publications/directories/code-search/
  - name: Flights
    description: |
      ## Flight Search & Information

      Search for flights and retrieve detailed information including schedules, availability, and pricing. The API provides **90+ flight routes** between major airports.

      ### Flight Statuses

      | Status | Description |
      |--------|-------------|
      | \`scheduled\` | Flight is scheduled, not yet boarding |
      | \`boarding\` | Passengers are currently boarding |
      | \`departed\` | Flight has departed from origin |
      | \`in_air\` | Flight is currently airborne |
      | \`landed\` | Flight has landed at destination |
      | \`delayed\` | Flight is delayed from original schedule |
      | \`cancelled\` | Flight has been cancelled |

      ### Cabin Classes & Pricing

      | Class | Typical Price Range | Amenities |
      |-------|---------------------|-----------|
      | Economy | $200 - $800 | Standard seating, basic meal service |
      | Business | $500 - $2,000 | Lie-flat seats, premium meals, lounge access |
      | First | $1,000 - $5,000 | Private suites, gourmet dining, chauffeur service |

      ### Search Tips

      - Use \`origin\` and \`destination\` for route-specific searches
      - Use \`departure_from\` and \`departure_to\` for date range searches
      - Combine \`airline_code\` with routes for carrier-specific results
      - Sort by \`departure_time\` or \`prices.economy\` for organized results
  - name: Bookings
    description: |
      ## Flight Booking Management

      Create, retrieve, and manage flight bookings. The booking system uses **asynchronous processing** to simulate real-world payment and seat allocation systems.

      ### Booking Workflow

      \`\`\`
      1. Search Flights    →  GET /flights?origin=JFK&destination=LAX
      2. Create Booking    →  POST /bookings (returns job_id)
      3. Poll Status       →  GET /bookings/{job_id}/status (repeat until completed)
      4. Get Confirmation  →  GET /bookings/{booking_id}
      \`\`\`

      ### Booking Statuses

      | Status | Description |
      |--------|-------------|
      | \`pending\` | Booking created, awaiting payment |
      | \`confirmed\` | Payment received, seats assigned |
      | \`checked_in\` | Passenger has checked in for flight |
      | \`cancelled\` | Booking has been cancelled |

      ### Payment Statuses

      | Status | Description |
      |--------|-------------|
      | \`pending\` | Payment not yet processed |
      | \`paid\` | Payment successfully processed |
      | \`refunded\` | Payment has been refunded |

      ### Important Notes

      - Maximum **9 passengers** per booking
      - Bookings can only be cancelled before flight departure
      - Seat assignments are automatic based on availability
  - name: Passengers
    description: |
      ## Passenger Information

      Retrieve passenger details associated with bookings. Passenger records include personal information, contact details, and flight-specific data.

      ### Available Data

      | Field | Description | Required |
      |-------|-------------|----------|
      | first_name | Legal first name | Yes |
      | last_name | Legal last name | Yes |
      | date_of_birth | Birth date (YYYY-MM-DD) | Yes |
      | email | Contact email | No |
      | phone | Contact phone with country code | No |
      | passport_number | Passport/ID number | No |
      | frequent_flyer_number | Airline loyalty number | No |
      | seat_number | Assigned seat (e.g., 24A) | Auto-assigned |

      ### Privacy Considerations

      Passenger data is associated with specific bookings and can only be accessed with proper authentication. Personal information should be handled in accordance with applicable data protection regulations.
  - name: Admin
    description: |
      ## Administrative Operations

      Administrative endpoints for managing API state. These operations affect all data and should be used with caution.

      ### Available Operations

      | Operation | Endpoint | Description |
      |-----------|----------|-------------|
      | Reset Data | \`POST /reset\` | Restore all data to initial seed state |

      ### Reset Operation Details

      The reset operation:
      - Removes all bookings
      - Restores all flights to original schedules
      - Resets seat availability to default values
      - Clears all async job states

      **Warning**: This action cannot be undone and affects all API users.

security:
  - BearerAuth: []

paths:
  /auth/token:
    post:
      summary: Obtain JWT access token
      description: |
        Authenticates a user with username and password credentials and returns a JWT access token.
        The token should be included in subsequent requests using the \`Authorization: Bearer <token>\` header.

        Tokens expire after 24 hours and must be refreshed by obtaining a new token.

        ### Usage

        1. Call this endpoint with valid credentials
        2. Extract the \`access_token\` from the response
        3. Include it in subsequent requests: \`Authorization: Bearer {access_token}\`

        ### Demo Credentials

        Use \`demo\` / \`demo123\` to test the API.
      operationId: getToken
      tags:
        - Authentication
      security: []
      x-codeSamples:
        - lang: Shell
          label: cURL
          source: |
            curl -X POST 'https://testapi.contractkit.app/api/flights/auth/token' \\
              -H 'Content-Type: application/json' \\
              -d '{
                "username": "demo",
                "password": "demo123"
              }'
        - lang: JavaScript
          label: JavaScript (fetch)
          source: |
            const response = await fetch('https://testapi.contractkit.app/api/flights/auth/token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: 'demo',
                password: 'demo123'
              })
            });

            const { access_token } = await response.json();
            console.log('Token:', access_token);
        - lang: Python
          label: Python (requests)
          source: |
            import requests

            response = requests.post(
                'https://testapi.contractkit.app/api/flights/auth/token',
                json={
                    'username': 'demo',
                    'password': 'demo123'
                }
            )

            data = response.json()
            access_token = data['access_token']
            print(f'Token: {access_token}')
        - lang: Java
          label: Java (HttpClient)
          source: |
            HttpClient client = HttpClient.newHttpClient();
            String json = "{\"username\":\"demo\",\"password\":\"demo123\"}";

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://testapi.contractkit.app/api/flights/auth/token"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

            HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());
            System.out.println(response.body());
      requestBody:
        description: User credentials for authentication
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TokenRequest'
            examples:
              demo_user:
                summary: Demo user credentials
                description: Use these credentials to test the API
                value:
                  username: demo
                  password: demo123
              admin_user:
                summary: Admin user credentials
                value:
                  username: admin
                  password: admin123
      responses:
        '200':
          description: Successfully authenticated. Returns JWT access token.
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TokenResponse'
              examples:
                success:
                  summary: Successful token response
                  value:
                    access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbW8iLCJpYXQiOjE3MzM0ODgwMDAsImV4cCI6MTczMzU3NDQwMH0.abc123
                    token_type: Bearer
                    expires_in: 86400
        '401':
          $ref: '#/components/responses/Unauthorized'
        '400':
          $ref: '#/components/responses/BadRequest'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /auth/oauth/authorize:
    post:
      summary: Initiate OAuth2 authorization
      description: |
        Initiates the OAuth2 authorization code flow. Returns an authorization code that can be
        exchanged for an access token using the \`/auth/oauth/token\` endpoint.

        This endpoint simulates the authorization step where a user would typically grant permission.
        In a real implementation, this would redirect to a consent screen.
      operationId: oauthAuthorize
      tags:
        - Authentication
      security: []
      requestBody:
        description: OAuth2 authorization request parameters
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OAuthAuthorizeRequest'
            examples:
              standard_request:
                summary: Standard OAuth2 authorization request
                value:
                  client_id: demo-client
                  redirect_uri: https://example.com/callback
                  scope: read write
                  state: xyz123
      responses:
        '200':
          description: Authorization successful. Returns authorization code.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OAuthAuthorizeResponse'
              examples:
                success:
                  summary: Successful authorization
                  value:
                    code: auth_code_abc123def456
                    state: xyz123
        '400':
          $ref: '#/components/responses/BadRequest'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /auth/oauth/token:
    post:
      summary: Exchange authorization code for access token
      description: |
        Exchanges an authorization code or refresh token for an access token.

        **Grant Types:**
        - \`authorization_code\`: Exchange an authorization code for tokens
        - \`refresh_token\`: Use a refresh token to obtain a new access token

        Access tokens expire after 1 hour. Use the refresh token to obtain new access tokens without re-authentication.
      operationId: oauthToken
      tags:
        - Authentication
      security: []
      requestBody:
        description: Token exchange request
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OAuthTokenRequest'
            examples:
              authorization_code:
                summary: Exchange authorization code
                value:
                  grant_type: authorization_code
                  code: auth_code_abc123def456
                  client_id: demo-client
                  client_secret: demo-secret
              refresh_token:
                summary: Refresh access token
                value:
                  grant_type: refresh_token
                  refresh_token: refresh_token_xyz789
                  client_id: demo-client
                  client_secret: demo-secret
      responses:
        '200':
          description: Token exchange successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OAuthTokenResponse'
              examples:
                success:
                  summary: Successful token exchange
                  value:
                    access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJkZW1vLWNsaWVudCIsImlhdCI6MTczMzQ4ODAwMCwiZXhwIjoxNzMzNDkxNjAwfQ.xyz789
                    refresh_token: refresh_token_new_abc123
                    token_type: Bearer
                    expires_in: 3600
                    scope: read write
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /airports:
    get:
      summary: List all airports
      description: |
        Retrieves a paginated list of airports. Supports filtering by country, city, and search query.

        The API contains **25+ major international airports** with accurate IATA codes, coordinates, and timezone information.

        ### Available Airports

        | Region | Airports |
        |--------|----------|
        | North America | JFK, LAX, ORD, SFO, MIA, ATL, DFW, YYZ, MEX |
        | Europe | LHR, CDG, FRA, AMS, MAD, FCO, MUC, ZRH |
        | Asia-Pacific | NRT, HND, SIN, HKG, ICN, PEK, SYD, DXB |

        ### Filtering Examples

        - Search by name: \`?q=international\`
        - Filter by country: \`?country=United States\`
        - Filter by city: \`?city=New York\`
      operationId: listAirports
      tags:
        - Airports
      x-codeSamples:
        - lang: Shell
          label: cURL
          source: |
            # List all airports
            curl -X GET 'https://testapi.contractkit.app/api/flights/airports' \\
              -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'

            # Filter by country
            curl -X GET 'https://testapi.contractkit.app/api/flights/airports?country=United%20States' \\
              -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'

            # Search by name or code
            curl -X GET 'https://testapi.contractkit.app/api/flights/airports?q=JFK' \\
              -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
        - lang: JavaScript
          label: JavaScript (fetch)
          source: |
            const token = 'YOUR_ACCESS_TOKEN';

            // List all US airports
            const response = await fetch(
              'https://testapi.contractkit.app/api/flights/airports?country=United%20States',
              {
                headers: { 'Authorization': \`Bearer \${token}\` }
              }
            );

            const { data } = await response.json();
            data.forEach(airport => {
              console.log(\`\${airport.code}: \${airport.name} (\${airport.city})\`);
            });
        - lang: Python
          label: Python (requests)
          source: |
            import requests

            token = 'YOUR_ACCESS_TOKEN'
            headers = {'Authorization': f'Bearer {token}'}

            response = requests.get(
                'https://testapi.contractkit.app/api/flights/airports',
                headers=headers,
                params={'country': 'United States'}
            )

            for airport in response.json()['data']:
                print(f"{airport['code']}: {airport['name']}")
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - $ref: '#/components/parameters/sort'
        - $ref: '#/components/parameters/order'
        - name: country
          in: query
          description: Filter airports by country name (case-insensitive, partial match)
          required: false
          schema:
            type: string
            minLength: 2
            maxLength: 100
          example: United States
        - name: city
          in: query
          description: Filter airports by city name (case-insensitive, partial match)
          required: false
          schema:
            type: string
            minLength: 2
            maxLength: 100
          example: New York
        - name: q
          in: query
          description: Search query to match against airport name, city, or code
          required: false
          schema:
            type: string
            minLength: 1
            maxLength: 100
          example: JFK
      responses:
        '200':
          description: Paginated list of airports matching the criteria
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedAirports'
              examples:
                success:
                  summary: List of airports
                  value:
                    data:
                      - code: JFK
                        name: John F. Kennedy International Airport
                        city: New York
                        country: United States
                        timezone: America/New_York
                        latitude: 40.6413
                        longitude: -73.7781
                      - code: LAX
                        name: Los Angeles International Airport
                        city: Los Angeles
                        country: United States
                        timezone: America/Los_Angeles
                        latitude: 33.9416
                        longitude: -118.4085
                    pagination:
                      page: 1
                      limit: 20
                      total: 25
                      pages: 2
                      has_next: true
                      has_prev: false
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /airports/{code}:
    get:
      summary: Get airport by IATA code
      description: |
        Retrieves detailed information about a specific airport using its 3-letter IATA code.

        IATA codes are standardized worldwide and uniquely identify each airport.
      operationId: getAirport
      tags:
        - Airports
      parameters:
        - name: code
          in: path
          description: The 3-letter IATA airport code (e.g., JFK, LAX, LHR)
          required: true
          schema:
            type: string
            pattern: '^[A-Z]{3}$'
            minLength: 3
            maxLength: 3
          example: JFK
      responses:
        '200':
          description: Airport details
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Airport'
              examples:
                jfk:
                  summary: JFK Airport
                  value:
                    code: JFK
                    name: John F. Kennedy International Airport
                    city: New York
                    country: United States
                    timezone: America/New_York
                    latitude: 40.6413
                    longitude: -73.7781
                lhr:
                  summary: Heathrow Airport
                  value:
                    code: LHR
                    name: London Heathrow Airport
                    city: London
                    country: United Kingdom
                    timezone: Europe/London
                    latitude: 51.4700
                    longitude: -0.4543
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /airlines:
    get:
      summary: List all airlines
      description: |
        Retrieves a paginated list of airlines operating in the system.

        The API includes 15+ major international carriers with their IATA codes and country of origin.
      operationId: listAirlines
      tags:
        - Airlines
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - $ref: '#/components/parameters/sort'
        - $ref: '#/components/parameters/order'
        - name: country
          in: query
          description: Filter airlines by country of origin
          required: false
          schema:
            type: string
          example: United States
        - name: q
          in: query
          description: Search query to match against airline name or code
          required: false
          schema:
            type: string
          example: American
      responses:
        '200':
          description: Paginated list of airlines
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedAirlines'
              examples:
                success:
                  summary: List of airlines
                  value:
                    data:
                      - code: AA
                        name: American Airlines
                        country: United States
                        logo_url: https://example.com/logos/aa.png
                      - code: BA
                        name: British Airways
                        country: United Kingdom
                        logo_url: https://example.com/logos/ba.png
                      - code: LH
                        name: Lufthansa
                        country: Germany
                        logo_url: https://example.com/logos/lh.png
                    pagination:
                      page: 1
                      limit: 20
                      total: 15
                      pages: 1
                      has_next: false
                      has_prev: false
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /airlines/{code}:
    get:
      summary: Get airline by IATA code
      description: |
        Retrieves detailed information about a specific airline using its 2-letter IATA code.
      operationId: getAirline
      tags:
        - Airlines
      parameters:
        - name: code
          in: path
          description: The 2-letter IATA airline code (e.g., AA, BA, LH)
          required: true
          schema:
            type: string
            pattern: '^[A-Z0-9]{2}$'
            minLength: 2
            maxLength: 2
          example: AA
      responses:
        '200':
          description: Airline details
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Airline'
              examples:
                american_airlines:
                  summary: American Airlines
                  value:
                    code: AA
                    name: American Airlines
                    country: United States
                    logo_url: https://example.com/logos/aa.png
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /flights:
    get:
      summary: Search available flights
      description: |
        Search for flights based on various criteria including origin, destination, date, and status.

        Flights are generated with realistic routes between major airports, with appropriate flight durations
        based on distance. Pricing varies by cabin class (economy, business, first).

        ### Flight Statuses

        | Status | Description |
        |--------|-------------|
        | \`scheduled\` | Flight is scheduled but not yet boarding |
        | \`boarding\` | Passengers are currently boarding |
        | \`departed\` | Flight has departed from origin |
        | \`in_air\` | Flight is currently airborne |
        | \`landed\` | Flight has landed at destination |
        | \`delayed\` | Flight is delayed from schedule |
        | \`cancelled\` | Flight has been cancelled |

        ### Search Tips

        - Combine \`origin\` and \`destination\` for route-specific searches
        - Use \`departure_from\` and \`departure_to\` for date ranges
        - Filter by \`status\` to find only bookable flights
      operationId: searchFlights
      tags:
        - Flights
      x-codeSamples:
        - lang: Shell
          label: cURL
          source: |
            # Search flights from JFK to LAX
            curl -X GET 'https://testapi.contractkit.app/api/flights/flights?origin=JFK&destination=LAX&status=scheduled' \\
              -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
        - lang: JavaScript
          label: JavaScript (fetch)
          source: |
            const token = 'YOUR_ACCESS_TOKEN';

            const params = new URLSearchParams({
              origin: 'JFK',
              destination: 'LAX',
              status: 'scheduled'
            });

            const response = await fetch(
              \`https://testapi.contractkit.app/api/flights/flights?\${params}\`,
              {
                headers: {
                  'Authorization': \`Bearer \${token}\`
                }
              }
            );

            const { data, pagination } = await response.json();
            console.log(\`Found \${pagination.total} flights\`);
            data.forEach(flight => {
              console.log(\`\${flight.flight_number}: \${flight.origin} → \${flight.destination}\`);
            });
        - lang: Python
          label: Python (requests)
          source: |
            import requests

            token = 'YOUR_ACCESS_TOKEN'
            headers = {'Authorization': f'Bearer {token}'}

            response = requests.get(
                'https://testapi.contractkit.app/api/flights/flights',
                headers=headers,
                params={
                    'origin': 'JFK',
                    'destination': 'LAX',
                    'status': 'scheduled'
                }
            )

            data = response.json()
            print(f"Found {data['pagination']['total']} flights")
            for flight in data['data']:
                price = flight['prices']['economy']
                print(f"{flight['flight_number']}: USD {price}")
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - $ref: '#/components/parameters/sort'
        - $ref: '#/components/parameters/order'
        - name: origin
          in: query
          description: Origin airport IATA code
          required: false
          schema:
            type: string
            pattern: '^[A-Z]{3}$'
          example: JFK
        - name: destination
          in: query
          description: Destination airport IATA code
          required: false
          schema:
            type: string
            pattern: '^[A-Z]{3}$'
          example: LAX
        - name: departure_date
          in: query
          description: Filter flights departing on this date (YYYY-MM-DD format)
          required: false
          schema:
            type: string
            format: date
          example: '2024-12-15'
        - name: departure_from
          in: query
          description: Filter flights departing on or after this date
          required: false
          schema:
            type: string
            format: date
          example: '2024-12-01'
        - name: departure_to
          in: query
          description: Filter flights departing on or before this date
          required: false
          schema:
            type: string
            format: date
          example: '2024-12-31'
        - name: status
          in: query
          description: Filter by flight status (comma-separated for multiple)
          required: false
          schema:
            type: string
            enum:
              - scheduled
              - boarding
              - departed
              - in_air
              - landed
              - cancelled
          example: scheduled
        - name: airline_code
          in: query
          description: Filter by airline IATA code
          required: false
          schema:
            type: string
          example: AA
      responses:
        '200':
          description: Paginated list of flights matching search criteria
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedFlights'
              examples:
                success:
                  summary: Flight search results
                  value:
                    data:
                      - id: flight-001
                        flight_number: AA100
                        airline_code: AA
                        origin: JFK
                        destination: LAX
                        departure_time: '2024-12-15T08:00:00Z'
                        arrival_time: '2024-12-15T11:30:00Z'
                        duration_minutes: 330
                        status: scheduled
                        aircraft_type: Boeing 777-300ER
                        available_seats:
                          economy: 150
                          business: 40
                          first: 8
                        prices:
                          economy: 299.99
                          business: 899.99
                          first: 2499.99
                    pagination:
                      page: 1
                      limit: 20
                      total: 90
                      pages: 5
                      has_next: true
                      has_prev: false
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /flights/{id}:
    get:
      summary: Get flight details
      description: |
        Retrieves complete details for a specific flight including pricing, availability, and current status.
      operationId: getFlight
      tags:
        - Flights
      parameters:
        - name: id
          in: path
          description: Unique flight identifier
          required: true
          schema:
            type: string
          example: flight-001
      responses:
        '200':
          description: Flight details
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Flight'
              examples:
                success:
                  summary: Flight details
                  value:
                    id: flight-001
                    flight_number: AA100
                    airline_code: AA
                    origin: JFK
                    destination: LAX
                    departure_time: '2024-12-15T08:00:00Z'
                    arrival_time: '2024-12-15T11:30:00Z'
                    duration_minutes: 330
                    status: scheduled
                    aircraft_type: Boeing 777-300ER
                    available_seats:
                      economy: 150
                      business: 40
                      first: 8
                    prices:
                      economy: 299.99
                      business: 899.99
                      first: 2499.99
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /bookings:
    get:
      summary: List all bookings
      description: |
        Retrieves a paginated list of all bookings. Results can be filtered by status.
      operationId: listBookings
      tags:
        - Bookings
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - $ref: '#/components/parameters/sort'
        - $ref: '#/components/parameters/order'
        - name: status
          in: query
          description: Filter by booking status
          required: false
          schema:
            type: string
            enum:
              - confirmed
              - pending
              - cancelled
          example: confirmed
      responses:
        '200':
          description: Paginated list of bookings
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedBookings'
              examples:
                success:
                  summary: List of bookings
                  value:
                    data:
                      - id: booking-001
                        confirmation_code: ABC123
                        flight_id: flight-001
                        status: confirmed
                        cabin_class: economy
                        passengers:
                          - id: pax-001
                            first_name: John
                            last_name: Doe
                            date_of_birth: '1985-06-15'
                            email: john.doe@example.com
                            phone: '+1-555-123-4567'
                            seat_number: 24A
                        total_price: 299.99
                        created_at: '2024-12-01T10:30:00Z'
                    pagination:
                      page: 1
                      limit: 20
                      total: 50
                      pages: 3
                      has_next: true
                      has_prev: false
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/TooManyRequests'

    post:
      summary: Create a new booking (async)
      description: |
        Creates a new flight booking. The booking is processed asynchronously to simulate
        real-world payment processing and seat allocation.

        ### Booking Process

        \`\`\`
        POST /bookings → Returns job_id → Poll /bookings/{job_id}/status → Get booking details
        \`\`\`

        1. Submit this request with flight and passenger details
        2. Receive a \`job_id\` in the response
        3. Poll \`GET /bookings/{job_id}/status\` every 2-5 seconds
        4. When status is \`completed\`, the booking ID will be in the result

        **Processing Time:** 20-50 seconds

        ### Cabin Classes

        | Class | Description | Price Range |
        |-------|-------------|-------------|
        | \`economy\` | Standard seating with basic amenities | $200-800 |
        | \`business\` | Premium seating with enhanced services | $500-2000 |
        | \`first\` | Luxury seating with full-service experience | $1000-5000 |
      operationId: createBooking
      tags:
        - Bookings
      x-codeSamples:
        - lang: Shell
          label: cURL
          source: |
            # Create a booking
            curl -X POST 'https://testapi.contractkit.app/api/flights/bookings' \\
              -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
              -H 'Content-Type: application/json' \\
              -d '{
                "flight_id": "flight-0-0",
                "cabin_class": "economy",
                "passengers": [
                  {
                    "first_name": "John",
                    "last_name": "Doe",
                    "date_of_birth": "1985-06-15",
                    "email": "john.doe@example.com",
                    "phone": "+1-555-123-4567"
                  }
                ]
              }'

            # Poll for status (repeat until completed)
            curl -X GET 'https://testapi.contractkit.app/api/flights/bookings/JOB_ID/status' \\
              -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
        - lang: JavaScript
          label: JavaScript (fetch)
          source: |
            const token = 'YOUR_ACCESS_TOKEN';
            const headers = {
              'Authorization': \`Bearer \${token}\`,
              'Content-Type': 'application/json'
            };

            // Create booking
            const bookingResponse = await fetch(
              'https://testapi.contractkit.app/api/flights/bookings',
              {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  flight_id: 'flight-0-0',
                  cabin_class: 'economy',
                  passengers: [{
                    first_name: 'John',
                    last_name: 'Doe',
                    date_of_birth: '1985-06-15',
                    email: 'john.doe@example.com'
                  }]
                })
              }
            );

            const { job_id } = await bookingResponse.json();

            // Poll for completion
            const pollStatus = async () => {
              const statusResponse = await fetch(
                \`https://testapi.contractkit.app/api/flights/bookings/\${job_id}/status\`,
                { headers: { 'Authorization': \`Bearer \${token}\` } }
              );
              return statusResponse.json();
            };

            let status;
            do {
              await new Promise(resolve => setTimeout(resolve, 3000));
              status = await pollStatus();
              console.log(\`Status: \${status.status}, Progress: \${status.progress}%\`);
            } while (status.status === 'processing');

            console.log('Booking confirmed:', status.result);
        - lang: Python
          label: Python (requests)
          source: |
            import requests
            import time

            token = 'YOUR_ACCESS_TOKEN'
            headers = {'Authorization': f'Bearer {token}'}
            base_url = 'https://testapi.contractkit.app/api/flights'

            # Create booking
            booking_data = {
                'flight_id': 'flight-0-0',
                'cabin_class': 'economy',
                'passengers': [{
                    'first_name': 'John',
                    'last_name': 'Doe',
                    'date_of_birth': '1985-06-15',
                    'email': 'john.doe@example.com'
                }]
            }

            response = requests.post(
                f'{base_url}/bookings',
                headers=headers,
                json=booking_data
            )
            job_id = response.json()['job_id']

            # Poll for completion
            while True:
                status_response = requests.get(
                    f'{base_url}/bookings/{job_id}/status',
                    headers=headers
                )
                status = status_response.json()
                print(f"Status: {status['status']}, Progress: {status.get('progress', 0)}%")

                if status['status'] in ['completed', 'failed']:
                    break
                time.sleep(3)

            print(f"Booking: {status.get('result', status.get('error'))}")
      requestBody:
        description: Booking details including flight, passengers, and cabin class
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookingCreate'
            examples:
              single_passenger:
                summary: Single passenger booking
                description: Book a flight for one passenger
                value:
                  flight_id: flight-001
                  cabin_class: economy
                  passengers:
                    - first_name: John
                      last_name: Doe
                      date_of_birth: '1985-06-15'
                      email: john.doe@example.com
                      phone: '+1-555-123-4567'
              family_booking:
                summary: Family booking
                description: Book a flight for multiple passengers
                value:
                  flight_id: flight-001
                  cabin_class: economy
                  passengers:
                    - first_name: John
                      last_name: Smith
                      date_of_birth: '1980-03-20'
                      email: john.smith@example.com
                      phone: '+1-555-111-2222'
                    - first_name: Jane
                      last_name: Smith
                      date_of_birth: '1982-07-10'
                      email: jane.smith@example.com
                      phone: '+1-555-111-3333'
                    - first_name: Tommy
                      last_name: Smith
                      date_of_birth: '2015-01-05'
              business_class:
                summary: Business class booking
                value:
                  flight_id: flight-001
                  cabin_class: business
                  passengers:
                    - first_name: Alice
                      last_name: Johnson
                      date_of_birth: '1975-11-30'
                      email: alice.johnson@company.com
                      phone: '+1-555-999-8888'
      responses:
        '202':
          description: |
            Booking request accepted for processing. Use the returned job_id to poll for status.
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BookingAccepted'
              examples:
                success:
                  summary: Booking accepted for processing
                  value:
                    message: Booking request accepted for processing
                    job_id: job-abc123def456
                    status: processing
                    estimated_time_seconds: '20-50'
                    note: Poll GET /bookings/{job_id}/status for updates
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          description: Flight not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                flight_not_found:
                  summary: Flight not found
                  value:
                    error:
                      code: NOT_FOUND
                      message: Flight with ID flight-999 not found
        '409':
          description: No available seats in the requested cabin class
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                no_seats:
                  summary: No seats available
                  value:
                    error:
                      code: CONFLICT
                      message: No available seats in business class for this flight
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /bookings/{id}:
    get:
      summary: Get booking details
      description: |
        Retrieves complete details for a specific booking including passenger information and flight details.

        This endpoint also works with job IDs from async booking creation. If the booking is still processing,
        it returns the job status instead.
      operationId: getBooking
      tags:
        - Bookings
      parameters:
        - name: id
          in: path
          description: Booking ID or job ID from async booking creation
          required: true
          schema:
            type: string
          example: booking-001
      responses:
        '200':
          description: Booking details or job status if still processing
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Booking'
              examples:
                confirmed_booking:
                  summary: Confirmed booking
                  value:
                    id: booking-001
                    confirmation_code: ABC123
                    flight_id: flight-001
                    status: confirmed
                    cabin_class: economy
                    passengers:
                      - id: pax-001
                        first_name: John
                        last_name: Doe
                        date_of_birth: '1985-06-15'
                        email: john.doe@example.com
                        phone: '+1-555-123-4567'
                        seat_number: 24A
                    total_price: 299.99
                    currency: USD
                    created_at: '2024-12-01T10:30:00Z'
                    updated_at: '2024-12-01T10:30:45Z'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '429':
          $ref: '#/components/responses/TooManyRequests'

    delete:
      summary: Cancel a booking
      description: |
        Cancels an existing booking. Cancelled bookings cannot be reinstated.

        **Cancellation Policy:**
        - Bookings can only be cancelled if the flight has not yet departed
        - Cancellation is immediate and cannot be undone
      operationId: cancelBooking
      tags:
        - Bookings
      parameters:
        - name: id
          in: path
          description: Booking ID to cancel
          required: true
          schema:
            type: string
          example: booking-001
      responses:
        '200':
          description: Booking successfully cancelled
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    description: Confirmation message
                    example: Booking successfully cancelled
                  booking_id:
                    type: string
                    description: The cancelled booking ID
                    example: booking-001
                  cancelled_at:
                    type: string
                    format: date-time
                    description: Timestamp of cancellation
                    example: '2024-12-05T14:30:00Z'
              examples:
                success:
                  summary: Booking cancelled
                  value:
                    message: Booking successfully cancelled
                    booking_id: booking-001
                    cancelled_at: '2024-12-05T14:30:00Z'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '409':
          description: Booking cannot be cancelled (flight already departed)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                already_departed:
                  summary: Flight already departed
                  value:
                    error:
                      code: CONFLICT
                      message: Cannot cancel booking - flight has already departed
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /bookings/{id}/status:
    get:
      summary: Poll async booking job status
      description: |
        Check the status of an asynchronous booking job. Use this endpoint to poll for completion
        after creating a booking with \`POST /bookings\`.

        **Recommended polling interval:** 2-5 seconds

        **Job Statuses:**
        - \`pending\`: Job is queued for processing
        - \`processing\`: Job is currently being processed
        - \`completed\`: Job finished successfully - booking ID in result
        - \`failed\`: Job failed - error details provided
      operationId: getBookingStatus
      tags:
        - Bookings
      parameters:
        - name: id
          in: path
          description: Job ID returned from POST /bookings
          required: true
          schema:
            type: string
          example: job-abc123def456
      responses:
        '200':
          description: Current job status
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/JobStatus'
              examples:
                processing:
                  summary: Job still processing
                  value:
                    job_id: job-abc123def456
                    status: processing
                    progress: 45
                    eta_seconds: 25
                    started_at: '2024-12-05T14:30:00Z'
                completed:
                  summary: Job completed successfully
                  value:
                    job_id: job-abc123def456
                    status: completed
                    progress: 100
                    started_at: '2024-12-05T14:30:00Z'
                    completed_at: '2024-12-05T14:30:35Z'
                    result:
                      id: booking-123
                      confirmation_code: XYZ789
                      flight_id: flight-001
                      status: confirmed
                      cabin_class: economy
                      total_price: 299.99
                      created_at: '2024-12-05T14:30:35Z'
                failed:
                  summary: Job failed
                  value:
                    job_id: job-abc123def456
                    status: failed
                    progress: 0
                    started_at: '2024-12-05T14:30:00Z'
                    completed_at: '2024-12-05T14:30:05Z'
                    error: Payment processing failed - insufficient funds
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /passengers/{id}:
    get:
      summary: Get passenger details
      description: |
        Retrieves detailed information about a specific passenger including their booking history.
      operationId: getPassenger
      tags:
        - Passengers
      parameters:
        - name: id
          in: path
          description: Unique passenger identifier
          required: true
          schema:
            type: string
          example: pax-001
      responses:
        '200':
          description: Passenger details
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Passenger'
              examples:
                success:
                  summary: Passenger details
                  value:
                    id: pax-001
                    first_name: John
                    last_name: Doe
                    date_of_birth: '1985-06-15'
                    email: john.doe@example.com
                    phone: '+1-555-123-4567'
                    seat_number: 24A
                    booking_id: booking-001
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /reset:
    post:
      summary: Reset all flight data
      description: |
        Resets all flight data to the initial seed state. This operation:
        - Removes all bookings
        - Restores all flights to their original schedule
        - Resets seat availability

        **Warning:** This action cannot be undone and affects all users of the API.
      operationId: resetData
      tags:
        - Admin
      responses:
        '200':
          description: Data successfully reset
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                type: object
                required:
                  - message
                  - timestamp
                properties:
                  message:
                    type: string
                    description: Confirmation message
                    example: Flights API data has been reset to initial state
                  timestamp:
                    type: string
                    format: date-time
                    description: Time when the reset was performed
                    example: '2024-12-05T14:30:00Z'
              examples:
                success:
                  summary: Data reset successful
                  value:
                    message: Flights API data has been reset to initial state
                    timestamp: '2024-12-05T14:30:00Z'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/TooManyRequests'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT Bearer token authentication. Obtain a token via POST /auth/token
        and include it in the Authorization header.

        **Example:** \`Authorization: Bearer eyJhbGciOiJIUzI1NiIs...\`

  headers:
    X-RateLimit-Limit:
      description: Maximum number of requests allowed per time window
      schema:
        type: integer
        example: 60
    X-RateLimit-Remaining:
      description: Number of requests remaining in the current time window
      schema:
        type: integer
        example: 55
    X-RateLimit-Reset:
      description: Unix timestamp when the rate limit resets
      schema:
        type: integer
        example: 1733488800

  parameters:
    page:
      name: page
      in: query
      description: Page number for pagination (1-indexed)
      required: false
      schema:
        type: integer
        minimum: 1
        default: 1
        example: 1
    limit:
      name: limit
      in: query
      description: Number of items per page (max 100)
      required: false
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20
        example: 20
    sort:
      name: sort
      in: query
      description: Field to sort results by
      required: false
      schema:
        type: string
        example: departure_time
    order:
      name: order
      in: query
      description: Sort order
      required: false
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
        example: asc

  responses:
    BadRequest:
      description: Invalid request parameters or body
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            validation_error:
              summary: Validation error
              value:
                error:
                  code: VALIDATION_ERROR
                  message: Invalid request parameters
                  details:
                    - field: email
                      message: Invalid email format
                    - field: date_of_birth
                      message: Date must be in YYYY-MM-DD format
            missing_field:
              summary: Missing required field
              value:
                error:
                  code: BAD_REQUEST
                  message: 'Missing required field: flight_id'

    Unauthorized:
      description: Authentication required or token invalid
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            missing_token:
              summary: Missing authentication
              value:
                error:
                  code: UNAUTHORIZED
                  message: Authentication required. Provide a valid Bearer token.
            invalid_token:
              summary: Invalid or expired token
              value:
                error:
                  code: UNAUTHORIZED
                  message: Invalid or expired authentication token
            invalid_credentials:
              summary: Invalid credentials
              value:
                error:
                  code: UNAUTHORIZED
                  message: Invalid username or password

    NotFound:
      description: Requested resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            not_found:
              summary: Resource not found
              value:
                error:
                  code: NOT_FOUND
                  message: The requested resource was not found

    TooManyRequests:
      description: Rate limit exceeded
      headers:
        Retry-After:
          description: Seconds to wait before retrying
          schema:
            type: integer
            example: 60
        X-RateLimit-Limit:
          $ref: '#/components/headers/X-RateLimit-Limit'
        X-RateLimit-Remaining:
          $ref: '#/components/headers/X-RateLimit-Remaining'
        X-RateLimit-Reset:
          $ref: '#/components/headers/X-RateLimit-Reset'
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            rate_limited:
              summary: Rate limit exceeded
              value:
                error:
                  code: RATE_LIMITED
                  message: Too many requests. Please wait before trying again.
                  retry_after: 60

  schemas:
    Error:
      type: object
      description: Standard error response format
      required:
        - error
      properties:
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
              description: Machine-readable error code
              example: VALIDATION_ERROR
            message:
              type: string
              description: Human-readable error message
              example: Invalid request parameters
            details:
              type: array
              description: Detailed error information for validation errors
              items:
                type: object
                properties:
                  field:
                    type: string
                    description: The field that caused the error
                    example: email
                  message:
                    type: string
                    description: Description of the field error
                    example: Invalid email format
            retry_after:
              type: integer
              description: Seconds to wait before retrying (for rate limit errors)
              example: 60

    TokenRequest:
      type: object
      description: Request body for obtaining a JWT token
      required:
        - username
        - password
      properties:
        username:
          type: string
          description: The user's username
          minLength: 1
          maxLength: 100
          example: demo
        password:
          type: string
          description: The user's password
          format: password
          minLength: 1
          maxLength: 100
          example: demo123

    TokenResponse:
      type: object
      description: JWT token response
      required:
        - access_token
        - token_type
        - expires_in
      properties:
        access_token:
          type: string
          description: JWT access token to use in Authorization header
          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbW8iLCJpYXQiOjE3MzM0ODgwMDAsImV4cCI6MTczMzU3NDQwMH0.abc123
        token_type:
          type: string
          description: Type of token (always "Bearer")
          enum:
            - Bearer
          example: Bearer
        expires_in:
          type: integer
          description: Token validity period in seconds
          example: 86400

    OAuthAuthorizeRequest:
      type: object
      description: OAuth2 authorization request
      required:
        - client_id
        - redirect_uri
      properties:
        client_id:
          type: string
          description: The registered OAuth client ID
          example: demo-client
        redirect_uri:
          type: string
          description: URI to redirect after authorization
          format: uri
          example: https://example.com/callback
        scope:
          type: string
          description: Space-separated list of requested scopes
          example: read write
        state:
          type: string
          description: Opaque value to maintain state between request and callback
          example: xyz123

    OAuthAuthorizeResponse:
      type: object
      description: OAuth2 authorization response with authorization code
      required:
        - code
      properties:
        code:
          type: string
          description: Authorization code to exchange for tokens
          example: auth_code_abc123def456
        state:
          type: string
          description: State value from the original request
          example: xyz123

    OAuthTokenRequest:
      type: object
      description: OAuth2 token exchange request
      required:
        - grant_type
        - client_id
        - client_secret
      properties:
        grant_type:
          type: string
          description: The OAuth2 grant type
          enum:
            - authorization_code
            - refresh_token
          example: authorization_code
        code:
          type: string
          description: Authorization code (required for authorization_code grant)
          example: auth_code_abc123def456
        refresh_token:
          type: string
          description: Refresh token (required for refresh_token grant)
          example: refresh_token_xyz789
        client_id:
          type: string
          description: The registered OAuth client ID
          example: demo-client
        client_secret:
          type: string
          description: The OAuth client secret
          example: demo-secret

    OAuthTokenResponse:
      type: object
      description: OAuth2 token response
      required:
        - access_token
        - token_type
        - expires_in
      properties:
        access_token:
          type: string
          description: The access token
          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        refresh_token:
          type: string
          description: Token to obtain new access tokens
          example: refresh_token_new_abc123
        token_type:
          type: string
          description: Type of token
          enum:
            - Bearer
          example: Bearer
        expires_in:
          type: integer
          description: Token validity in seconds
          example: 3600
        scope:
          type: string
          description: Granted scopes
          example: read write

    Airport:
      type: object
      description: |
        Complete airport information including location, timezone, and geographic coordinates.

        Airports are identified by their 3-letter IATA Location Identifier, which is used
        globally for flight bookings, baggage handling, and airline operations.
      required:
        - code
        - name
        - city
        - country
      properties:
        code:
          type: string
          description: |
            The 3-letter IATA Location Identifier uniquely identifying this airport worldwide.
            These codes are assigned by the International Air Transport Association (IATA).
          pattern: '^[A-Z]{3}$'
          minLength: 3
          maxLength: 3
          example: JFK
          externalDocs:
            description: IATA Airport Codes
            url: https://www.iata.org/en/publications/directories/code-search/
        name:
          type: string
          description: |
            The official name of the airport as registered with aviation authorities.
            This is the name that appears on signage, tickets, and official documents.
          minLength: 1
          maxLength: 200
          example: John F. Kennedy International Airport
        city:
          type: string
          description: |
            The primary city served by this airport. Note that some airports serve
            metropolitan areas with multiple cities (e.g., DFW serves Dallas and Fort Worth).
          minLength: 1
          maxLength: 100
          example: New York
        country:
          type: string
          description: The country where the airport is physically located.
          minLength: 1
          maxLength: 100
          example: United States
        timezone:
          type: string
          description: |
            IANA timezone identifier for the airport's local time. Use this to convert
            flight times to local time. Format: Area/Location (e.g., America/New_York).
          pattern: '^[A-Za-z_]+/[A-Za-z_]+$'
          example: America/New_York
          externalDocs:
            description: IANA Time Zone Database
            url: https://www.iana.org/time-zones
        latitude:
          type: number
          format: double
          description: |
            Geographic latitude of the airport reference point in decimal degrees.
            Positive values indicate North, negative values indicate South.
          minimum: -90
          maximum: 90
          example: 40.6413
        longitude:
          type: number
          format: double
          description: |
            Geographic longitude of the airport reference point in decimal degrees.
            Positive values indicate East, negative values indicate West.
          minimum: -180
          maximum: 180
          example: -73.7781
      example:
        code: JFK
        name: John F. Kennedy International Airport
        city: New York
        country: United States
        timezone: America/New_York
        latitude: 40.6413
        longitude: -73.7781

    PaginatedAirports:
      type: object
      description: Paginated list of airports
      required:
        - data
        - pagination
      properties:
        data:
          type: array
          description: List of airports
          items:
            $ref: '#/components/schemas/Airport'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Airline:
      type: object
      description: |
        Complete airline information including identification, operational details, and alliance membership.

        Airlines are identified by their 2-letter IATA code, which is used in flight numbers and booking references.
      required:
        - code
        - name
        - country
      properties:
        code:
          type: string
          description: |
            The 2-letter IATA airline designator code. This code is used as a prefix in flight numbers
            (e.g., AA100 for American Airlines flight 100) and is recognized worldwide.
          pattern: '^[A-Z0-9]{2}$'
          minLength: 2
          maxLength: 2
          example: AA
          externalDocs:
            description: IATA Airline Designator Codes
            url: https://www.iata.org/en/publications/directories/code-search/
        name:
          type: string
          description: The full official name of the airline as registered with IATA.
          minLength: 1
          maxLength: 100
          example: American Airlines
        country:
          type: string
          description: The country where the airline is headquartered and holds its primary operating certificate.
          minLength: 1
          maxLength: 100
          example: United States
        hub_airports:
          type: array
          description: |
            List of primary hub airports where the airline operates major connecting flight operations.
            Hub airports typically have the highest frequency of flights and best connectivity for the airline.
          items:
            type: string
            description: 3-letter IATA airport code
            pattern: '^[A-Z]{3}$'
            minLength: 3
            maxLength: 3
          minItems: 1
          maxItems: 10
          example: ["DFW", "MIA", "ORD", "JFK", "LAX"]
        alliance:
          type: string
          description: |
            The global airline alliance membership, if any. Alliance membership enables code-sharing,
            frequent flyer program reciprocity, and coordinated schedules between member airlines.
          enum:
            - Oneworld
            - Star Alliance
            - SkyTeam
          nullable: true
          example: Oneworld
        logo_url:
          type: string
          format: uri
          description: URL to the airline's official logo image. Suitable for display in booking interfaces.
          maxLength: 500
          example: https://example.com/logos/aa.png
      example:
        code: AA
        name: American Airlines
        country: United States
        hub_airports: ["DFW", "MIA", "ORD", "JFK", "LAX"]
        alliance: Oneworld
        logo_url: https://example.com/logos/aa.png

    PaginatedAirlines:
      type: object
      description: Paginated list of airlines
      required:
        - data
        - pagination
      properties:
        data:
          type: array
          description: List of airlines
          items:
            $ref: '#/components/schemas/Airline'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Flight:
      type: object
      description: |
        Complete flight information including schedule, real-time status, seat availability, and pricing.

        Flights are identified by a combination of airline code and flight number (e.g., AA100).
        The same flight number may operate on different dates with different aircraft and pricing.
      required:
        - id
        - flight_number
        - airline_code
        - origin
        - destination
        - departure_time
        - arrival_time
        - status
      properties:
        id:
          type: string
          description: |
            Unique system-generated identifier for this specific flight instance.
            Format: \`flight-{route_index}-{daily_index}\`
          pattern: '^flight-[0-9]+-[0-9]+$'
          readOnly: true
          example: flight-0-0
        flight_number:
          type: string
          description: |
            Airline flight number combining the 2-letter airline code and a 3-4 digit number.
            This number is used for check-in, boarding, and flight tracking.
          pattern: '^[A-Z]{2}[0-9]{3,4}$'
          minLength: 5
          maxLength: 6
          example: AA100
        airline_code:
          type: string
          description: |
            2-letter IATA airline designator code identifying the operating carrier.
            Use the Airlines endpoint to retrieve full airline details.
          pattern: '^[A-Z0-9]{2}$'
          minLength: 2
          maxLength: 2
          example: AA
        origin:
          type: string
          description: |
            3-letter IATA code of the departure airport.
            Use the Airports endpoint to retrieve full airport details including timezone.
          pattern: '^[A-Z]{3}$'
          minLength: 3
          maxLength: 3
          example: JFK
        destination:
          type: string
          description: |
            3-letter IATA code of the arrival airport.
            Use the Airports endpoint to retrieve full airport details including timezone.
          pattern: '^[A-Z]{3}$'
          minLength: 3
          maxLength: 3
          example: LAX
        departure_time:
          type: string
          format: date-time
          description: |
            Scheduled departure time in ISO 8601 format (UTC timezone).
            For delayed flights, this reflects the original scheduled time, not the updated departure.
          example: '2025-01-15T08:00:00Z'
        arrival_time:
          type: string
          format: date-time
          description: |
            Scheduled arrival time in ISO 8601 format (UTC timezone).
            Calculated based on departure time plus flight duration.
          example: '2025-01-15T11:30:00Z'
        duration_minutes:
          type: integer
          description: |
            Total flight duration in minutes, including taxi time.
            Calculated based on great-circle distance between airports plus standard taxi allowances.
          minimum: 30
          maximum: 1200
          example: 330
        status:
          type: string
          description: |
            Current operational status of the flight:
            - \`scheduled\`: Flight is confirmed and on schedule
            - \`delayed\`: Flight departure has been delayed
            - \`boarding\`: Aircraft is at gate, passengers are boarding
            - \`departed\`: Aircraft has left the gate
            - \`in_air\`: Aircraft is airborne (also shown as \`in_flight\` in some systems)
            - \`landed\`: Aircraft has landed at destination
            - \`cancelled\`: Flight has been cancelled and will not operate
          enum:
            - scheduled
            - delayed
            - boarding
            - departed
            - in_air
            - in_flight
            - landed
            - cancelled
          example: scheduled
        aircraft_type:
          type: string
          description: |
            Aircraft model assigned to operate this flight. Aircraft assignments may change
            due to operational requirements.
          enum:
            - Boeing 777-300ER
            - Boeing 787-9 Dreamliner
            - Airbus A380
            - Airbus A350-900
            - Boeing 737 MAX 8
            - Airbus A321neo
          example: Boeing 777-300ER
        available_seats:
          type: object
          description: |
            Real-time seat availability by cabin class. Availability is updated as bookings
            are made or cancelled. A value of 0 indicates the class is sold out.
          required:
            - economy
            - business
            - first
          properties:
            economy:
              type: integer
              description: Number of available economy class seats
              minimum: 0
              maximum: 400
              example: 150
            business:
              type: integer
              description: Number of available business class seats
              minimum: 0
              maximum: 100
              example: 40
            first:
              type: integer
              description: Number of available first class seats
              minimum: 0
              maximum: 20
              example: 8
        prices:
          type: object
          description: |
            Current ticket prices by cabin class in USD. Prices are dynamic and may change
            based on demand, remaining inventory, and time until departure.
          required:
            - economy
            - business
            - first
          properties:
            economy:
              type: number
              format: double
              description: Economy class base fare (excluding taxes and fees)
              minimum: 50
              maximum: 5000
              example: 299.99
            business:
              type: number
              format: double
              description: Business class base fare (excluding taxes and fees)
              minimum: 200
              maximum: 15000
              example: 899.99
            first:
              type: number
              format: double
              description: First class base fare (excluding taxes and fees)
              minimum: 500
              maximum: 30000
              example: 2499.99
      example:
        id: flight-0-0
        flight_number: AA100
        airline_code: AA
        origin: JFK
        destination: LAX
        departure_time: '2025-01-15T08:00:00Z'
        arrival_time: '2025-01-15T11:30:00Z'
        duration_minutes: 330
        status: scheduled
        aircraft_type: Boeing 777-300ER
        available_seats:
          economy: 150
          business: 40
          first: 8
        prices:
          economy: 299.99
          business: 899.99
          first: 2499.99

    PaginatedFlights:
      type: object
      description: Paginated list of flights
      required:
        - data
        - pagination
      properties:
        data:
          type: array
          description: List of flights
          items:
            $ref: '#/components/schemas/Flight'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Booking:
      type: object
      description: |
        Complete flight booking information including passengers, payment status, and seat assignments.

        A booking represents a confirmed or pending reservation for one or more passengers on a specific flight.
        Each booking has a unique confirmation code (PNR - Passenger Name Record) used for check-in and reference.
      required:
        - id
        - confirmation_code
        - flight_id
        - status
        - passengers
        - total_price
        - created_at
      properties:
        id:
          type: string
          description: |
            Unique system-generated identifier for the booking.
            Format: \`booking-\` followed by a sequential number.
          pattern: '^booking-[0-9]+$'
          readOnly: true
          example: booking-001
        confirmation_code:
          type: string
          description: |
            6-character alphanumeric booking confirmation code, also known as PNR (Passenger Name Record).
            This code is used for online check-in, flight status inquiries, and airport kiosk access.
            Share this code with passengers for self-service operations.
          pattern: '^[A-Z0-9]{6}$'
          minLength: 6
          maxLength: 6
          readOnly: true
          example: ABC123
        flight_id:
          type: string
          description: Reference to the booked flight. Use this ID to retrieve flight details.
          pattern: '^flight-[0-9]+-[0-9]+$'
          example: flight-0-0
        status:
          type: string
          description: |
            Current status of the booking:
            - \`pending\`: Booking created but awaiting payment confirmation
            - \`confirmed\`: Payment received, seats reserved
            - \`checked_in\`: At least one passenger has checked in for the flight
            - \`cancelled\`: Booking has been cancelled (cannot be reinstated)
          enum:
            - pending
            - confirmed
            - checked_in
            - cancelled
          example: confirmed
        payment_status:
          type: string
          description: |
            Current payment status:
            - \`pending\`: Payment not yet processed or awaiting confirmation
            - \`paid\`: Payment successfully processed
            - \`refunded\`: Payment has been refunded (typically after cancellation)
          enum:
            - pending
            - paid
            - refunded
          example: paid
        cabin_class:
          type: string
          description: |
            The cabin class for all passengers in this booking. All passengers on a single booking
            travel in the same class.
          enum:
            - economy
            - business
            - first
          example: economy
        passengers:
          type: array
          description: |
            List of all passengers included in this booking. Each passenger has assigned seating
            and can check in individually.
          items:
            $ref: '#/components/schemas/Passenger'
          minItems: 1
          maxItems: 9
        seat_assignments:
          type: array
          description: |
            Detailed seat assignments mapping each passenger to their assigned seat.
            Automatically generated when the booking is confirmed.
          items:
            type: object
            description: Individual seat assignment
            required:
              - passenger_id
              - seat
            properties:
              passenger_id:
                type: string
                description: Reference to the passenger
                example: pax-001
              seat:
                type: string
                description: Assigned seat number
                pattern: '^[0-9]{1,2}[A-K]$'
                example: 24A
          readOnly: true
        total_price:
          type: number
          format: double
          description: |
            Total booking price in the specified currency. This is the sum of all passenger fares
            plus applicable taxes and fees.
          minimum: 0
          example: 299.99
        currency:
          type: string
          description: |
            ISO 4217 currency code for the total_price. Currently only USD is supported.
          enum:
            - USD
          default: USD
          example: USD
        created_at:
          type: string
          format: date-time
          description: |
            Timestamp when the booking was initially created (ISO 8601 format).
            This represents when the booking request was submitted, not when it was confirmed.
          readOnly: true
          example: '2024-12-01T10:30:00Z'
        updated_at:
          type: string
          format: date-time
          description: |
            Timestamp of the most recent update to the booking (ISO 8601 format).
            Updated when status changes, check-in occurs, or modifications are made.
          readOnly: true
          example: '2024-12-01T10:30:45Z'
      example:
        id: booking-001
        confirmation_code: ABC123
        flight_id: flight-0-0
        status: confirmed
        payment_status: paid
        cabin_class: economy
        passengers:
          - id: pax-001
            first_name: John
            last_name: Doe
            date_of_birth: '1985-06-15'
            email: john.doe@example.com
            phone: '+1-555-123-4567'
            seat_number: 24A
        seat_assignments:
          - passenger_id: pax-001
            seat: 24A
        total_price: 299.99
        currency: USD
        created_at: '2024-12-01T10:30:00Z'
        updated_at: '2024-12-01T10:30:45Z'

    BookingCreate:
      type: object
      description: Request body for creating a new booking
      required:
        - flight_id
        - passengers
        - cabin_class
      properties:
        flight_id:
          type: string
          description: ID of the flight to book
          example: flight-001
        passengers:
          type: array
          description: List of passengers for the booking
          minItems: 1
          maxItems: 9
          items:
            $ref: '#/components/schemas/PassengerCreate'
        cabin_class:
          type: string
          description: Desired cabin class
          enum:
            - economy
            - business
            - first
          example: economy

    PassengerCreate:
      type: object
      description: |
        Passenger information required when creating a new booking.

        All passenger names must exactly match government-issued identification documents
        that will be used for travel. Name mismatches may result in denied boarding.
      required:
        - first_name
        - last_name
        - date_of_birth
      properties:
        first_name:
          type: string
          description: |
            Passenger's legal first name exactly as it appears on their ID/passport.
            Do not include titles (Mr., Mrs., Dr.) or suffixes (Jr., III).
          minLength: 1
          maxLength: 100
          pattern: '^[A-Za-z\\s\\-\\''\\.]+$'
          example: John
        last_name:
          type: string
          description: |
            Passenger's legal last name (family name/surname) exactly as it appears on their ID/passport.
          minLength: 1
          maxLength: 100
          pattern: '^[A-Za-z\\s\\-\\''\\.]+$'
          example: Doe
        date_of_birth:
          type: string
          format: date
          description: |
            Passenger's date of birth in ISO 8601 format (YYYY-MM-DD).
            Required for security screening and fare determination.
          example: '1985-06-15'
        email:
          type: string
          format: email
          description: |
            Email address for booking confirmation and flight notifications.
            Electronic boarding passes will be sent to this address.
          maxLength: 254
          example: john.doe@example.com
        phone:
          type: string
          description: |
            Phone number with international country code for SMS notifications.
            Format: +{country_code}-{number} (e.g., +1-555-123-4567)
          pattern: '^\\+[0-9]{1,3}-?[0-9\\-\\s]{6,20}$'
          example: '+1-555-123-4567'
        passport_number:
          type: string
          description: |
            Passport or government ID number for international travel.
            Required for international flights for Advance Passenger Information (API).
          pattern: '^[A-Z0-9]{5,20}$'
          minLength: 5
          maxLength: 20
          example: AB1234567
        frequent_flyer_number:
          type: string
          description: |
            Airline loyalty program membership number to earn miles/points for this flight.
            Format varies by airline, typically 2-letter code + 6-12 digits.
          pattern: '^[A-Z]{2}[0-9]{6,12}$'
          example: AA123456789
      example:
        first_name: John
        last_name: Doe
        date_of_birth: '1985-06-15'
        email: john.doe@example.com
        phone: '+1-555-123-4567'
        passport_number: AB1234567
        frequent_flyer_number: AA123456789

    BookingAccepted:
      type: object
      description: Response when booking is accepted for async processing
      required:
        - message
        - job_id
        - status
      properties:
        message:
          type: string
          description: Confirmation message
          example: Booking request accepted for processing
        job_id:
          type: string
          description: Job ID to poll for status
          example: job-abc123def456
        status:
          type: string
          description: Initial job status
          enum:
            - processing
          example: processing
        estimated_time_seconds:
          type: string
          description: Estimated processing time range
          example: '20-50'
        note:
          type: string
          description: Instructions for polling
          example: Poll GET /bookings/{job_id}/status for updates

    PaginatedBookings:
      type: object
      description: Paginated list of bookings
      required:
        - data
        - pagination
      properties:
        data:
          type: array
          description: List of bookings
          items:
            $ref: '#/components/schemas/Booking'
        pagination:
          $ref: '#/components/schemas/Pagination'

    JobStatus:
      type: object
      description: Async job status information
      required:
        - job_id
        - status
      properties:
        job_id:
          type: string
          description: Unique job identifier
          example: job-abc123def456
        status:
          type: string
          description: Current job status
          enum:
            - pending
            - processing
            - completed
            - failed
          example: processing
        progress:
          type: integer
          description: Processing progress percentage (0-100)
          minimum: 0
          maximum: 100
          example: 45
        eta_seconds:
          type: integer
          description: Estimated seconds until completion
          minimum: 0
          example: 25
        started_at:
          type: string
          format: date-time
          description: When processing started
          example: '2024-12-05T14:30:00Z'
        completed_at:
          type: string
          format: date-time
          description: When processing completed (if finished)
          example: '2024-12-05T14:30:35Z'
        result:
          $ref: '#/components/schemas/Booking'
        error:
          type: string
          description: Error message if job failed
          example: Payment processing failed

    Passenger:
      type: object
      description: |
        Complete passenger information including personal details, contact information, and travel documents.

        Passenger records are created during the booking process and contain all necessary information
        for airline check-in, security screening, and boarding.
      required:
        - id
        - first_name
        - last_name
        - date_of_birth
      properties:
        id:
          type: string
          description: |
            Unique system-generated identifier for the passenger record.
            Format: \`pax-\` followed by a sequential number.
          pattern: '^pax-[0-9]+$'
          readOnly: true
          example: pax-001
        first_name:
          type: string
          description: |
            Passenger's legal first name exactly as it appears on their government-issued ID or passport.
            This name will appear on the boarding pass and must match travel documents.
          minLength: 1
          maxLength: 100
          example: John
        last_name:
          type: string
          description: |
            Passenger's legal last name (surname/family name) exactly as it appears on their
            government-issued ID or passport.
          minLength: 1
          maxLength: 100
          example: Doe
        date_of_birth:
          type: string
          format: date
          description: |
            Passenger's date of birth in ISO 8601 format (YYYY-MM-DD). Required for security screening
            and to determine applicable fares (infant, child, adult, senior).
          example: '1985-06-15'
        email:
          type: string
          format: email
          description: |
            Passenger's email address for booking confirmations, flight updates, and electronic boarding passes.
            Notifications about flight changes, delays, or cancellations will be sent to this address.
          maxLength: 254
          example: john.doe@example.com
        phone:
          type: string
          description: |
            Passenger's phone number with country code for SMS notifications and emergency contact.
            Format should include country code (e.g., +1 for USA).
          pattern: '^\\+[0-9]{1,3}-?[0-9\\-\\s]{6,20}$'
          example: '+1-555-123-4567'
        passport_number:
          type: string
          description: |
            Passport or national ID number for international travel. Required for international flights
            and used for Advance Passenger Information (API) submission to destination countries.
          pattern: '^[A-Z0-9]{5,20}$'
          minLength: 5
          maxLength: 20
          nullable: true
          example: AB1234567
        frequent_flyer_number:
          type: string
          description: |
            Airline loyalty program membership number. When provided, the passenger earns miles/points
            for the flight and may receive status benefits like priority boarding or lounge access.
          pattern: '^[A-Z]{2}[0-9]{6,12}$'
          nullable: true
          example: FF100042
        seat_number:
          type: string
          description: |
            Assigned seat number in format: row number (1-60) + seat letter (A-K).
            Seat letters typically follow: A/K=window, B/J=middle, C/D/E/F/G/H=aisle (varies by aircraft).
          pattern: '^[0-9]{1,2}[A-K]$'
          readOnly: true
          nullable: true
          example: 24A
        booking_id:
          type: string
          description: Reference to the associated booking that this passenger belongs to.
          pattern: '^booking-[0-9]+$'
          readOnly: true
          example: booking-001
      example:
        id: pax-001
        first_name: John
        last_name: Doe
        date_of_birth: '1985-06-15'
        email: john.doe@example.com
        phone: '+1-555-123-4567'
        passport_number: AB1234567
        frequent_flyer_number: FF100042
        seat_number: 24A
        booking_id: booking-001

    Pagination:
      type: object
      description: Pagination metadata
      required:
        - page
        - limit
        - total
        - pages
        - has_next
        - has_prev
      properties:
        page:
          type: integer
          description: Current page number (1-indexed)
          minimum: 1
          example: 1
        limit:
          type: integer
          description: Items per page
          minimum: 1
          maximum: 100
          example: 20
        total:
          type: integer
          description: Total number of items across all pages
          minimum: 0
          example: 150
        pages:
          type: integer
          description: Total number of pages
          minimum: 0
          example: 8
        has_next:
          type: boolean
          description: Whether there is a next page
          example: true
        has_prev:
          type: boolean
          description: Whether there is a previous page
          example: false
`;

export async function GET() {
  return new NextResponse(openApiSpec, {
    headers: {
      'Content-Type': 'text/yaml',
    },
  });
}
