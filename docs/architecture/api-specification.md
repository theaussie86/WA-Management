# API Specification

Based on the REST API approach selected in the tech stack, I'll create an OpenAPI 3.0 specification for the LinkedIn content automation system:

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: WA Management LinkedIn Content Automation API
  version: 1.0.0
  description: RESTful API for AI-powered LinkedIn content pipeline management with external n8n database integration
servers:
  - url: https://your-app.vercel.app/api
    description: Production API server
paths:
  /campaigns:
    get:
      summary: List user campaigns
      responses:
        "200":
          description: List of campaigns
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Campaign"
    post:
      summary: Create new campaign
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateCampaignRequest"
      responses:
        "201":
          description: Campaign created successfully

  /campaigns/{campaignId}/content:
    get:
      summary: Get content items for campaign
      parameters:
        - name: campaignId
          in: path
          required: true
          schema:
            type: string
        - name: stage
          in: query
          schema:
            type: string
            enum: [research, ideation, drafting, creative, queued, published]
      responses:
        "200":
          description: Content items for campaign

  /content/{contentId}/approve:
    post:
      summary: Approve content item
      parameters:
        - name: contentId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                version_id:
                  type: string
                editor_notes:
                  type: string
      responses:
        "200":
          description: Content approved successfully

  /webhooks/n8n/content-generated:
    post:
      summary: Webhook for n8n workflow completion
      security:
        - WebhookAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                workflow_execution_id:
                  type: string
                content_item_id:
                  type: string
                generated_content:
                  type: object
                ai_metadata:
                  type: object
      responses:
        "200":
          description: Webhook processed successfully

  /linkedin/publish:
    post:
      summary: Publish content to LinkedIn
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                content_item_id:
                  type: string
                scheduled_time:
                  type: string
                  format: date-time
      responses:
        "200":
          description: Content published successfully

  /health:
    get:
      summary: Health check endpoint for monitoring and testing
      description: Returns system health status including database connectivity and response times
      responses:
        "200":
          description: System is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [healthy, unhealthy]
                  timestamp:
                    type: string
                    format: date-time
                  version:
                    type: string
                  environment:
                    type: string
                  services:
                    type: object
                    properties:
                      database:
                        type: string
                        enum: [healthy, unhealthy]
                      api:
                        type: string
                        enum: [healthy, unhealthy]
                  metrics:
                    type: object
                    properties:
                      responseTime:
                        type: string
                      uptime:
                        type: number
        "503":
          description: System is unhealthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [unhealthy]
                  timestamp:
                    type: string
                    format: date-time
                  error:
                    type: string
                  services:
                    type: object
                    properties:
                      database:
                        type: string
                        enum: [unhealthy]
                      api:
                        type: string
                        enum: [unhealthy]

  /test/setup:
    post:
      summary: Setup test environment (Development/Testing only)
      description: Initializes test database and creates test data for integration testing
      security:
        - BearerAuth: []
      responses:
        "200":
          description: Test environment setup successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
                  testData:
                    type: object
                    properties:
                      campaigns:
                        type: integer
                      contentItems:
                        type: integer
                      users:
                        type: integer
        "401":
          description: Unauthorized - requires authentication
        "403":
          description: Forbidden - not available in production

  /test/cleanup:
    post:
      summary: Cleanup test environment (Development/Testing only)
      description: Removes all test data and resets test database
      security:
        - BearerAuth: []
      responses:
        "200":
          description: Test environment cleaned up successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
                  cleanedItems:
                    type: object
                    properties:
                      campaigns:
                        type: integer
                      contentItems:
                        type: integer
                      users:
                        type: integer
        "401":
          description: Unauthorized - requires authentication
        "403":
          description: Forbidden - not available in production

  /test/mock-ai:
    post:
      summary: Configure AI service mocks (Development/Testing only)
      description: Configures mock AI service responses for testing
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                errorRate:
                  type: number
                  minimum: 0
                  maximum: 1
                latency:
                  type: object
                  properties:
                    min:
                      type: number
                    max:
                      type: number
                mockResponses:
                  type: boolean
                responseTypes:
                  type: array
                  items:
                    type: string
                    enum: [content_generation, trend_research, image_generation]
      responses:
        "200":
          description: AI service mocks configured successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
                  configuration:
                    type: object
        "401":
          description: Unauthorized - requires authentication
        "403":
          description: Forbidden - not available in production

components:
  schemas:
    Campaign:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        description:
          type: string
        target_audience:
          type: string
        messaging_tone:
          type: string
          enum: [professional, thought_leader, educational, promotional]
        content_themes:
          type: array
          items:
            type: string
        ai_instructions:
          type: string
        status:
          type: string
          enum: [active, paused, archived]

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    WebhookAuth:
      type: apiKey
      in: header
      name: X-Webhook-Secret
```
