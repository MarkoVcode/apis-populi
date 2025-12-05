import { NextResponse } from 'next/server';

const openApiSpec = `openapi: 3.0.3
info:
  title: Warehouse API
  description: Inventory management API with polymorphic items (electronics, furniture, clothing, food, tools). Webhook-based async orders.
  version: 1.0.0
  contact:
    name: APIs Populi
    url: https://github.com/MarkoVcode/apis-populi
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: /api/warehouse
    description: Warehouse API

security:
  - BasicAuth: []
  - CustomHeader: []

paths:
  /items:
    get:
      summary: List items
      operationId: listItems
      tags: [Items]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: type
          in: query
          description: Item type
          schema:
            type: string
            enum: [electronics, furniture, clothing, food, tools]
        - name: q
          in: query
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
      responses:
        '200':
          description: List of items
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedItems'
    post:
      summary: Create item
      operationId: createItem
      tags: [Items]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ItemCreate'
      responses:
        '201':
          description: Item created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Item'
        '400':
          $ref: '#/components/responses/BadRequest'

  /items/types:
    get:
      summary: Get item types with schemas
      operationId: getItemTypes
      tags: [Items]
      responses:
        '200':
          description: Available item types with their schemas
          content:
            application/json:
              schema:
                type: object
                properties:
                  types:
                    type: array
                    items:
                      type: object
                      properties:
                        type:
                          type: string
                        fields:
                          type: array
                          items:
                            type: object

  /items/{sku}:
    get:
      summary: Get item by SKU
      operationId: getItem
      tags: [Items]
      parameters:
        - name: sku
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Item details (polymorphic based on type)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Item'
        '404':
          $ref: '#/components/responses/NotFound'
    put:
      summary: Update item
      operationId: updateItem
      tags: [Items]
      parameters:
        - name: sku
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ItemUpdate'
      responses:
        '200':
          description: Item updated
    delete:
      summary: Delete item
      operationId: deleteItem
      tags: [Items]
      parameters:
        - name: sku
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Item deleted

  /locations:
    get:
      summary: List warehouse locations
      operationId: listLocations
      tags: [Locations]
      responses:
        '200':
          description: List of locations
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Location'

  /locations/{id}:
    get:
      summary: Get location with inventory
      operationId: getLocation
      tags: [Locations]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Location details with inventory
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Location'

  /inventory:
    get:
      summary: Get stock levels
      operationId: listInventory
      tags: [Inventory]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: location_id
          in: query
          schema:
            type: string
        - name: item_sku
          in: query
          schema:
            type: string
        - name: low_stock
          in: query
          description: Only show items below minimum stock
          schema:
            type: boolean
        - name: expand
          in: query
          description: Expand item or location details
          schema:
            type: string
      responses:
        '200':
          description: Inventory entries
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedInventory'

  /inventory/transfer:
    post:
      summary: Transfer between locations
      operationId: transferInventory
      tags: [Inventory]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TransferRequest'
      responses:
        '200':
          description: Transfer completed
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  transfer:
                    type: object
        '400':
          $ref: '#/components/responses/BadRequest'

  /orders:
    get:
      summary: List orders
      operationId: listOrders
      tags: [Orders]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, processing, fulfilled, shipped, delivered, cancelled]
      responses:
        '200':
          description: List of orders
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedOrders'
    post:
      summary: Create order (async with webhook)
      operationId: createOrder
      tags: [Orders]
      description: Creates an order asynchronously. Optionally provide a webhook_url to receive notification when fulfilled.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderCreate'
      responses:
        '202':
          description: Order request accepted
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  job_id:
                    type: string
                  webhook_configured:
                    type: boolean
                  note:
                    type: string

  /orders/{id}:
    get:
      summary: Get order details
      operationId: getOrder
      tags: [Orders]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
        - name: expand
          in: query
          description: Expand items or shipment details
          schema:
            type: string
      responses:
        '200':
          description: Order details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '404':
          $ref: '#/components/responses/NotFound'
    patch:
      summary: Update order status
      operationId: updateOrderStatus
      tags: [Orders]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [status]
              properties:
                status:
                  type: string
                  enum: [pending, processing, fulfilled, shipped, delivered, cancelled]
      responses:
        '200':
          description: Order updated

  /shipments:
    post:
      summary: Create shipment
      operationId: createShipment
      tags: [Shipments]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ShipmentCreate'
      responses:
        '201':
          description: Shipment created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Shipment'
    get:
      summary: List shipments
      operationId: listShipments
      tags: [Shipments]
      parameters:
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/limit'
        - name: status
          in: query
          schema:
            type: string
        - name: carrier
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of shipments
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedShipments'

  /shipments/{id}/tracking:
    get:
      summary: Get shipment tracking
      operationId: getShipmentTracking
      tags: [Shipments]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Tracking information
          content:
            application/json:
              schema:
                type: object
                properties:
                  shipment_id:
                    type: string
                  tracking_number:
                    type: string
                  carrier:
                    type: string
                  status:
                    type: string
                  tracking_history:
                    type: array
                    items:
                      type: object
                      properties:
                        timestamp:
                          type: string
                        status:
                          type: string
                        location:
                          type: string

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
    BasicAuth:
      type: http
      scheme: basic
    CustomHeader:
      type: apiKey
      in: header
      name: X-Warehouse-Token

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
    BadRequest:
      description: Bad request
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

    Item:
      type: object
      description: Polymorphic item - additional fields based on type
      properties:
        sku:
          type: string
        name:
          type: string
        description:
          type: string
        type:
          type: string
          enum: [electronics, furniture, clothing, food, tools]
        price:
          type: number
        created_at:
          type: string
      additionalProperties: true

    ItemCreate:
      type: object
      required: [name, type, price]
      properties:
        sku:
          type: string
        name:
          type: string
        description:
          type: string
        type:
          type: string
          enum: [electronics, furniture, clothing, food, tools]
        price:
          type: number
      additionalProperties: true

    ItemUpdate:
      type: object
      properties:
        name:
          type: string
        description:
          type: string
        price:
          type: number
      additionalProperties: true

    PaginatedItems:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Item'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Location:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        type:
          type: string
        address:
          type: object
        capacity:
          type: integer
        manager:
          type: string

    InventoryEntry:
      type: object
      properties:
        id:
          type: string
        item_sku:
          type: string
        location_id:
          type: string
        quantity:
          type: integer
        min_stock_level:
          type: integer
        max_stock_level:
          type: integer
        last_restocked:
          type: string
        last_counted:
          type: string

    PaginatedInventory:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/InventoryEntry'
        pagination:
          $ref: '#/components/schemas/Pagination'

    TransferRequest:
      type: object
      required: [item_sku, from_location_id, to_location_id, quantity]
      properties:
        item_sku:
          type: string
        from_location_id:
          type: string
        to_location_id:
          type: string
        quantity:
          type: integer

    Order:
      type: object
      properties:
        id:
          type: string
        order_number:
          type: string
        status:
          type: string
        items:
          type: array
          items:
            type: object
            properties:
              sku:
                type: string
              quantity:
                type: integer
              unit_price:
                type: number
        total_amount:
          type: number
        customer:
          type: object
        webhook_url:
          type: string
        created_at:
          type: string
        fulfilled_at:
          type: string

    OrderCreate:
      type: object
      required: [items, customer]
      properties:
        items:
          type: array
          items:
            type: object
            required: [sku, quantity]
            properties:
              sku:
                type: string
              quantity:
                type: integer
        customer:
          type: object
          required: [name]
          properties:
            name:
              type: string
            email:
              type: string
            address:
              type: object
        webhook_url:
          type: string
          description: URL to receive order fulfillment notification

    PaginatedOrders:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Order'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Shipment:
      type: object
      properties:
        id:
          type: string
        order_id:
          type: string
        tracking_number:
          type: string
        carrier:
          type: string
        status:
          type: string
        estimated_delivery:
          type: string
        actual_delivery:
          type: string
        tracking_history:
          type: array
          items:
            type: object
        created_at:
          type: string

    ShipmentCreate:
      type: object
      required: [order_id, carrier]
      properties:
        order_id:
          type: string
        carrier:
          type: string
        estimated_delivery:
          type: string

    PaginatedShipments:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Shipment'
        pagination:
          $ref: '#/components/schemas/Pagination'

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
