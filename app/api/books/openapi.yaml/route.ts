import { NextResponse } from 'next/server';

const openApiSpec = `openapi: 3.0.3
info:
  title: Books API
  description: A comprehensive library management API with books, authors, publishers, genres, and reviews
  version: 1.0.0
  contact:
    name: APIs Populi
    url: https://github.com/MarkoVcode/apis-populi
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: /api/books
    description: Books API

security:
  - ApiKeyHeader: []
  - ApiKeyQuery: []

paths:
  /books:
    get:
      summary: List all books
      operationId: listBooks
      tags: [Books]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - $ref: '#/components/parameters/sort'
        - $ref: '#/components/parameters/order'
        - name: q
          in: query
          description: Search in title and description
          schema:
            type: string
        - name: genre_id
          in: query
          description: Filter by genre ID (comma-separated for multiple)
          schema:
            type: string
        - name: author_id
          in: query
          description: Filter by author ID
          schema:
            type: string
        - name: price_min
          in: query
          schema:
            type: number
        - name: price_max
          in: query
          schema:
            type: number
        - name: expand
          in: query
          description: Expand related entities (author,publisher,genre)
          schema:
            type: string
      responses:
        '200':
          description: Paginated list of books
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedBooks'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/TooManyRequests'
    post:
      summary: Create a new book
      operationId: createBook
      tags: [Books]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookCreate'
      responses:
        '201':
          description: Book created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Book'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          $ref: '#/components/responses/Conflict'

  /books/{isbn}:
    get:
      summary: Get a book by ISBN
      operationId: getBook
      tags: [Books]
      parameters:
        - name: isbn
          in: path
          required: true
          schema:
            type: string
        - name: expand
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Book details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Book'
        '404':
          $ref: '#/components/responses/NotFound'
    put:
      summary: Update a book
      operationId: updateBook
      tags: [Books]
      parameters:
        - name: isbn
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookUpdate'
      responses:
        '200':
          description: Book updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Book'
        '404':
          $ref: '#/components/responses/NotFound'
    delete:
      summary: Delete a book
      operationId: deleteBook
      tags: [Books]
      parameters:
        - name: isbn
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Book deleted
        '404':
          $ref: '#/components/responses/NotFound'

  /books/{isbn}/reviews:
    get:
      summary: Get reviews for a book
      operationId: getBookReviews
      tags: [Reviews]
      parameters:
        - name: isbn
          in: path
          required: true
          schema:
            type: string
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: rating_min
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 5
        - name: verified_only
          in: query
          schema:
            type: boolean
      responses:
        '200':
          description: Paginated reviews
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedReviews'
    post:
      summary: Add a review
      operationId: addReview
      tags: [Reviews]
      parameters:
        - name: isbn
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReviewCreate'
      responses:
        '201':
          description: Review created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Review'

  /authors:
    get:
      summary: List all authors
      operationId: listAuthors
      tags: [Authors]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: nationality
          in: query
          schema:
            type: string
        - name: q
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Paginated list of authors
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedAuthors'
    post:
      summary: Create an author
      operationId: createAuthor
      tags: [Authors]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthorCreate'
      responses:
        '201':
          description: Author created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Author'

  /authors/{id}:
    get:
      summary: Get an author
      operationId: getAuthor
      tags: [Authors]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
        - name: include_books
          in: query
          schema:
            type: boolean
      responses:
        '200':
          description: Author details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Author'
        '404':
          $ref: '#/components/responses/NotFound'

  /publishers:
    get:
      summary: List all publishers
      operationId: listPublishers
      tags: [Publishers]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
      responses:
        '200':
          description: List of publishers
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedPublishers'

  /publishers/{id}:
    get:
      summary: Get a publisher
      operationId: getPublisher
      tags: [Publishers]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
        - name: include_books
          in: query
          schema:
            type: boolean
      responses:
        '200':
          description: Publisher details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Publisher'

  /genres:
    get:
      summary: List all genres with book counts
      operationId: listGenres
      tags: [Genres]
      responses:
        '200':
          description: List of genres
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/GenreWithCount'
                  total:
                    type: integer

  /search:
    get:
      summary: Full-text search across books and authors
      operationId: search
      tags: [Search]
      parameters:
        - name: q
          in: query
          required: true
          description: Search query (min 2 characters)
          schema:
            type: string
            minLength: 2
      responses:
        '200':
          description: Search results
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SearchResults'

  /reset:
    post:
      summary: Reset all data to initial state
      operationId: resetData
      tags: [Admin]
      responses:
        '200':
          description: Data reset successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  timestamp:
                    type: string
                    format: date-time

components:
  securitySchemes:
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-API-Key
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api_key

  parameters:
    page:
      name: page
      in: query
      schema:
        type: integer
        default: 1
        minimum: 1
    limit:
      name: limit
      in: query
      schema:
        type: integer
        default: 20
        minimum: 1
        maximum: 100
    sort:
      name: sort
      in: query
      schema:
        type: string
    order:
      name: order
      in: query
      schema:
        type: string
        enum: [asc, desc]
        default: asc

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Unauthorized:
      description: Unauthorized
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
    Conflict:
      description: Resource conflict
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    TooManyRequests:
      description: Rate limit exceeded
      headers:
        Retry-After:
          schema:
            type: integer
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
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  message:
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

    Book:
      type: object
      properties:
        isbn:
          type: string
        title:
          type: string
        author_id:
          type: string
        publisher_id:
          type: string
        genre_id:
          type: string
        publication_year:
          type: integer
        pages:
          type: integer
        language:
          type: string
        description:
          type: string
        price:
          type: number
        in_stock:
          type: boolean
        rating:
          type: number
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        author:
          $ref: '#/components/schemas/Author'
        publisher:
          $ref: '#/components/schemas/Publisher'
        genre:
          $ref: '#/components/schemas/Genre'

    BookCreate:
      type: object
      required: [title, author_id, publisher_id, genre_id]
      properties:
        isbn:
          type: string
        title:
          type: string
        author_id:
          type: string
        publisher_id:
          type: string
        genre_id:
          type: string
        publication_year:
          type: integer
        pages:
          type: integer
        language:
          type: string
        description:
          type: string
        price:
          type: number
        in_stock:
          type: boolean

    BookUpdate:
      type: object
      properties:
        title:
          type: string
        author_id:
          type: string
        publisher_id:
          type: string
        genre_id:
          type: string
        publication_year:
          type: integer
        pages:
          type: integer
        language:
          type: string
        description:
          type: string
        price:
          type: number
        in_stock:
          type: boolean

    PaginatedBooks:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Book'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Author:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        birth_year:
          type: integer
        death_year:
          type: integer
        nationality:
          type: string
        biography:
          type: string
        created_at:
          type: string
          format: date-time

    AuthorCreate:
      type: object
      required: [name, nationality]
      properties:
        name:
          type: string
        birth_year:
          type: integer
        death_year:
          type: integer
        nationality:
          type: string
        biography:
          type: string

    PaginatedAuthors:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Author'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Publisher:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        founded_year:
          type: integer
        headquarters:
          type: string
        website:
          type: string
        created_at:
          type: string
          format: date-time

    PaginatedPublishers:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Publisher'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Genre:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        description:
          type: string

    GenreWithCount:
      allOf:
        - $ref: '#/components/schemas/Genre'
        - type: object
          properties:
            book_count:
              type: integer

    Review:
      type: object
      properties:
        id:
          type: string
        book_isbn:
          type: string
        reviewer_name:
          type: string
        rating:
          type: integer
          minimum: 1
          maximum: 5
        title:
          type: string
        content:
          type: string
        verified_purchase:
          type: boolean
        helpful_votes:
          type: integer
        created_at:
          type: string
          format: date-time

    ReviewCreate:
      type: object
      required: [reviewer_name, rating, content]
      properties:
        reviewer_name:
          type: string
        rating:
          type: integer
          minimum: 1
          maximum: 5
        title:
          type: string
        content:
          type: string
        verified_purchase:
          type: boolean

    PaginatedReviews:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Review'
        pagination:
          $ref: '#/components/schemas/Pagination'

    SearchResults:
      type: object
      properties:
        query:
          type: string
        results:
          type: object
          properties:
            books:
              type: object
              properties:
                count:
                  type: integer
                items:
                  type: array
                  items:
                    $ref: '#/components/schemas/Book'
            authors:
              type: object
              properties:
                count:
                  type: integer
                items:
                  type: array
                  items:
                    $ref: '#/components/schemas/Author'
`;

export async function GET() {
  return new NextResponse(openApiSpec, {
    headers: {
      'Content-Type': 'text/yaml',
    },
  });
}
