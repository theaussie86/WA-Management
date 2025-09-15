// Test configuration for Supabase local development environment
export const TEST_CONFIG = {
  // Supabase Test Configuration
  supabase: {
    url: process.env.TEST_SUPABASE_URL || "http://localhost:54321",
    anonKey:
      process.env.TEST_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
    serviceRoleKey:
      process.env.TEST_SUPABASE_SERVICE_ROLE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
    schema: "public",
  },

  // Database Test Configuration
  database: {
    cleanupAfterEach: process.env.TEST_DB_CLEANUP_AFTER_EACH !== "false",
    seedData: process.env.TEST_DB_SEED_DATA !== "false",
    resetOnStart: true,
  },

  // Test Data Configuration
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

  // Test User Configuration
  testUsers: {
    default: {
      id: "00000000-0000-0000-0000-000000000001",
      email: "test@example.com",
      name: "Test User",
    },
  },

  // Test Campaigns
  testCampaigns: {
    techInnovation: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Tech Innovation Campaign",
      description: "Focus on emerging technologies and innovation trends",
      target_audience: "Tech professionals and entrepreneurs",
      messaging_tone: "thought_leader",
      content_themes: ["AI", "Innovation", "Technology"],
    },
    marketingAutomation: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "Marketing Automation",
      description: "Content about marketing automation tools and strategies",
      target_audience: "Marketing professionals",
      messaging_tone: "professional",
      content_themes: ["Marketing", "Automation", "Strategy"],
    },
  },

  // Test Content Items
  testContentItems: {
    draftPost: {
      id: "660e8400-e29b-41d4-a716-446655440001",
      campaign_id: "550e8400-e29b-41d4-a716-446655440001",
      content_type: "draft_post",
      stage: "drafting",
      approval_status: "pending",
    },
    contentIdea: {
      id: "660e8400-e29b-41d4-a716-446655440002",
      campaign_id: "550e8400-e29b-41d4-a716-446655440001",
      content_type: "content_idea",
      stage: "ideation",
      approval_status: "approved",
    },
    publishedPost: {
      id: "660e8400-e29b-41d4-a716-446655440003",
      campaign_id: "550e8400-e29b-41d4-a716-446655440002",
      content_type: "draft_post",
      stage: "published",
      approval_status: "approved",
    },
  },

  // Test Workflow Executions
  testWorkflowExecutions: {
    completed: {
      id: "770e8400-e29b-41d4-a716-446655440001",
      content_item_id: "660e8400-e29b-41d4-a716-446655440001",
      workflow_name: "content_generation",
      execution_status: "completed",
      ai_service_used: "gpt-4",
      execution_duration: 2500,
    },
    failed: {
      id: "770e8400-e29b-41d4-a716-446655440003",
      content_item_id: "660e8400-e29b-41d4-a716-446655440003",
      workflow_name: "content_optimization",
      execution_status: "failed",
      ai_service_used: "gpt-4",
      execution_duration: 5000,
    },
  },

  // Test Content Versions
  testContentVersions: {
    aiGenerated: {
      id: "880e8400-e29b-41d4-a716-446655440001",
      content_item_id: "660e8400-e29b-41d4-a716-446655440001",
      version_number: 1,
      version_type: "ai_generated",
      created_by: "ai_workflow",
    },
    humanEdited: {
      id: "880e8400-e29b-41d4-a716-446655440002",
      content_item_id: "660e8400-e29b-41d4-a716-446655440001",
      version_number: 2,
      version_type: "human_edited",
      created_by: "human_user",
    },
  },

  // Test Performance Data
  testPerformanceData: {
    highEngagement: {
      id: "990e8400-e29b-41d4-a716-446655440001",
      content_item_id: "660e8400-e29b-41d4-a716-446655440003",
      likes_count: 45,
      comments_count: 12,
      shares_count: 8,
      impressions: 1250,
      click_through_rate: 0.036,
      engagement_rate: 0.052,
    },
  },

  // Test User Preferences
  testUserPreferences: {
    default: {
      id: "aa0e8400-e29b-41d4-a716-446655440001",
      user_id: "00000000-0000-0000-0000-000000000001",
      default_campaign_id: "550e8400-e29b-41d4-a716-446655440001",
      ai_creativity_level: 7,
      auto_approve_threshold: 0.8,
      notification_preferences: {
        email: true,
        push: false,
        weekly_summary: true,
      },
      linkedin_integration: {
        connected: true,
        last_sync: "2025-09-15T10:00:00Z",
      },
      brand_guidelines: {
        tone: "professional",
        brand_voice: "authoritative",
        avoid_topics: ["politics"],
      },
      content_scheduling: {
        timezone: "UTC",
        optimal_posting_times: ["09:00", "13:00", "17:00"],
      },
    },
  },
};

// Test data generators
export const generateTestData = {
  campaigns: (count: number = 3) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-campaign-${i + 1}`,
      name: `Test Campaign ${i + 1}`,
      description: `Test campaign description ${i + 1}`,
      target_audience: `Test audience ${i + 1}`,
      messaging_tone: ["professional", "thought_leader", "educational"][i % 3],
      content_themes: ["Technology", "Innovation", "Business"].slice(
        0,
        (i % 3) + 1
      ),
      status: "active",
      user_id: TEST_CONFIG.testUsers.default.id,
    }));
  },

  contentItems: (campaignId: string, count: number = 5) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-content-${i + 1}`,
      campaign_id: campaignId,
      content_type: ["draft_post", "content_idea", "trending_topic"][i % 3],
      stage: ["drafting", "ideation", "research"][i % 3],
      approval_status: ["pending", "approved", "needs_revision"][i % 3],
      user_id: TEST_CONFIG.testUsers.default.id,
    }));
  },

  contentVersions: (contentItemId: string, count: number = 2) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-version-${i + 1}`,
      content_item_id: contentItemId,
      version_number: i + 1,
      version_type: ["ai_generated", "human_edited"][i % 2],
      content_data: {
        title: `Test Content ${i + 1}`,
        content: `Test content version ${i + 1}`,
        hashtags: ["#test", "#content"],
      },
      created_by: ["ai_workflow", "human_user"][i % 2],
    }));
  },

  workflowExecutions: (contentItemId: string, count: number = 3) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-execution-${i + 1}`,
      content_item_id: contentItemId,
      workflow_name: "content_generation",
      execution_status: ["completed", "failed", "running"][i % 3],
      input_data: {
        prompt: `Test prompt ${i + 1}`,
        tone: "professional",
      },
      output_data: {
        content: `Generated content ${i + 1}`,
        confidence: 0.8 + i * 0.05,
      },
      ai_service_used: "gpt-4",
      execution_duration: 1000 + i * 500,
    }));
  },
};

// Test environment validation
export const validateTestEnvironment = () => {
  const requiredEnvVars = ["NODE_ENV"];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  // Set test environment variables
  // process.env.NODE_ENV = "test"; // Read-only property
  process.env.NEXT_PUBLIC_SUPABASE_URL = TEST_CONFIG.supabase.url;
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY =
    TEST_CONFIG.supabase.anonKey;
  process.env.SUPABASE_SERVICE_ROLE_KEY = TEST_CONFIG.supabase.serviceRoleKey;
};

export default TEST_CONFIG;
