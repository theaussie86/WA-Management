import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

// Mock Supabase Provider
const MockSupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <MockSupabaseProvider>{children}</MockSupabaseProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Test utilities
export const createMockUser = (overrides = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  user_metadata: {
    full_name: "Test User",
  },
  ...overrides,
});

export const createMockSupabaseResponse = (data: unknown, error = null) => ({
  data,
  error,
  status: error ? 400 : 200,
  statusText: error ? "Bad Request" : "OK",
});

// Mock functions
export const mockSupabaseAuth = {
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  getUser: jest.fn(),
  onAuthStateChange: jest.fn(),
};

export const mockSupabaseClient = {
  auth: mockSupabaseAuth,
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
};

// Additional test utilities for comprehensive testing
export const createMockCampaign = (overrides = {}) => ({
  id: "test-campaign-id",
  name: "Test Campaign",
  description: "Test campaign description",
  target_audience: "Test audience",
  messaging_tone: "Professional",
  content_themes: ["Technology", "Innovation"],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: "test-user-id",
  ...overrides,
});

export const createMockContentItem = (overrides = {}) => ({
  id: "test-content-id",
  campaign_id: "test-campaign-id",
  title: "Test Content",
  content_type: "linkedin_post",
  pipeline_state: "draft",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: "test-user-id",
  ...overrides,
});

export const createMockContentVersion = (overrides = {}) => ({
  id: "test-version-id",
  content_item_id: "test-content-id",
  version_number: 1,
  content: "Test content version",
  ai_generated: true,
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockWorkflowExecution = (overrides = {}) => ({
  id: "test-execution-id",
  workflow_id: "test-workflow-id",
  content_item_id: "test-content-id",
  status: "completed",
  input_data: {},
  output_data: {},
  execution_time_ms: 1500,
  created_at: new Date().toISOString(),
  ...overrides,
});

// Mock n8n webhook responses
export const createMockN8nWebhookResponse = (overrides = {}) => ({
  success: true,
  data: {
    content: "Generated content from n8n",
    metadata: {
      workflow_id: "test-workflow-id",
      execution_id: "test-execution-id",
    },
  },
  timestamp: new Date().toISOString(),
  ...overrides,
});

// Mock AI service responses
export const createMockAIResponse = (overrides = {}) => ({
  success: true,
  content: "AI-generated content",
  metadata: {
    model: "gpt-4",
    tokens_used: 150,
    processing_time_ms: 2000,
  },
  ...overrides,
});

// Database test utilities
export const mockDatabaseOperations = {
  campaigns: {
    create: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  contentItems: {
    create: jest.fn(),
    findById: jest.fn(),
    findByCampaignId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  contentVersions: {
    create: jest.fn(),
    findByContentItemId: jest.fn(),
    findLatest: jest.fn(),
  },
  workflowExecutions: {
    create: jest.fn(),
    findById: jest.fn(),
    findByContentItemId: jest.fn(),
  },
};

// Test data seeding utilities
export const seedTestData = {
  campaigns: (count = 3) =>
    Array.from({ length: count }, (_, i) =>
      createMockCampaign({
        id: `campaign-${i + 1}`,
        name: `Test Campaign ${i + 1}`,
      })
    ),

  contentItems: (campaignId: string, count = 5) =>
    Array.from({ length: count }, (_, i) =>
      createMockContentItem({
        id: `content-${i + 1}`,
        campaign_id: campaignId,
        title: `Test Content ${i + 1}`,
      })
    ),

  contentVersions: (contentItemId: string, count = 2) =>
    Array.from({ length: count }, (_, i) =>
      createMockContentVersion({
        id: `version-${i + 1}`,
        content_item_id: contentItemId,
        version_number: i + 1,
      })
    ),
};

// Cleanup utilities
export const cleanupTestData = {
  campaigns: jest.fn(),
  contentItems: jest.fn(),
  contentVersions: jest.fn(),
  workflowExecutions: jest.fn(),
  all: jest.fn(),
};

// Dummy test to prevent "no tests" error
describe("test-utils", () => {
  it("should export utility functions", () => {
    expect(createMockUser).toBeDefined();
    expect(createMockSupabaseResponse).toBeDefined();
    expect(createMockCampaign).toBeDefined();
    expect(createMockContentItem).toBeDefined();
    expect(createMockContentVersion).toBeDefined();
    expect(createMockWorkflowExecution).toBeDefined();
    expect(createMockN8nWebhookResponse).toBeDefined();
    expect(createMockAIResponse).toBeDefined();
    expect(mockDatabaseOperations).toBeDefined();
    expect(seedTestData).toBeDefined();
    expect(cleanupTestData).toBeDefined();
  });
});
