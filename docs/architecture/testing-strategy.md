# Testing Strategy

## Brownfield Testing Approach

**Critical Requirement:** This brownfield project requires comprehensive regression testing to ensure existing functionality remains intact while adding new features.

## Testing Pyramid with Regression Focus
```
              E2E Tests (Playwright)
             /        |        \
    Regression    Integration    New Feature
      Tests         Tests         Tests
     /    |    \   /     |     \  /    |    \
Frontend Unit  Backend Unit  Database  Performance
   Tests        Tests        Tests      Tests
  (Jest +      (Jest +     (Schema    (Baseline
   RTL)       Supertest)  Validation) Protection)
```

## Comprehensive Regression Testing Strategy

### 1. Multi-Level Regression Protection

**Smoke Tests (Critical Path Protection):**
```typescript
// tests/regression/critical/smoke-tests.spec.ts
describe('SMOKE TESTS - Critical Path Protection', () => {
  test('Authentication system works unchanged', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('Dashboard loads without regression', async ({ page }) => {
    await authenticateUser(page);
    await page.goto('/dashboard');

    await expect(page.locator('[data-testid="main-dashboard"]')).toBeVisible();

    // No JavaScript errors introduced by new features
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg));
    await page.waitForLoadState('networkidle');

    const errors = consoleLogs.filter(log => log.type() === 'error');
    expect(errors).toHaveLength(0);
  });

  test('Database connectivity preserved', async ({ request }) => {
    const response = await request.get('/api/health/database');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('healthy');
  });
});
```

**Integration Tests (Feature Interaction Protection):**
```typescript
// tests/regression/integration/existing-features.spec.ts
describe('INTEGRATION REGRESSION - Existing Feature Interaction', () => {
  test('User session management across pages unchanged', async ({ page }) => {
    await authenticateUser(page);

    const existingPages = ['/dashboard', '/settings', '/profile'];

    for (const pagePath of existingPages) {
      await page.goto(pagePath);
      await expect(page.locator('[data-testid="user-authenticated"]')).toBeVisible();
      await expect(page.locator('[data-testid="auth-error"]')).not.toBeVisible();
    }
  });

  test('Existing UI components work with new features present', async ({ page }) => {
    await authenticateUser(page);
    await page.goto('/dashboard');

    // Test theme toggle still works
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await themeToggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('Real-time features continue functioning', async ({ page }) => {
    await authenticateUser(page);
    await page.goto('/dashboard');

    // Verify Supabase real-time subscriptions still work
    await page.evaluate(() => {
      return new Promise((resolve) => {
        window.supabase
          .channel('regression-test')
          .on('postgres_changes', { event: '*', schema: 'public' }, resolve)
          .subscribe();
      });
    });
  });
});
```

### 2. API Regression Protection

```typescript
// tests/regression/api/existing-endpoints.spec.ts
describe('API REGRESSION - Existing Endpoint Protection', () => {
  test('Authentication endpoints remain unchanged', async ({ request }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: { email: 'test@example.com', password: 'password123' }
    });

    expect(loginResponse.status()).toBe(200);
    const data = await loginResponse.json();
    expect(data).toHaveProperty('user');
    expect(data).toHaveProperty('session');
  });

  test('User management endpoints preserved', async ({ request }) => {
    const token = await getAuthToken();

    const profileResponse = await request.get('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(profileResponse.status()).toBe(200);
    const profileData = await profileResponse.json();
    expect(profileData).toHaveProperty('id');
    expect(profileData).toHaveProperty('email');
  });

  test('New endpoints don\'t interfere with existing ones', async ({ request }) => {
    const token = await getAuthToken();

    // Verify existing endpoint works
    const userResponse = await request.get('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(userResponse.status()).toBe(200);

    // Call new endpoint (may be disabled via feature flag)
    const campaignResponse = await request.get('/api/campaigns', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect([200, 404, 503]).toContain(campaignResponse.status());

    // Verify existing endpoint still works after new endpoint call
    const userResponse2 = await request.get('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(userResponse2.status()).toBe(200);
  });
});
```

### 3. Database Schema Regression Protection

```typescript
// tests/regression/database/schema-compatibility.spec.ts
describe('DATABASE REGRESSION - Schema Compatibility', () => {
  test('Existing auth.users table structure preserved', async () => {
    const { data: columns } = await supabase
      .rpc('get_table_columns', { table_name: 'users', schema_name: 'auth' });

    const requiredColumns = ['id', 'email', 'created_at', 'updated_at'];
    requiredColumns.forEach(col => {
      expect(columns.find(c => c.column_name === col)).toBeDefined();
    });
  });

  test('Row Level Security policies still functional', async () => {
    const { data: policies } = await supabase
      .rpc('get_table_policies', { table_name: 'users', schema_name: 'auth' });

    expect(policies.length).toBeGreaterThan(0);

    // Verify RLS still works
    const { data, error } = await supabase.from('users').select('*').limit(1);
    expect(error).toBeNull();
  });

  test('New tables don\'t impact existing query performance', async () => {
    const startTime = Date.now();
    const { data, error } = await supabase.auth.getUser();
    const queryTime = Date.now() - startTime;

    expect(error).toBeNull();
    expect(queryTime).toBeLessThan(1000); // Should complete within 1 second
  });
});
```

