# Error Handling Strategy

## Error Flow
```mermaid
sequenceDiagram
    participant Frontend
    participant APIRoute as API Route
    participant Database as Supabase
    participant ErrorHandler as Error Handler

    Frontend->>APIRoute: Request with invalid data
    APIRoute->>ErrorHandler: Validation error
    ErrorHandler->>ErrorHandler: Log error details
    ErrorHandler->>APIRoute: Standardized error response
    APIRoute-->>Frontend: HTTP 400 + error format

    Frontend->>APIRoute: Valid request
    APIRoute->>Database: Database operation
    Database-->>APIRoute: Database error
    APIRoute->>ErrorHandler: Database error
    ErrorHandler->>ErrorHandler: Log + classify error
    ErrorHandler->>APIRoute: User-friendly error
    APIRoute-->>Frontend: HTTP 500 + error format

    Frontend->>Frontend: Display error to user
```

## Error Response Format
```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}
```
