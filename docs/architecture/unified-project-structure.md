# Unified Project Structure

```plaintext
wa-management/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml             # Test and lint on PR
│       ├── deploy-staging.yaml  # Auto-deploy to staging
│       └── deploy-prod.yaml     # Deploy to production
├── app/                        # Next.js App Router
│   ├── (protected)/            # Protected route group
│   │   ├── dashboard/          # Main dashboard
│   │   ├── campaigns/          # Campaign management
│   │   ├── content/            # Content pipeline
│   │   └── settings/           # User preferences
│   ├── api/                    # Backend API routes
│   │   ├── campaigns/          # Campaign CRUD
│   │   ├── content/            # Content operations
│   │   ├── webhooks/           # n8n integration
│   │   └── linkedin/           # LinkedIn API proxy
│   ├── auth/                   # Authentication pages
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                 # React components
│   ├── content/                # Content-specific components
│   │   ├── content-card.tsx    # Content preview cards
│   │   ├── pipeline-progress.tsx # Pipeline visualization
│   │   ├── approval-buttons.tsx # Action buttons
│   │   └── version-history.tsx  # Version management
│   ├── campaigns/              # Campaign components
│   │   ├── campaign-selector.tsx # Context switcher
│   │   ├── campaign-form.tsx    # Create/edit forms
│   │   └── performance-chart.tsx # Analytics charts
│   ├── layout/                 # Layout components
│   │   ├── sidebar.tsx         # Main navigation
│   │   ├── header.tsx          # App header
│   │   └── mobile-nav.tsx      # Mobile navigation
│   └── ui/                     # shadcn/ui components
├── lib/                        # Shared utilities
│   ├── database/               # Database layer
│   │   ├── repositories/       # Data access objects
│   │   └── migrations/         # SQL migration files
│   ├── services/               # Business logic
│   │   ├── content-service.ts  # Content operations
│   │   ├── campaign-service.ts # Campaign operations
│   │   └── linkedin-service.ts # LinkedIn integration
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-campaign-context.ts
│   │   ├── use-content-pipeline.ts
│   │   └── use-real-time.ts
│   ├── middleware/             # API middleware
│   │   ├── auth.ts            # Authentication
│   │   ├── rate-limit.ts      # Rate limiting
│   │   └── validation.ts      # Request validation
│   ├── utils/                  # Helper functions
│   │   ├── api.ts             # API client
│   │   ├── date.ts            # Date utilities
│   │   └── content.ts         # Content processing
│   └── supabase.ts            # Supabase client
├── types/                      # TypeScript definitions
│   ├── database.ts             # Generated Supabase types
│   ├── content.ts              # Content-related types
│   ├── campaigns.ts            # Campaign types
│   └── api.ts                  # API response types
├── n8n-workflows/              # External automation
│   ├── content-research.json   # Trend research workflow
│   ├── idea-generation.json    # Content ideation workflow
│   ├── draft-creation.json     # Draft generation workflow
│   ├── asset-creation.json     # Creative asset workflow
│   └── linkedin-publishing.json # Publishing workflow
├── docs/                       # Documentation
│   ├── prd.md                  # Product requirements
│   ├── front-end-spec.md       # UI/UX specification
│   ├── architecture.md         # This document
│   └── api/                    # API documentation
│       └── openapi.yaml        # OpenAPI specification
├── scripts/                    # Build and deployment scripts
│   ├── generate-types.ts       # Generate Supabase types
│   ├── migrate-database.ts     # Run database migrations
│   └── seed-dev-data.ts        # Development data seeding
├── tests/                      # Test files
│   ├── __mocks__/              # Test mocks
│   ├── components/             # Component tests
│   ├── api/                    # API route tests
│   ├── e2e/                    # End-to-end tests
│   └── utils/                  # Test utilities
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   │   └── logos/              # Brand logos
│   ├── icons/                  # Icon files
│   └── favicon.ico             # Site favicon
├── .env.example                # Environment template
├── .env.local                  # Local development env
├── .gitignore                  # Git ignore rules
├── components.json             # shadcn/ui config
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── playwright.config.ts        # E2E test configuration
├── supabase/                   # Supabase project files
│   ├── migrations/             # Database migrations
│   ├── seed.sql                # Initial data
│   └── config.toml             # Supabase config
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── README.md                   # Project documentation
```
