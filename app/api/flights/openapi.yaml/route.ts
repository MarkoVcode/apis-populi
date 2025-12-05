import { NextResponse } from 'next/server';

const openApiSpec = `openapi: 3.0.3
info:
  title: Flights API
  description: Aviation API with airports, airlines, flights, and bookings. Features async booking confirmation with polling pattern.
  version: 1.0.0
  contact:
    name: APIs Populi
    url: https://github.com/MarkoVcode/apis-populi
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: /api/flights
    description: Flights API

security:
  - BearerAuth: []

paths:
  /auth/token:
    post:
      summary: Get JWT token
      operationId: getToken
      tags: [Authentication]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, password]
              properties:
                username:
                  type: string
                  example: demo
                password:
                  type: string
                  example: demo123
      responses:
        '200':
          description: JWT token
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                  token_type:
                    type: string
                    example: Bearer
                  expires_in:
                    type: integer
        '401':
          $ref: '#/components/responses/Unauthorized'

  /auth/oauth/authorize:
    post:
      summary: OAuth2 authorization
      operationId: oauthAuthorize
      tags: [Authentication]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [client_id, redirect_uri]
              properties:
                client_id:
                  type: string
                redirect_uri:
                  type: string
                scope:
                  type: string
                state:
                  type: string
      responses:
        '200':
          description: Authorization code
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: string
                  state:
                    type: string

  /auth/oauth/token:
    post:
      summary: Exchange code for token
      operationId: oauthToken
      tags: [Authentication]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [grant_type, code, client_id, client_secret]
              properties:
                grant_type:
                  type: string
                  enum: [authorization_code, refresh_token]
                code:
                  type: string
                client_id:
                  type: string
                client_secret:
                  type: string
                refresh_token:
                  type: string
      responses:
        '200':
          description: Access token
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                  refresh_token:
                    type: string
                  token_type:
                    type: string
                  expires_in:
                    type: integer

  /airports:
    get:
      summary: List airports
      operationId: listAirports
      tags: [Airports]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: country
          in: query
          schema:
            type: string
        - name: city
          in: query
          schema:
            type: string
        - name: q
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of airports
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedAirports'

  /airports/{code}:
    get:
      summary: Get airport by IATA code
      operationId: getAirport
      tags: [Airports]
      parameters:
        - name: code
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Airport details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Airport'
        '404':
          $ref: '#/components/responses/NotFound'

  /airlines:
    get:
      summary: List airlines
      operationId: listAirlines
      tags: [Airlines]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
      responses:
        '200':
          description: List of airlines
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedAirlines'

  /airlines/{code}:
    get:
      summary: Get airline by code
      operationId: getAirline
      tags: [Airlines]
      parameters:
        - name: code
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Airline details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Airline'
        '404':
          $ref: '#/components/responses/NotFound'

  /flights:
    get:
      summary: Search flights
      operationId: searchFlights
      tags: [Flights]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: origin
          in: query
          schema:
            type: string
        - name: destination
          in: query
          schema:
            type: string
        - name: departure_date
          in: query
          schema:
            type: string
            format: date
        - name: status
          in: query
          schema:
            type: string
            enum: [scheduled, boarding, departed, in_air, landed, cancelled]
      responses:
        '200':
          description: List of flights
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedFlights'

  /flights/{id}:
    get:
      summary: Get flight details
      operationId: getFlight
      tags: [Flights]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Flight details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Flight'
        '404':
          $ref: '#/components/responses/NotFound'

  /bookings:
    get:
      summary: List bookings
      operationId: listBookings
      tags: [Bookings]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
      responses:
        '200':
          description: List of bookings
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedBookings'
    post:
      summary: Create booking (async)
      operationId: createBooking
      tags: [Bookings]
      description: Creates a booking asynchronously. Returns a job_id to poll for status.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookingCreate'
      responses:
        '202':
          description: Booking request accepted
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  job_id:
                    type: string
                  estimated_time_seconds:
                    type: string

  /bookings/{id}:
    get:
      summary: Get booking details
      operationId: getBooking
      tags: [Bookings]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Booking details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Booking'
        '404':
          $ref: '#/components/responses/NotFound'
    delete:
      summary: Cancel booking
      operationId: cancelBooking
      tags: [Bookings]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Booking cancelled
        '404':
          $ref: '#/components/responses/NotFound'

  /bookings/{id}/status:
    get:
      summary: Poll booking job status
      operationId: getBookingStatus
      tags: [Bookings]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Job status
          content:
            application/json:
              schema:
                type: object
                properties:
                  job_id:
                    type: string
                  status:
                    type: string
                    enum: [pending, processing, completed, failed]
                  progress:
                    type: integer
                  eta_seconds:
                    type: integer
                  result:
                    $ref: '#/components/schemas/Booking'
                  error:
                    type: string

  /passengers/{id}:
    get:
      summary: Get passenger info
      operationId: getPassenger
      tags: [Passengers]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Passenger details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Passenger'
        '404':
          $ref: '#/components/responses/NotFound'

  /reset:
    post:
      summary: Reset all data
      operationId: resetData
      tags: [Admin]
      responses:
        '200':
          description: Data reset successful

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    page:
      name: page
      in: query
      schema:
        type: integer
        default: 1
    limit:
      name: limit
      in: query
      schema:
        type: integer
        default: 20

  responses:
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    NotFound:
      description: Not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  schemas:
    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string

    Airport:
      type: object
      properties:
        code:
          type: string
        name:
          type: string
        city:
          type: string
        country:
          type: string
        timezone:
          type: string
        latitude:
          type: number
        longitude:
          type: number

    PaginatedAirports:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Airport'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Airline:
      type: object
      properties:
        code:
          type: string
        name:
          type: string
        country:
          type: string
        logo_url:
          type: string

    PaginatedAirlines:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Airline'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Flight:
      type: object
      properties:
        id:
          type: string
        flight_number:
          type: string
        airline_code:
          type: string
        origin:
          type: string
        destination:
          type: string
        departure_time:
          type: string
          format: date-time
        arrival_time:
          type: string
          format: date-time
        status:
          type: string
        aircraft_type:
          type: string
        available_seats:
          type: object
        prices:
          type: object

    PaginatedFlights:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Flight'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Booking:
      type: object
      properties:
        id:
          type: string
        confirmation_code:
          type: string
        flight_id:
          type: string
        status:
          type: string
        passengers:
          type: array
          items:
            $ref: '#/components/schemas/Passenger'
        total_price:
          type: number
        created_at:
          type: string
          format: date-time

    BookingCreate:
      type: object
      required: [flight_id, passengers, cabin_class]
      properties:
        flight_id:
          type: string
        passengers:
          type: array
          items:
            type: object
            required: [first_name, last_name, date_of_birth]
            properties:
              first_name:
                type: string
              last_name:
                type: string
              date_of_birth:
                type: string
                format: date
              email:
                type: string
              phone:
                type: string
        cabin_class:
          type: string
          enum: [economy, business, first]

    PaginatedBookings:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Booking'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Passenger:
      type: object
      properties:
        id:
          type: string
        first_name:
          type: string
        last_name:
          type: string
        date_of_birth:
          type: string
        email:
          type: string
        phone:
          type: string
        seat_number:
          type: string

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        pages:
          type: integer
        has_next:
          type: boolean
        has_prev:
          type: boolean
`;

export async function GET() {
  return new NextResponse(openApiSpec, {
    headers: {
      'Content-Type': 'text/yaml',
    },
  });
}
