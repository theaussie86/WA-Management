# Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** Always define shared types in `types/` directory and import consistently across frontend and backend
- **API Response Format:** All API endpoints must return standardized response format with `{ data?, error?, message? }` structure
- **Environment Variables:** Access only through validated config objects in `lib/config/`, never `process.env` directly in components
- **Error Handling:** All API routes must use standard error handler middleware with proper HTTP status codes
- **State Updates:** Never mutate Zustand state directly - use provided actions with proper immutability
- **Database Operations:** Always use repository pattern through `lib/database/repositories/`, never direct Supabase calls in components
- **Real-time Subscriptions:** Properly cleanup Supabase subscriptions in useEffect cleanup to prevent memory leaks
- **Content Versioning:** All content modifications must create new version records - never update existing versions
- **Campaign Context:** All content operations must validate campaign ownership through RLS policies

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `ContentCard.tsx` |
| Hooks | camelCase with 'use' | - | `useCampaignContext.ts` |
| API Routes | - | kebab-case | `/api/content-items` |
| Database Tables | - | snake_case | `content_items` |
| Type Interfaces | PascalCase | PascalCase | `ContentItem` |
| Service Functions | camelCase | camelCase | `approveContent()` |
