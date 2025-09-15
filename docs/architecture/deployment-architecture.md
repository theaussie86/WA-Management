# Deployment Architecture

## Zero-Downtime Deployment Strategy

**Critical Requirement:** This brownfield project must maintain 100% uptime for existing authentication and core functionality during all deployments.

### Database Migration Strategy (Backward Compatible)

**Phase 1: Additive Changes Only**
```sql
-- ✅ Safe operations that don't affect existing functionality
CREATE TABLE campaigns (...);                    -- New tables
CREATE TABLE content_items (...);               -- New tables
ALTER TABLE auth.users ADD COLUMN preferences JSONB DEFAULT '{}';  -- New columns with defaults
CREATE INDEX CONCURRENTLY idx_campaigns_user_status ON campaigns(user_id, status);  -- New indexes
```

**Phase 2: Non-Breaking Modifications**
```sql
-- ✅ Constraints that don't affect existing data
ALTER TABLE campaigns ADD CONSTRAINT campaigns_name_user_unique UNIQUE (name, user_id);
```

**Prohibited Operations (Breaking Changes)**
```sql
-- ❌ These operations are forbidden until major version releases
-- ALTER TABLE auth.users DROP COLUMN old_column;           -- Drop columns
-- ALTER TABLE auth.users RENAME COLUMN email TO email_address;  -- Rename columns
-- ALTER TABLE auth.users ALTER COLUMN created_at TYPE TIMESTAMP;  -- Change types
```

### Feature Flag Strategy

All new functionality is deployed behind feature flags, allowing instant rollback without code deployment:

```typescript
// lib/feature-flags.ts
export const FeatureFlags = {
  CONTENT_AUTOMATION: process.env.FEATURE_CONTENT_AUTOMATION === 'true',
  CAMPAIGN_MANAGEMENT: process.env.FEATURE_CAMPAIGN_MANAGEMENT === 'true',
  LINKEDIN_INTEGRATION: process.env.FEATURE_LINKEDIN_INTEGRATION === 'true',
} as const;

// Usage in components - existing functionality always available
export default function Dashboard() {
  return (
    <div>
      <ExistingDashboard />  {/* Always available */}
      {FeatureFlags.CONTENT_AUTOMATION && <ContentAutomationPanel />}  {/* Behind flag */}
    </div>
  );
}
```

### Deployment Phases

**Phase 1: Database Migration (0 minutes downtime)**
- Apply backward-compatible migrations
- Verify existing functionality unchanged

**Phase 2: Code Deployment (0 minutes downtime)**
- Deploy new code with all feature flags disabled
- Existing users see no changes

**Phase 3: Health Verification (2-5 minutes)**
- Automated tests verify existing auth system works
- Manual verification of critical user paths

**Phase 4: Gradual Feature Rollout (15-30 minutes)**
- Enable features one by one with monitoring
- Campaign Management → Content Automation → LinkedIn Integration

### Emergency Rollback Procedures

**Instant Rollback (< 2 minutes):**
```bash
# Disable all new features immediately - no code deployment needed
vercel env add FEATURE_CONTENT_AUTOMATION false --scope production
vercel env add FEATURE_CAMPAIGN_MANAGEMENT false --scope production
vercel env add FEATURE_LINKEDIN_INTEGRATION false --scope production
```

**Full Rollback (if existing functionality compromised):**
- Vercel instant rollback to previous deployment
- Database rollback only if absolutely necessary (prefer feature flags)

**Frontend Deployment:**
- **Platform:** Vercel (existing foundation)
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (Next.js default)
- **CDN/Edge:** Vercel Edge Network with automatic optimization
- **Rollback:** Instant via Vercel dashboard or CLI

**Backend Deployment:**
- **Platform:** Vercel Serverless Functions (integrated with frontend)
- **Build Command:** Same as frontend (API routes included)
- **Deployment Method:** Atomic deployments with feature flag control
- **Rollback:** Feature flags for immediate rollback, Vercel rollback for critical issues

**Database Deployment:**
- **Platform:** Supabase Cloud (managed PostgreSQL)
- **Migration Strategy:** Backward-compatible migrations only
- **Backup Strategy:** Daily automated backups with 30-day retention
- **Rollback:** Feature flags preferred, database rollback as last resort

## Zero-Downtime CI/CD Pipeline

