import {
  createTestClient,
  DatabaseTestUtils,
} from "../utils/database-test-utils";
import { TEST_CONFIG, generateTestData } from "../../lib/test-config";

describe("Supabase Test Infrastructure", () => {
  let testDbUtils: DatabaseTestUtils;

  beforeAll(async () => {
    testDbUtils = new DatabaseTestUtils();
  });

  beforeEach(async () => {
    await testDbUtils.resetDatabase();
  });

  afterAll(async () => {
    await testDbUtils.cleanupAll();
  });

  describe("Database Connection", () => {
    it("should connect to test database", async () => {
      const isConnected = await testDbUtils.checkConnection();
      expect(isConnected).toBe(true);
    });

    it("should create test client", () => {
      const client = createTestClient();
      expect(client).toBeDefined();
      // expect(client.supabaseUrl).toBe(TEST_CONFIG.supabase.url); // Protected property
    });
  });

  describe("Test Data Seeding", () => {
    it("should seed test campaigns", async () => {
      const campaigns = generateTestData.campaigns(2);
      const result = await testDbUtils.seedCampaigns(campaigns);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should seed test content items", async () => {
      const campaignId = "test-campaign-1";
      const contentItems = generateTestData.contentItems(campaignId, 3);
      const result = await testDbUtils.seedContentItems(contentItems);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should seed test content versions", async () => {
      const contentItemId = "test-content-1";
      const contentVersions = generateTestData.contentVersions(
        contentItemId,
        2
      );
      const result = await testDbUtils.seedContentVersions(contentVersions);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should seed test workflow executions", async () => {
      const contentItemId = "test-content-1";
      const workflowExecutions = generateTestData.workflowExecutions(
        contentItemId,
        2
      );
      const result = await testDbUtils.seedWorkflowExecutions(
        workflowExecutions
      );

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Test Data Cleanup", () => {
    it("should cleanup all test data", async () => {
      // Seed some test data first
      const campaigns = generateTestData.campaigns(2);
      await testDbUtils.seedCampaigns(campaigns);

      // Cleanup
      const result = await testDbUtils.cleanupAll();
      expect(result).toBe(true);
    });

    it("should reset database", async () => {
      const result = await testDbUtils.resetDatabase();
      expect(result).toBe(true);
    });
  });

  describe("Test Configuration", () => {
    it("should have valid test configuration", () => {
      expect(TEST_CONFIG.supabase.url).toBeDefined();
      expect(TEST_CONFIG.supabase.anonKey).toBeDefined();
      expect(TEST_CONFIG.supabase.serviceRoleKey).toBeDefined();
    });

    it("should generate test data correctly", () => {
      const campaigns = generateTestData.campaigns(3);
      expect(campaigns).toHaveLength(3);
      expect(campaigns[0]).toHaveProperty("id");
      expect(campaigns[0]).toHaveProperty("name");
      expect(campaigns[0]).toHaveProperty("user_id");

      const contentItems = generateTestData.contentItems("test-campaign-1", 5);
      expect(contentItems).toHaveLength(5);
      expect(contentItems[0]).toHaveProperty("campaign_id");
      expect(contentItems[0].campaign_id).toBe("test-campaign-1");
    });
  });

  describe("Database Schema Validation", () => {
    it("should have campaigns table", async () => {
      const client = createTestClient();
      const { error } = await client.from("campaigns").select("count").limit(1);

      // Should not error even if table is empty
      expect(error).toBeNull();
    });

    it("should have content_items table", async () => {
      const client = createTestClient();
      const { error } = await client
        .from("content_items")
        .select("count")
        .limit(1);

      expect(error).toBeNull();
    });

    it("should have content_versions table", async () => {
      const client = createTestClient();
      const { error } = await client
        .from("content_versions")
        .select("count")
        .limit(1);

      expect(error).toBeNull();
    });

    it("should have workflow_executions table", async () => {
      const client = createTestClient();
      const { error } = await client
        .from("workflow_executions")
        .select("count")
        .limit(1);

      expect(error).toBeNull();
    });

    it("should have content_performance table", async () => {
      const client = createTestClient();
      const { error } = await client
        .from("content_performance")
        .select("count")
        .limit(1);

      expect(error).toBeNull();
    });

    it("should have user_preferences table", async () => {
      const client = createTestClient();
      const { error } = await client
        .from("user_preferences")
        .select("count")
        .limit(1);

      expect(error).toBeNull();
    });
  });
});
