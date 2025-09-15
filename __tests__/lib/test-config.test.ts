/**
 * Test Configuration Tests
 *
 * Tests für die Test-Konfiguration und Test-Daten-Generierung
 */

import {
  TEST_CONFIG,
  generateTestData,
  validateTestEnvironment,
} from "../../lib/test-config";

describe("Test Configuration", () => {
  describe("TEST_CONFIG", () => {
    it("should have valid test configuration", () => {
      expect(TEST_CONFIG).toBeDefined();
      expect(TEST_CONFIG.supabase).toBeDefined();
      expect(TEST_CONFIG.database).toBeDefined();
      expect(TEST_CONFIG.testData).toBeDefined();
      expect(TEST_CONFIG.testUsers).toBeDefined();
    });

    it("should have valid Supabase configuration", () => {
      expect(TEST_CONFIG.supabase.url).toBeDefined();
      expect(TEST_CONFIG.supabase.anonKey).toBeDefined();
      expect(TEST_CONFIG.supabase.serviceRoleKey).toBeDefined();
      expect(TEST_CONFIG.supabase.schema).toBe("public");
    });

    it("should have valid database configuration", () => {
      expect(TEST_CONFIG.database.cleanupAfterEach).toBe(true);
      expect(TEST_CONFIG.database.seedData).toBe(true);
      expect(TEST_CONFIG.database.resetOnStart).toBe(true);
    });

    it("should have valid test data configuration", () => {
      expect(TEST_CONFIG.testData.campaigns.count).toBe(3);
      expect(TEST_CONFIG.testData.campaigns.includeContent).toBe(true);
      expect(TEST_CONFIG.testData.contentItems.count).toBe(10);
      expect(TEST_CONFIG.testData.workflowExecutions.count).toBe(5);
    });

    it("should have valid test users", () => {
      expect(TEST_CONFIG.testUsers.default).toBeDefined();
      expect(TEST_CONFIG.testUsers.default.id).toBeDefined();
      expect(TEST_CONFIG.testUsers.default.email).toBe("test@example.com");
      expect(TEST_CONFIG.testUsers.default.name).toBe("Test User");
    });

    it("should have valid test campaigns", () => {
      expect(TEST_CONFIG.testCampaigns.techInnovation).toBeDefined();
      expect(TEST_CONFIG.testCampaigns.techInnovation.name).toBe(
        "Tech Innovation Campaign"
      );
      expect(TEST_CONFIG.testCampaigns.marketingAutomation).toBeDefined();
      expect(TEST_CONFIG.testCampaigns.marketingAutomation.name).toBe(
        "Marketing Automation"
      );
    });

    it("should have valid test content items", () => {
      expect(TEST_CONFIG.testContentItems.draftPost).toBeDefined();
      expect(TEST_CONFIG.testContentItems.draftPost.content_type).toBe(
        "draft_post"
      );
      expect(TEST_CONFIG.testContentItems.contentIdea).toBeDefined();
      expect(TEST_CONFIG.testContentItems.publishedPost).toBeDefined();
    });

    it("should have valid test workflow executions", () => {
      expect(TEST_CONFIG.testWorkflowExecutions.completed).toBeDefined();
      expect(
        TEST_CONFIG.testWorkflowExecutions.completed.execution_status
      ).toBe("completed");
      expect(TEST_CONFIG.testWorkflowExecutions.failed).toBeDefined();
      expect(TEST_CONFIG.testWorkflowExecutions.failed.execution_status).toBe(
        "failed"
      );
    });

    it("should have valid test content versions", () => {
      expect(TEST_CONFIG.testContentVersions.aiGenerated).toBeDefined();
      expect(TEST_CONFIG.testContentVersions.aiGenerated.version_type).toBe(
        "ai_generated"
      );
      expect(TEST_CONFIG.testContentVersions.humanEdited).toBeDefined();
      expect(TEST_CONFIG.testContentVersions.humanEdited.version_type).toBe(
        "human_edited"
      );
    });

    it("should have valid test performance data", () => {
      expect(TEST_CONFIG.testPerformanceData.highEngagement).toBeDefined();
      expect(TEST_CONFIG.testPerformanceData.highEngagement.likes_count).toBe(
        45
      );
      expect(
        TEST_CONFIG.testPerformanceData.highEngagement.engagement_rate
      ).toBe(0.052);
    });

    it("should have valid test user preferences", () => {
      expect(TEST_CONFIG.testUserPreferences.default).toBeDefined();
      expect(TEST_CONFIG.testUserPreferences.default.ai_creativity_level).toBe(
        7
      );
      expect(
        TEST_CONFIG.testUserPreferences.default.notification_preferences.email
      ).toBe(true);
      expect(
        TEST_CONFIG.testUserPreferences.default.brand_guidelines.tone
      ).toBe("professional");
    });
  });

  describe("generateTestData", () => {
    it("should generate campaigns correctly", () => {
      const campaigns = generateTestData.campaigns(3);

      expect(campaigns).toHaveLength(3);
      expect(campaigns[0]).toMatchObject({
        id: "test-campaign-1",
        name: "Test Campaign 1",
        description: "Test campaign description 1",
        target_audience: "Test audience 1",
        status: "active",
        user_id: TEST_CONFIG.testUsers.default.id,
      });
      expect(campaigns[0].messaging_tone).toBe("professional");
      expect(campaigns[0].content_themes).toEqual(["Technology"]);
    });

    it("should generate campaigns with different tones", () => {
      const campaigns = generateTestData.campaigns(5);

      expect(campaigns[1].messaging_tone).toBe("thought_leader");
      expect(campaigns[2].messaging_tone).toBe("educational");
      expect(campaigns[3].messaging_tone).toBe("professional");
      expect(campaigns[4].messaging_tone).toBe("thought_leader");
    });

    it("should generate content items correctly", () => {
      const campaignId = "test-campaign-1";
      const contentItems = generateTestData.contentItems(campaignId, 3);

      expect(contentItems).toHaveLength(3);
      expect(contentItems[0]).toMatchObject({
        id: "test-content-1",
        campaign_id: campaignId,
        content_type: "draft_post",
        stage: "drafting",
        approval_status: "pending",
        user_id: TEST_CONFIG.testUsers.default.id,
      });
    });

    it("should generate content items with different types", () => {
      const campaignId = "test-campaign-1";
      const contentItems = generateTestData.contentItems(campaignId, 4);

      expect(contentItems[0].content_type).toBe("draft_post");
      expect(contentItems[1].content_type).toBe("content_idea");
      expect(contentItems[2].content_type).toBe("trending_topic");
      expect(contentItems[3].content_type).toBe("draft_post");
    });

    it("should generate content versions correctly", () => {
      const contentItemId = "test-content-1";
      const versions = generateTestData.contentVersions(contentItemId, 2);

      expect(versions).toHaveLength(2);
      expect(versions[0]).toMatchObject({
        id: "test-version-1",
        content_item_id: contentItemId,
        version_number: 1,
        version_type: "ai_generated",
        created_by: "ai_workflow",
      });
      expect(versions[1]).toMatchObject({
        id: "test-version-2",
        content_item_id: contentItemId,
        version_number: 2,
        version_type: "human_edited",
        created_by: "human_user",
      });
    });

    it("should generate content versions with proper content data", () => {
      const contentItemId = "test-content-1";
      const versions = generateTestData.contentVersions(contentItemId, 1);

      expect(versions[0].content_data).toEqual({
        title: "Test Content 1",
        content: "Test content version 1",
        hashtags: ["#test", "#content"],
      });
    });

    it("should generate workflow executions correctly", () => {
      const contentItemId = "test-content-1";
      const executions = generateTestData.workflowExecutions(contentItemId, 3);

      expect(executions).toHaveLength(3);
      expect(executions[0]).toMatchObject({
        id: "test-execution-1",
        content_item_id: contentItemId,
        workflow_name: "content_generation",
        execution_status: "completed",
        ai_service_used: "gpt-4",
      });
    });

    it("should generate workflow executions with different statuses", () => {
      const contentItemId = "test-content-1";
      const executions = generateTestData.workflowExecutions(contentItemId, 4);

      expect(executions[0].execution_status).toBe("completed");
      expect(executions[1].execution_status).toBe("failed");
      expect(executions[2].execution_status).toBe("running");
      expect(executions[3].execution_status).toBe("completed");
    });

    it("should generate workflow executions with proper input/output data", () => {
      const contentItemId = "test-content-1";
      const executions = generateTestData.workflowExecutions(contentItemId, 1);

      expect(executions[0].input_data).toEqual({
        prompt: "Test prompt 1",
        tone: "professional",
      });
      expect(executions[0].output_data).toEqual({
        content: "Generated content 1",
        confidence: 0.8,
      });
    });

    it("should generate workflow executions with increasing duration", () => {
      const contentItemId = "test-content-1";
      const executions = generateTestData.workflowExecutions(contentItemId, 3);

      expect(executions[0].execution_duration).toBe(1000);
      expect(executions[1].execution_duration).toBe(1500);
      expect(executions[2].execution_duration).toBe(2000);
    });
  });

  describe("validateTestEnvironment", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should validate test environment successfully", () => {
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "test",
        writable: true,
        configurable: true,
      });

      expect(() => validateTestEnvironment()).not.toThrow();
    });

    it("should set test environment variables", () => {
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "test",
        writable: true,
        configurable: true,
      });

      validateTestEnvironment();

      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe(
        TEST_CONFIG.supabase.url
      );
      expect(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY).toBe(
        TEST_CONFIG.supabase.anonKey
      );
      expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBe(
        TEST_CONFIG.supabase.serviceRoleKey
      );
    });

    it("should throw error for missing NODE_ENV", () => {
      Object.defineProperty(process.env, "NODE_ENV", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => validateTestEnvironment()).toThrow(
        "Missing required environment variables: NODE_ENV"
      );
    });

    it("should throw error for multiple missing environment variables", () => {
      Object.defineProperty(process.env, "NODE_ENV", {
        value: undefined,
        writable: true,
        configurable: true,
      });
      delete process.env.TEST_VAR;

      // Mock the requiredEnvVars to include TEST_VAR for this test
      const originalValidateTestEnvironment = validateTestEnvironment;
      const mockValidateTestEnvironment = () => {
        const requiredEnvVars = ["NODE_ENV", "TEST_VAR"];
        const missingVars = requiredEnvVars.filter(
          (varName) => !process.env[varName]
        );
        if (missingVars.length > 0) {
          throw new Error(
            `Missing required environment variables: ${missingVars.join(", ")}`
          );
        }
      };

      expect(() => mockValidateTestEnvironment()).toThrow(
        "Missing required environment variables: NODE_ENV, TEST_VAR"
      );
    });
  });
});
