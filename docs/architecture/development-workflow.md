# Development Workflow

## Local Development Setup

### Prerequisites
```bash
# Install Node.js 18+ and npm
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher

# Install Supabase CLI
npm install -g @supabase/cli

# Install Playwright for E2E testing
npx playwright install
```

### Initial Setup
```bash
# Clone repository and install dependencies
git clone <repository-url>
cd wa-management
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase project details

# Initialize Supabase local development
supabase start
supabase db reset

# Generate TypeScript types from database schema
npm run generate-types

# Seed development data
npm run seed-dev-data
```

### Development Commands
```bash
# Start all services (frontend + Supabase local)
npm run dev

# Start frontend only (if using remote Supabase)
npm run dev:frontend

# Start Supabase local services only
npm run dev:supabase

# Run tests
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:api      # API integration tests
npm run test:watch    # Watch mode for development

# Database operations
npm run db:migrate    # Run new migrations
npm run db:reset      # Reset database to clean state
npm run db:seed       # Seed development data

# Code quality
npm run lint          # ESLint
npm run lint:fix      # Fix linting issues
npm run type-check    # TypeScript type checking
npm run format        # Prettier formatting
```

## Environment Configuration

### Required Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend (.env.local)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# n8n Integration
N8N_WEBHOOK_SECRET=your-webhook-secret
N8N_RESEARCH_WEBHOOK_URL=https://your-n8n-instance.com/webhook/research
N8N_IDEATION_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ideation
N8N_DRAFTING_WEBHOOK_URL=https://your-n8n-instance.com/webhook/drafting
N8N_ASSETS_WEBHOOK_URL=https://your-n8n-instance.com/webhook/assets
N8N_PUBLISHING_WEBHOOK_URL=https://your-n8n-instance.com/webhook/publish

# LinkedIn API
LINKEDIN_CLIENT_ID=your-linkedin-app-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-app-client-secret

# AI Services (for n8n workflows)
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# External APIs (for research workflows)
GOOGLE_NEWS_API_KEY=your-google-news-api-key
REDDIT_API_KEY=your-reddit-api-key
```
