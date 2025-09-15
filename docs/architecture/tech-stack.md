# Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.6+ | Type-safe client and server code | Existing codebase standard, essential for complex AI integration workflows |
| Frontend Framework | Next.js | 15.0.3 | React metaframework with App Router | Current project foundation, optimal for content-heavy interfaces with SSR/SSG |
| UI Component Library | shadcn/ui | latest | Accessible, customizable component system | Established in current project, provides LinkedIn-optimized components |
| State Management | React Query + Zustand | 5.59.0 + 4.5.0 | Server state and client state management | React Query for Supabase integration, Zustand for campaign context persistence |
| Backend Language | TypeScript | 5.6+ | Unified language across fullstack | Consistency with frontend, shared types for content pipeline |
| Backend Framework | Next.js API Routes | 15.0.3 | Serverless API endpoints | Integrated with existing app, optimized for webhook handling |
| API Style | REST + Real-time | HTTP + WebSocket | RESTful webhooks with live subscriptions | Matches Supabase capabilities, optimal for approval workflows |
| Database | Supabase PostgreSQL | latest | Managed PostgreSQL with real-time features | Current project foundation, perfect for content pipeline state management |
| Cache | Supabase Edge Cache | built-in | Query result caching | Integrated caching solution, optimizes content retrieval performance |
| File Storage | Supabase Storage | latest | AI-generated asset storage | Seamless integration with auth, optimized for image and media assets |
| Authentication | Supabase Auth | latest | User authentication and RLS | Current project foundation, provides secure content access control |
| Frontend Testing | Jest + React Testing Library | 29.0+ + 16.0+ | Unit and integration testing | Industry standard for React applications, essential for approval workflow testing |
| Backend Testing | Jest + Supertest | 29.0+ + 7.0+ | API endpoint testing | Unified testing framework, critical for webhook reliability |
| E2E Testing | Playwright | 1.48+ | End-to-end workflow testing | Modern E2E solution, essential for content pipeline validation |
| Build Tool | Next.js | 15.0.3 | Integrated build system | Built-in optimization, no additional configuration needed |
| Bundler | Turbopack | built-in | Fast development bundling | Next.js 15 default, significantly faster than Webpack |
| IaC Tool | Supabase CLI | 1.200+ | Database schema management | Version-controlled migrations, essential for content data model evolution |
| CI/CD | GitHub Actions | latest | Automated deployment pipeline | Current project standard, integrates with Vercel deployment |
| Monitoring | Supabase Dashboard + Vercel Analytics | built-in | Application and database monitoring | Integrated solutions, sufficient for initial launch and scaling |
| Logging | Supabase Logs + Vercel Function Logs | built-in | Centralized logging | Built-in solutions cover webhook debugging and error tracking |
| CSS Framework | Tailwind CSS | 3.4+ | Utility-first styling system | Current project foundation, optimized for component-based architecture |
