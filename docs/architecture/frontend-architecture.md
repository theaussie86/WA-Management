# Frontend Architecture

## Component Architecture

### Component Organization
```
src/
├── app/                          # Next.js App Router pages
│   ├── (protected)/             # Protected route group
│   │   ├── dashboard/           # Main dashboard page
│   │   ├── campaigns/           # Campaign management pages
│   │   │   ├── page.tsx         # Campaign list
│   │   │   ├── [id]/            # Individual campaign
│   │   │   └── new/             # Create campaign
│   │   ├── content/             # Content pipeline pages
│   │   │   ├── review/          # Content review workflow
│   │   │   ├── editor/          # Content editing interface
│   │   │   └── queue/           # Publishing queue
│   │   └── layout.tsx           # Protected layout with auth
│   ├── api/                     # API routes
│   └── layout.tsx               # Root layout
├── components/
│   ├── content/                 # Content-specific components
│   │   ├── content-card.tsx     # Content preview and actions
│   │   ├── pipeline-progress.tsx # Pipeline stage visualization
│   │   ├── approval-buttons.tsx # Approve/reject/edit actions
│   │   └── version-history.tsx  # Content version management
│   ├── campaigns/               # Campaign management components
│   │   ├── campaign-selector.tsx # Context switching dropdown
│   │   ├── campaign-form.tsx     # Create/edit campaign form
│   │   └── performance-metrics.tsx # Campaign analytics
│   ├── layout/                  # Layout components
│   │   ├── sidebar.tsx          # Main navigation
│   │   ├── header.tsx           # App header with campaign context
│   │   └── mobile-nav.tsx       # Mobile navigation
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── supabase/                # Database operations
│   │   ├── client.ts            # Supabase client setup
│   │   ├── campaigns.ts         # Campaign CRUD operations
│   │   ├── content.ts           # Content CRUD operations
│   │   └── real-time.ts         # Real-time subscription helpers
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-campaign-context.ts # Campaign state management
│   │   ├── use-content-pipeline.ts # Content pipeline state
│   │   └── use-real-time-content.ts # Real-time content updates
│   └── utils/                   # Utility functions
└── types/                       # TypeScript type definitions
    ├── database.ts              # Generated Supabase types
    ├── content.ts               # Content-specific types
    └── campaigns.ts             # Campaign-specific types
```

## State Management Architecture

### State Structure
```typescript
// Campaign context state (Zustand)
interface CampaignState {
  currentCampaign: Campaign | null
  campaigns: Campaign[]
  isLoading: boolean
  error: string | null

  // Actions
  setCampaign: (campaign: Campaign) => void
  loadCampaigns: () => Promise<void>
  createCampaign: (campaign: CreateCampaignRequest) => Promise<Campaign>
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>
}

// Content pipeline state (React Query + local state)
interface ContentPipelineState {
  contentByStage: Record<ContentStage, ContentItem[]>
  selectedItems: string[]
  batchOperations: {
    isProcessing: boolean
    operation: 'approve' | 'reject' | null
  }
}
```

### State Management Patterns
- **Server State**: React Query for all API calls and caching
- **Global Client State**: Zustand for campaign context and user preferences
- **Local Component State**: useState for form inputs and UI interactions
- **Real-time State**: Supabase subscriptions with React Query invalidation

## Routing Architecture

### Route Organization
```
/dashboard                        # Main content pipeline overview
/campaigns                        # Campaign management hub
/campaigns/new                    # Create new campaign
/campaigns/[id]                   # Campaign details and settings
/campaigns/[id]/performance       # Campaign analytics
/content                          # Content pipeline hub
/content/review                   # Daily content review workflow
/content/review/[stage]           # Stage-specific content review
/content/editor/[contentId]       # Content editing interface
/content/queue                    # Publishing queue management
/settings                         # User preferences and integrations
/settings/linkedin                # LinkedIn API configuration
/settings/ai                      # AI service preferences
```
