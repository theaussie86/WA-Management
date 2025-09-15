# Core Workflows

The following sequence diagrams illustrate key system workflows that clarify architecture decisions and complex interactions:

## Daily Content Review Workflow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard as Real-time Dashboard
    participant ContentAPI as Content Pipeline Service
    participant DB as Supabase Database
    participant n8n as n8n Workflows (External)

    User->>Dashboard: Open daily review
    Dashboard->>ContentAPI: GET /campaigns/{id}/content?stage=pending
    ContentAPI->>DB: Query content items with real-time subscription
    DB-->>Dashboard: Return pending content + establish subscription

    User->>Dashboard: Approve trending topic
    Dashboard->>ContentAPI: POST /content/{id}/approve
    ContentAPI->>DB: Update content status to approved
    n8n->>DB: Query approved content for ideation
    n8n->>AI Services: Generate content ideas
    AI Services-->>n8n: Return generated ideas
    n8n->>DB: Create new content version directly
    DB-->>Dashboard: Real-time update (new ideas available)

    Dashboard->>User: Notification: New ideas ready for review
```

## Campaign Context Switching Workflow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant CampaignAPI as Campaign Management Service
    participant ContentAPI as Content Pipeline Service
    participant LocalState as Zustand Store

    User->>Dashboard: Select new campaign from dropdown
    Dashboard->>LocalState: Check for unsaved changes

    alt Has unsaved changes
        LocalState-->>Dashboard: Show save confirmation dialog
        User->>Dashboard: Confirm save changes
        Dashboard->>ContentAPI: POST /content/{id}/save-draft
    end

    Dashboard->>CampaignAPI: GET /campaigns/{newId}
    CampaignAPI-->>Dashboard: Return campaign details
    Dashboard->>LocalState: Update campaign context
    Dashboard->>ContentAPI: GET /campaigns/{newId}/content
    ContentAPI-->>Dashboard: Return filtered content for new campaign
    Dashboard->>User: Update all views with new campaign context
```

## AI Content Generation Error Recovery Workflow

```mermaid
sequenceDiagram
    participant n8n
    participant WebhookLayer as AI Workflow Integration
    participant ContentAPI as Content Pipeline Service
    participant DB as Supabase Database
    participant Dashboard
    participant User

    n8n->>AI Services: Generate content request
    AI Services-->>n8n: Rate limit error (429)

    n8n->>DB: Update content status to 'processing_failed'
    DB-->>Dashboard: Real-time update
    Dashboard->>User: Show "AI service temporarily unavailable"

    note over n8n: Wait exponential backoff (30 seconds)

    n8n->>AI Services: Retry content generation
    AI Services-->>n8n: Success response
    n8n->>DB: Create new content version directly
    DB-->>Dashboard: Real-time update
    Dashboard->>User: Show "New content ready for review"
```
