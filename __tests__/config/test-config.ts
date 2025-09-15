// Test configuration for comprehensive testing infrastructure
export const TEST_CONFIG = {
  // Database configuration
  database: {
    testUrl: process.env.TEST_SUPABASE_URL || 'http://localhost:54321',
    testAnonKey: process.env.TEST_SUPABASE_ANON_KEY || 'test-anon-key',
    testServiceRoleKey: process.env.TEST_SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key',
    schema: 'test_schema',
    cleanupAfterEach: true,
    seedData: true,
  },

  // API configuration
  api: {
    baseUrl: process.env.TEST_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
    retries: 3,
    retryDelay: 1000,
  },

  // n8n configuration
  n8n: {
    baseUrl: process.env.TEST_N8N_URL || 'http://localhost:5678',
    webhookUrl: process.env.TEST_N8N_WEBHOOK_URL || 'http://localhost:3000/api/webhooks/n8n',
    apiKey: process.env.TEST_N8N_API_KEY || 'test-n8n-api-key',
    timeout: 30000,
    retries: 2,
  },

  // AI service configuration
  ai: {
    mockMode: process.env.TEST_AI_MOCK_MODE !== 'false',
    mockDelay: 100, // Simulate AI processing time
    mockErrorRate: 0.1, // 10% error rate for testing
    timeout: 30000,
  },

  // Test data configuration
  testData: {
    campaigns: {
      count: 3,
      includeContent: true,
      contentPerCampaign: 5,
    },
    contentItems: {
      count: 10,
      includeVersions: true,
      versionsPerItem: 2,
    },
    workflowExecutions: {
      count: 5,
      includeErrors: true,
      errorRate: 0.2,
    },
  },

  // Coverage configuration
  coverage: {
    threshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
      components: {
        branches: 85,
        functions: 85,
        lines: 85,
        statements: 85,
      },
      lib: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    collectFrom: [
      'components/**/*.{js,jsx,ts,tsx}',
      'lib/**/*.{js,jsx,ts,tsx}',
      'hooks/**/*.{js,jsx,ts,tsx}',
      'app/api/**/*.{js,jsx,ts,tsx}',
    ],
    exclude: [
      '**/*.d.ts',
      '**/node_modules/**',
      '**/.next/**',
      '**/coverage/**',
      '**/__tests__/**',
      '**/test-utils/**',
      '**/mocks/**',
    ],
  },

  // Performance configuration
  performance: {
    maxTestTime: 300000, // 5 minutes
    maxMemoryUsage: 1024 * 1024 * 1024, // 1GB
    slowTestThreshold: 5000, // 5 seconds
  },

  // Environment configuration
  environment: {
    nodeEnv: 'test',
    logLevel: 'error',
    enableDebugLogs: false,
    enablePerformanceLogs: false,
  },
};

// Test environment validation
export const validateTestEnvironment = () => {
  const requiredEnvVars = [
    'NODE_ENV',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_SUPABASE_URL = TEST_CONFIG.database.testUrl;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = TEST_CONFIG.database.testAnonKey;
  process.env.SUPABASE_SERVICE_ROLE_KEY = TEST_CONFIG.database.testServiceRoleKey;
};

// Test data generators
export const generateTestData = {
  campaigns: (count: number = TEST_CONFIG.testData.campaigns.count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-campaign-${i + 1}`,
      name: `Test Campaign ${i + 1}`,
      description: `Test campaign description ${i + 1}`,
      target_audience: `Test audience ${i + 1}`,
      messaging_tone: ['Professional', 'Casual', 'Friendly'][i % 3],
      content_themes: ['Technology', 'Innovation', 'Business'].slice(0, (i % 3) + 1),
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'test-user-id',
    }));
  },

  contentItems: (campaignId: string, count: number = TEST_CONFIG.testData.contentItems.count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-content-${i + 1}`,
      campaign_id: campaignId,
      title: `Test Content ${i + 1}`,
      content_type: ['linkedin_post', 'twitter_post', 'blog_post'][i % 3],
      pipeline_state: ['draft', 'review', 'published'][i % 3],
      created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'test-user-id',
    }));
  },

  contentVersions: (contentItemId: string, count: number = TEST_CONFIG.testData.contentItems.versionsPerItem) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-version-${i + 1}`,
      content_item_id: contentItemId,
      version_number: i + 1,
      content: `Test content version ${i + 1} for ${contentItemId}`,
      ai_generated: i % 2 === 0,
      created_at: new Date(Date.now() - i * 30 * 60 * 1000).toISOString(),
    }));
  },

  workflowExecutions: (contentItemId: string, count: number = TEST_CONFIG.testData.workflowExecutions.count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-execution-${i + 1}`,
      workflow_id: `test-workflow-${(i % 3) + 1}`,
      content_item_id: contentItemId,
      status: ['completed', 'failed', 'running'][i % 3],
      input_data: {
        prompt: `Test prompt ${i + 1}`,
        model: 'gpt-4',
        temperature: 0.7,
      },
      output_data: {
        content: `Generated content ${i + 1}`,
        metadata: {
          model: 'gpt-4',
          tokens_used: 100 + i * 10,
          processing_time_ms: 1000 + i * 100,
        },
      },
      execution_time_ms: 1000 + i * 100,
      created_at: new Date(Date.now() - i * 15 * 60 * 1000).toISOString(),
    }));
  },
};

// Export default configuration
export default TEST_CONFIG;

// Tests for test configuration
describe('Test Configuration', () => {
  it('should have valid test configuration', () => {
    expect(TEST_CONFIG).toBeDefined();
    expect(TEST_CONFIG.database).toBeDefined();
    expect(TEST_CONFIG.api).toBeDefined();
    expect(TEST_CONFIG.n8n).toBeDefined();
    expect(TEST_CONFIG.ai).toBeDefined();
  });

  it('should have valid coverage thresholds', () => {
    expect(TEST_CONFIG.coverage.threshold.global.branches).toBe(80);
    expect(TEST_CONFIG.coverage.threshold.global.functions).toBe(80);
    expect(TEST_CONFIG.coverage.threshold.global.lines).toBe(80);
    expect(TEST_CONFIG.coverage.threshold.global.statements).toBe(80);
  });

  it('should generate test data correctly', () => {
    const campaigns = generateTestData.campaigns(2);
    expect(campaigns).toHaveLength(2);
    expect(campaigns[0]).toHaveProperty('id');
    expect(campaigns[0]).toHaveProperty('name');
    expect(campaigns[0]).toHaveProperty('user_id');
  });

  it('should validate test environment', () => {
    expect(() => validateTestEnvironment()).not.toThrow();
  });
});