```yaml
# .github/workflows/zero-downtime-deploy.yaml
name: Zero-Downtime Deployment Pipeline
on:
  push:
    branches: [main]

jobs:
  # Standard testing and validation
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm run test

      - name: Regression tests (existing functionality)
        run: npm run test:regression

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

  # Phase 1: Backward-compatible database migrations
  database-migration:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1

      - name: Run additive migrations only
        run: |
          # Validate migrations are backward-compatible
          npm run validate-migrations
          # Apply only safe, additive changes
          supabase db push --include-additive-only
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}

      - name: Verify existing functionality post-migration
        run: npm run test:smoke:auth

  # Phase 2: Deploy with feature flags disabled
  deploy-with-flags-off:
    runs-on: ubuntu-latest
    needs: database-migration
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (features disabled)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
        env:
          # All new features disabled initially
          FEATURE_CONTENT_AUTOMATION: false
          FEATURE_CAMPAIGN_MANAGEMENT: false
          FEATURE_LINKEDIN_INTEGRATION: false

  # Phase 3: Production health verification
  production-health-check:
    runs-on: ubuntu-latest
    needs: deploy-with-flags-off
    steps:
      - name: Verify existing authentication system
        run: |
          # Test auth endpoints still work
          curl -f https://wa-management.vercel.app/api/auth/user || exit 1

      - name: Verify existing UI loads
        run: |
          # Test existing dashboard loads
          curl -f https://wa-management.vercel.app/dashboard || exit 1

      - name: Run production smoke tests
        run: npm run test:smoke:production

  # Phase 4: Gradual feature rollout
  feature-rollout:
    runs-on: ubuntu-latest
    needs: production-health-check
    steps:
      - name: Enable Campaign Management (lowest risk)
        run: |
          vercel env add FEATURE_CAMPAIGN_MANAGEMENT true --scope production
          sleep 180  # Wait 3 minutes and monitor

      - name: Verify Campaign Management health
        run: npm run test:smoke:campaigns

      - name: Enable Content Automation
        run: |
          vercel env add FEATURE_CONTENT_AUTOMATION true --scope production
          sleep 300  # Wait 5 minutes and monitor

      - name: Verify Content Automation health
        run: npm run test:smoke:content

      - name: Enable LinkedIn Integration (highest risk)
        run: |
          vercel env add FEATURE_LINKEDIN_INTEGRATION true --scope production
          sleep 300  # Wait 5 minutes and monitor

      - name: Verify LinkedIn Integration health
        run: npm run test:smoke:linkedin

      - name: Full system health check
        run: npm run test:smoke:full-system

  # Emergency rollback job (manual trigger)
  emergency-rollback:
    runs-on: ubuntu-latest
    if: github.event_name == 'workflow_dispatch'
    steps:
      - name: Disable all new features immediately
        run: |
          vercel env add FEATURE_CONTENT_AUTOMATION false --scope production
          vercel env add FEATURE_CAMPAIGN_MANAGEMENT false --scope production
          vercel env add FEATURE_LINKEDIN_INTEGRATION false --scope production

      - name: Verify rollback successful
        run: npm run test:smoke:auth
```

## Feature Flag Management

```typescript
// scripts/feature-flag-manager.ts
export class FeatureFlagManager {
  async enableFeature(feature: string) {
    await this.setFlag(feature, true);
    await this.waitAndMonitor(180); // 3 minutes
    await this.verifyHealth();
  }

  async emergencyRollback() {
    const flags = ['FEATURE_CONTENT_AUTOMATION', 'FEATURE_CAMPAIGN_MANAGEMENT', 'FEATURE_LINKEDIN_INTEGRATION'];
    await Promise.all(flags.map(flag => this.setFlag(flag, false)));
    await this.notifyTeam('Emergency rollback executed');
  }

  private async verifyHealth() {
    const healthChecks = [
      this.checkAuthentication(),
      this.checkDatabaseConnectivity(),
      this.checkExistingRoutes()
    ];

    const results = await Promise.allSettled(healthChecks);
    const failures = results.filter(r => r.status === 'rejected');

    if (failures.length > 0) {
      await this.emergencyRollback();
      throw new Error('Health check failed - automatic rollback triggered');
    }
  }
}
```

## Environments
| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:3000/api | Local development |
| Staging | https://wa-management-staging.vercel.app | https://wa-management-staging.vercel.app/api | Pre-production testing |
| Production | https://wa-management.vercel.app | https://wa-management.vercel.app/api | Live environment |
