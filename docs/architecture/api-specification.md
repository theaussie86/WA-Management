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
