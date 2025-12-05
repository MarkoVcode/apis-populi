import { NextResponse } from 'next/server';

const openApiSpec = `openapi: 3.0.3
info:
  title: Space API
  description: Cosmic database with planets, stars, galaxies, constellations, space missions, and astronauts.
  version: 1.0.0
  contact:
    name: APIs Populi
    url: https://github.com/MarkoVcode/apis-populi
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: /api/space
    description: Space API

security:
  - BearerAuth: []
  - BasicAuth: []

paths:
  /planets:
    get:
      summary: List planets
      operationId: listPlanets
      tags: [Planets]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: type
          in: query
          schema:
            type: string
            enum: [terrestrial, gas_giant, ice_giant, dwarf]
        - name: habitable
          in: query
          schema:
            type: boolean
      responses:
        '200':
          description: List of planets
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedPlanets'

  /planets/{id}:
    get:
      summary: Get planet details
      operationId: getPlanet
      tags: [Planets]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Planet details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Planet'
        '404':
          $ref: '#/components/responses/NotFound'

  /planets/{id}/moons:
    get:
      summary: Get planet's moons
      operationId: getPlanetMoons
      tags: [Planets]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: List of moons
          content:
            application/json:
              schema:
                type: object
                properties:
                  planet_id:
                    type: string
                  moons:
                    type: array
                    items:
                      $ref: '#/components/schemas/Moon'

  /stars:
    get:
      summary: List stars
      operationId: listStars
      tags: [Stars]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: spectral_class
          in: query
          schema:
            type: string
        - name: constellation
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of stars
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedStars'

  /stars/{id}:
    get:
      summary: Get star details
      operationId: getStar
      tags: [Stars]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Star details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Star'

  /galaxies:
    get:
      summary: List galaxies
      operationId: listGalaxies
      tags: [Galaxies]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: type
          in: query
          schema:
            type: string
            enum: [spiral, elliptical, irregular, lenticular]
      responses:
        '200':
          description: List of galaxies
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedGalaxies'

  /galaxies/{id}:
    get:
      summary: Get galaxy details
      operationId: getGalaxy
      tags: [Galaxies]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Galaxy details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Galaxy'

  /constellations:
    get:
      summary: List constellations
      operationId: listConstellations
      tags: [Constellations]
      responses:
        '200':
          description: List of constellations
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Constellation'

  /constellations/{id}:
    get:
      summary: Get constellation with stars
      operationId: getConstellation
      tags: [Constellations]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Constellation details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Constellation'

  /missions:
    get:
      summary: List space missions
      operationId: listMissions
      tags: [Missions]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: agency
          in: query
          schema:
            type: string
        - name: status
          in: query
          schema:
            type: string
            enum: [planned, active, completed, failed]
        - name: type
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of missions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedMissions'
    post:
      summary: Plan new mission
      operationId: createMission
      tags: [Missions]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MissionCreate'
      responses:
        '201':
          description: Mission created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Mission'

  /missions/{id}:
    get:
      summary: Get mission details
      operationId: getMission
      tags: [Missions]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Mission details with timeline
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Mission'

  /astronauts:
    get:
      summary: List astronauts
      operationId: listAstronauts
      tags: [Astronauts]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: agency
          in: query
          schema:
            type: string
        - name: status
          in: query
          schema:
            type: string
            enum: [active, retired, deceased]
      responses:
        '200':
          description: List of astronauts
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedAstronauts'

  /astronauts/{id}:
    get:
      summary: Get astronaut profile
      operationId: getAstronaut
      tags: [Astronauts]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Astronaut profile with missions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Astronaut'

  /satellites:
    get:
      summary: List satellites
      operationId: listSatellites
      tags: [Satellites]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: type
          in: query
          schema:
            type: string
        - name: orbit
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of satellites
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedSatellites'

  /events:
    get:
      summary: Upcoming celestial events
      operationId: listEvents
      tags: [Events]
      parameters:
        - name: type
          in: query
          schema:
            type: string
            enum: [eclipse, meteor_shower, conjunction, opposition, transit]
        - name: from
          in: query
          schema:
            type: string
            format: date
        - name: to
          in: query
          schema:
            type: string
            format: date
      responses:
        '200':
          description: List of events
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/CelestialEvent'

  /search:
    get:
      summary: Search across all space objects
      operationId: search
      tags: [Search]
      parameters:
        - name: q
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Search results
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SearchResults'

  /compare:
    get:
      summary: Compare celestial bodies
      operationId: compare
      tags: [Compare]
      parameters:
        - name: ids
          in: query
          required: true
          description: Comma-separated IDs (2-5)
          schema:
            type: string
        - name: type
          in: query
          description: Object type
          schema:
            type: string
            enum: [planets, stars, galaxies]
            default: planets
      responses:
        '200':
          description: Comparison table
          content:
            application/json:
              schema:
                type: object
                properties:
                  type:
                    type: string
                  objects:
                    type: array
                    items:
                      type: object
                  comparison:
                    type: object

  /distance:
    get:
      summary: Calculate distance between objects
      operationId: calculateDistance
      tags: [Distance]
      parameters:
        - name: from
          in: query
          required: true
          schema:
            type: string
        - name: to
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Distance calculation
          content:
            application/json:
              schema:
                type: object
                properties:
                  from:
                    type: object
                  to:
                    type: object
                  distance:
                    type: object

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
    BasicAuth:
      type: http
      scheme: basic

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

    Planet:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        type:
          type: string
        mass_earth:
          type: number
        radius_earth:
          type: number
        distance_au:
          type: number
        orbital_period_days:
          type: number
        gravity_ms2:
          type: number
        moons_count:
          type: integer
        has_rings:
          type: boolean
        habitable:
          type: boolean
        atmosphere:
          type: array
          items:
            type: string

    PaginatedPlanets:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Planet'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Moon:
      type: object
      properties:
        name:
          type: string
        radius_km:
          type: number
        orbital_period_days:
          type: number

    Star:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        constellation:
          type: string
        spectral_class:
          type: string
        distance_ly:
          type: number
        temperature_k:
          type: integer
        mass_solar:
          type: number
        radius_solar:
          type: number
        luminosity_solar:
          type: number
        apparent_magnitude:
          type: number

    PaginatedStars:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Star'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Galaxy:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        type:
          type: string
        distance_mly:
          type: number
        diameter_kly:
          type: number
        stars_estimate:
          type: string
        description:
          type: string

    PaginatedGalaxies:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Galaxy'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Constellation:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        abbreviation:
          type: string
        family:
          type: string
        area_sq_deg:
          type: number
        brightest_star:
          type: string
        description:
          type: string

    Mission:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        agency:
          type: string
        type:
          type: string
        status:
          type: string
        launch_date:
          type: string
        end_date:
          type: string
        target:
          type: string
        description:
          type: string
        crew:
          type: array
          items:
            type: string

    MissionCreate:
      type: object
      required: [name, agency, type, target]
      properties:
        name:
          type: string
        agency:
          type: string
        type:
          type: string
        target:
          type: string
        launch_date:
          type: string
        description:
          type: string

    PaginatedMissions:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Mission'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Astronaut:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        nationality:
          type: string
        agency:
          type: string
        status:
          type: string
        birth_date:
          type: string
        space_missions:
          type: integer
        time_in_space_days:
          type: number
        missions:
          type: array
          items:
            type: string

    PaginatedAstronauts:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Astronaut'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Satellite:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        type:
          type: string
        orbit:
          type: string
        launch_date:
          type: string
        operator:
          type: string
        status:
          type: string

    PaginatedSatellites:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Satellite'
        pagination:
          $ref: '#/components/schemas/Pagination'

    CelestialEvent:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        type:
          type: string
        date:
          type: string
        visibility:
          type: string
        description:
          type: string

    SearchResults:
      type: object
      properties:
        query:
          type: string
        results:
          type: object
          properties:
            planets:
              type: array
              items:
                $ref: '#/components/schemas/Planet'
            stars:
              type: array
              items:
                $ref: '#/components/schemas/Star'
            galaxies:
              type: array
              items:
                $ref: '#/components/schemas/Galaxy'
            missions:
              type: array
              items:
                $ref: '#/components/schemas/Mission'
            astronauts:
              type: array
              items:
                $ref: '#/components/schemas/Astronaut'

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
