import { NextResponse } from 'next/server';

const openApiSpec = `openapi: 3.0.3
info:
  title: Content Pages API
  description: |
    CMS-like content delivery API with page sections, placements, dynamic content variations, and cookie-based personalization.

    ## Key Features

    - **Page Resources**: 10 pre-defined page types (header, footer, main-menu, etc.)
    - **Placements**: Filter content by placement position (hero, promo, sidebar)
    - **Dynamic Content**: Publish date changes every 5 minutes, with random editor-like variations
    - **Personalization**: Cookie-based user recognition for personalized content

    ## Authentication

    No authentication required. Content is public. Optional personalization via cookie.

    ## Personalization Flow

    1. POST /api/content/cookie with user details to create profile and receive cookie
    2. Include cookie in subsequent requests to /api/content/pages/{slug}
    3. Content will be personalized with user's name and segment-specific messaging
  version: 1.0.0
  contact:
    name: APIs Populi
    url: https://github.com/MarkoVcode/apis-populi

servers:
  - url: /api/content
    description: Content Pages API

tags:
  - name: Pages
    description: Content page operations
  - name: Personalization
    description: Cookie-based personalization

paths:
  /pages:
    get:
      tags:
        - Pages
      summary: List all content pages
      description: Returns a paginated list of all available content pages with metadata
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
          description: Page number
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
          description: Items per page
        - name: sort
          in: query
          schema:
            type: string
            enum: [slug, title, created_at, updated_at]
            default: slug
          description: Sort field
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: asc
          description: Sort order
      responses:
        '200':
          description: Paginated list of content pages
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/ContentPageListItem'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /pages/{slug}:
    get:
      tags:
        - Pages
      summary: Get page content by slug
      description: |
        Returns the full content of a page including placements.

        **Placement Filtering**: Use the \`placement\` query parameter to filter which placements are returned.
        Supports both comma-separated values and multiple parameters.

        **Dynamic Content**: The \`publish_date\` changes every 5 minutes, and content may have minor
        variations (simulating editor activity).

        **Personalization**: If a valid personalization cookie is present, content will be personalized
        with the user's name and segment-specific messaging.
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
            enum: [header, footer, main-menu, main-content, how-to, about-company, contact, privacy-policy, terms-of-service, faq]
          description: Page slug identifier
        - name: placement
          in: query
          schema:
            type: string
          description: |
            Filter placements. Accepts comma-separated values or multiple parameters.
            Valid values: hero, promo, sidebar
          examples:
            single:
              value: hero
              summary: Single placement
            multiple_comma:
              value: hero,promo
              summary: Multiple (comma-separated)
      responses:
        '200':
          description: Page content with placements
          headers:
            Cache-Control:
              schema:
                type: string
              description: Cache control header (max-age=300)
            ETag:
              schema:
                type: string
              description: Entity tag for cache validation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ContentPageResponse'
        '404':
          $ref: '#/components/responses/NotFound'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /cookie:
    post:
      tags:
        - Personalization
      summary: Create personalization profile
      description: |
        Creates a user profile for content personalization and sets a cookie.

        The cookie will be automatically included in subsequent requests when using
        a browser or tools that support cookies (like curl with -c/-b flags).
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CookieCreateRequest'
            examples:
              basic:
                summary: Basic profile
                value:
                  name: John Doe
              full:
                summary: Full profile
                value:
                  name: Jane Smith
                  email: jane@example.com
                  segment: premium
                  preferences:
                    theme: dark
                    locale: en-US
                    interests: [technology, travel]
      responses:
        '201':
          description: Profile created successfully
          headers:
            Set-Cookie:
              schema:
                type: string
              description: Personalization cookie
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CookieResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '429':
          $ref: '#/components/responses/TooManyRequests'

    get:
      tags:
        - Personalization
      summary: Get current profile
      description: Returns the current personalization profile if a valid cookie exists
      responses:
        '200':
          description: Profile information (or instructions if no cookie)
          content:
            application/json:
              schema:
                oneOf:
                  - $ref: '#/components/schemas/ProfileFound'
                  - $ref: '#/components/schemas/ProfileNotFound'
        '429':
          $ref: '#/components/responses/TooManyRequests'

    delete:
      tags:
        - Personalization
      summary: Delete personalization
      description: Deletes the personalization profile and clears the cookie
      responses:
        '200':
          description: Profile deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Personalization profile deleted and cookie cleared
                  personalized:
                    type: boolean
                    example: false
        '404':
          description: No cookie found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '429':
          $ref: '#/components/responses/TooManyRequests'

  /reset:
    post:
      tags:
        - Pages
      summary: Reset content data
      description: Resets all content pages to their initial state. Also clears all user profiles.
      responses:
        '200':
          description: Data reset successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Content data reset successfully

components:
  schemas:
    ContentPageListItem:
      type: object
      properties:
        id:
          type: string
          example: page-001
        slug:
          type: string
          example: header
        title:
          type: string
          example: Site Header
        description:
          type: string
          example: Global header component with branding and navigation
        version:
          type: string
          example: "2.1.0"
        placement_count:
          type: integer
          example: 3
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    ContentPageResponse:
      type: object
      properties:
        id:
          type: string
        slug:
          type: string
        title:
          type: string
        description:
          type: string
        version:
          type: string
        placements:
          type: array
          items:
            $ref: '#/components/schemas/Placement'
        meta:
          $ref: '#/components/schemas/PageMeta'
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        publish_date:
          type: string
          format: date-time
          description: Changes every 5 minutes
        cache_control:
          type: string
          example: max-age=300
        etag:
          type: string
          description: Changes with content
        personalized:
          type: boolean
          description: Whether content is personalized
        user:
          type: object
          description: Present only if personalized
          properties:
            name:
              type: string
            segment:
              type: string

    Placement:
      type: object
      properties:
        id:
          type: string
        position:
          type: string
          enum: [hero, promo, sidebar]
        type:
          type: string
          enum: [banner, text, cta, navigation, widget]
        title:
          type: string
        content:
          type: string
        cta:
          type: object
          properties:
            text:
              type: string
            url:
              type: string
            style:
              type: string
              enum: [primary, secondary, link]
        image_url:
          type: string
        priority:
          type: integer
        visibility:
          type: string
          enum: [all, anonymous, authenticated]

    PageMeta:
      type: object
      properties:
        keywords:
          type: array
          items:
            type: string
        author:
          type: string
        canonical_url:
          type: string
        og_title:
          type: string
        og_description:
          type: string
        og_image:
          type: string

    CookieCreateRequest:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          minLength: 1
          description: User's display name
        email:
          type: string
          format: email
          description: User's email (optional)
        segment:
          type: string
          enum: [standard, premium, vip]
          default: standard
          description: User segment for content targeting
        preferences:
          type: object
          properties:
            theme:
              type: string
              enum: [light, dark, system]
            locale:
              type: string
              example: en-US
            interests:
              type: array
              items:
                type: string

    CookieResponse:
      type: object
      properties:
        profile_id:
          type: string
          example: prf_abc123xyz
        name:
          type: string
        email:
          type: string
        preferences:
          type: object
        segment:
          type: string
        created_at:
          type: string
          format: date-time
        message:
          type: string
        usage:
          type: object
          properties:
            description:
              type: string
            example:
              type: string

    ProfileFound:
      type: object
      properties:
        personalized:
          type: boolean
          example: true
        profile:
          type: object
          properties:
            profile_id:
              type: string
            name:
              type: string
            email:
              type: string
            preferences:
              type: object
            segment:
              type: string
            created_at:
              type: string
        message:
          type: string

    ProfileNotFound:
      type: object
      properties:
        personalized:
          type: boolean
          example: false
        message:
          type: string
        how_to_create:
          type: object

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

    Error:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
        status:
          type: integer

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    TooManyRequests:
      description: Rate limit exceeded
      headers:
        X-RateLimit-Limit:
          schema:
            type: integer
        X-RateLimit-Remaining:
          schema:
            type: integer
        X-RateLimit-Reset:
          schema:
            type: integer
        Retry-After:
          schema:
            type: integer
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
`;

export async function GET() {
  return new NextResponse(openApiSpec, {
    headers: {
      'Content-Type': 'text/yaml',
    },
  });
}