### 4. Performance Regression Protection

```typescript
// tests/regression/performance/baseline-protection.spec.ts
describe('PERFORMANCE REGRESSION - Baseline Protection', () => {
  test('Dashboard load time remains under baseline', async ({ page }) => {
    await authenticateUser(page);

    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // 3 second baseline
  });

  test('Authentication flow performance maintained', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/auth/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');

    const authTime = Date.now() - startTime;
    expect(authTime).toBeLessThan(5000); // 5 second baseline
  });

  test('Memory usage doesn\'t increase significantly', async ({ page }) => {
    await authenticateUser(page);
    await page.goto('/dashboard');

    const metrics = await page.evaluate(() => (performance as any).memory);

    if (metrics) {
      expect(metrics.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // 50MB limit
    }
  });
});
```

### 5. Automated Regression Monitoring

```typescript
// scripts/regression-monitor.ts
export class RegressionMonitor {
  async runContinuousMonitoring() {
    const testSuites = [
      { name: 'smoke', critical: true, frequency: '5min', command: 'npm run test:smoke:auth' },
      { name: 'integration', critical: false, frequency: '15min', command: 'npm run test:regression:integration' },
      { name: 'performance', critical: false, frequency: '1hour', command: 'npm run test:regression:performance' }
    ];

    for (const suite of testSuites) {
      try {
        await this.runTestSuite(suite.command);
        console.log(`✅ ${suite.name} regression tests passed`);
      } catch (error) {
        if (suite.critical) {
          console.log('🚨 Critical regression detected - triggering emergency rollback');
          await this.triggerEmergencyRollback();
          throw error;
        } else {
          await this.logRegressionWarning(suite.name, error);
        }
      }
    }
  }

  private async triggerEmergencyRollback() {
    // Automatically disable new features if regression detected
    await this.disableAllNewFeatures();
    await this.notifyTeam('Critical regression detected - automatic rollback executed');
  }

  private async disableAllNewFeatures() {
    const flags = ['FEATURE_CONTENT_AUTOMATION', 'FEATURE_CAMPAIGN_MANAGEMENT', 'FEATURE_LINKEDIN_INTEGRATION'];
    await Promise.all(flags.map(flag => this.setFeatureFlag(flag, false)));
  }
}
```

### 6. Regression Test Scripts

```json
// package.json - Regression test scripts
{
  "scripts": {
    "test:regression": "playwright test tests/regression --reporter=html",
    "test:regression:smoke": "playwright test tests/regression/critical/smoke-tests.spec.ts",
    "test:regression:integration": "playwright test tests/regression/integration/",
    "test:regression:api": "playwright test tests/regression/api/",
    "test:regression:database": "playwright test tests/regression/database/",
    "test:regression:performance": "playwright test tests/regression/performance/",
    "test:smoke:auth": "playwright test tests/regression/critical/auth-smoke.spec.ts",
    "test:smoke:production": "playwright test tests/regression/critical/production-smoke.spec.ts",
    "test:smoke:campaigns": "playwright test tests/regression/features/campaigns-smoke.spec.ts",
    "test:smoke:content": "playwright test tests/regression/features/content-smoke.spec.ts",
    "test:smoke:linkedin": "playwright test tests/regression/features/linkedin-smoke.spec.ts",
    "test:smoke:full-system": "playwright test tests/regression/system/full-system-smoke.spec.ts",
    "validate-migrations": "npm run test:regression:database"
  }
}
```

### 7. Integration with Zero-Downtime Pipeline

**Enhanced CI/CD Pipeline with Regression Protection:**
- **Pre-deployment:** Full regression suite must pass
- **Post-migration:** Database regression tests verify schema integrity
- **Post-deployment:** Smoke tests verify existing functionality intact
- **Feature rollout:** Integration tests run after each feature enablement
- **Continuous monitoring:** Automated regression detection with rollback triggers

## Test Organization

### Frontend Tests
```
tests/components/
├── content/
│   ├── content-card.test.tsx       # Content card component
│   ├── pipeline-progress.test.tsx  # Pipeline visualization
│   └── approval-buttons.test.tsx   # Action buttons
├── campaigns/
│   ├── campaign-selector.test.tsx  # Context switcher
│   └── campaign-form.test.tsx      # Form validation
└── hooks/
    ├── use-campaign-context.test.ts # State management
    └── use-real-time.test.ts       # Real-time subscriptions
```

### Backend Tests
```
tests/api/
├── campaigns/
│   ├── create-campaign.test.ts     # Campaign creation
│   ├── update-campaign.test.ts     # Campaign updates
│   └── campaign-content.test.ts    # Content filtering
├── content/
│   ├── approve-content.test.ts     # Approval workflow
│   ├── batch-operations.test.ts    # Bulk operations
│   └── content-versions.test.ts    # Version management
└── webhooks/
    ├── n8n-content-generated.test.ts # Webhook processing
    └── webhook-auth.test.ts          # Security validation
```

### E2E Tests
```
tests/e2e/
├── content-pipeline.spec.ts        # Complete approval workflow
├── campaign-switching.spec.ts      # Context switching flow
├── mobile-approvals.spec.ts        # Mobile responsive tests
└── real-time-updates.spec.ts       # Live update functionality
```
