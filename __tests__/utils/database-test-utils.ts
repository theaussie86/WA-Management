import { createClient } from "@supabase/supabase-js";
import { TEST_CONFIG } from "../../lib/test-config";

// Test database configuration
export const TEST_DB_CONFIG = {
  url: TEST_CONFIG.supabase.url,
  anonKey: TEST_CONFIG.supabase.anonKey,
  serviceRoleKey: TEST_CONFIG.supabase.serviceRoleKey,
};

// Create test database client
export const createTestClient = () => {
  return createClient(TEST_DB_CONFIG.url, TEST_DB_CONFIG.serviceRoleKey);
};

// Database seeding utilities
export class DatabaseTestUtils {
  private client = createTestClient();

  async seedCampaigns(campaigns: any[]) {
    const { data, error } = await this.client
      .from("campaigns")
      .insert(campaigns);

    if (error) throw error;
    return data;
  }

  async seedContentItems(contentItems: any[]) {
    const { data, error } = await this.client
      .from("content_items")
      .insert(contentItems);

    if (error) throw error;
    return data;
  }

  async seedContentVersions(contentVersions: any[]) {
    const { data, error } = await this.client
      .from("content_versions")
      .insert(contentVersions);

    if (error) throw error;
    return data;
  }

  async seedWorkflowExecutions(executions: any[]) {
    const { data, error } = await this.client
      .from("workflow_executions")
      .insert(executions);

    if (error) throw error;
    return data;
  }

  async cleanupCampaigns() {
    try {
      const { error } = await this.client
        .from("campaigns")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
      return true;
    } catch (error) {
      console.warn("Cleanup campaigns failed:", error);
      return false;
    }
  }

  async cleanupContentItems() {
    try {
      const { error } = await this.client
        .from("content_items")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
      return true;
    } catch (error) {
      console.warn("Cleanup content items failed:", error);
      return false;
    }
  }

  async cleanupContentVersions() {
    try {
      const { error } = await this.client
        .from("content_versions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
      return true;
    } catch (error) {
      console.warn("Cleanup content versions failed:", error);
      return false;
    }
  }

  async cleanupWorkflowExecutions() {
    try {
      const { error } = await this.client
        .from("workflow_executions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
      return true;
    } catch (error) {
      console.warn("Cleanup workflow executions failed:", error);
      return false;
    }
  }

  async cleanupAll() {
    await this.cleanupWorkflowExecutions();
    await this.cleanupContentVersions();
    await this.cleanupContentItems();
    await this.cleanupCampaigns();
    return true;
  }

  async resetDatabase() {
    await this.cleanupAll();
    return true;
  }

  async checkConnection() {
    try {
      const { data, error } = await this.client
        .from("campaigns")
        .select("count")
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }
}

// Global test database utilities
export const testDbUtils = new DatabaseTestUtils();

// Jest setup for database tests
beforeEach(async () => {
  await testDbUtils.resetDatabase();
});

afterAll(async () => {
  await testDbUtils.cleanupAll();
});

// Tests for database utilities
describe("DatabaseTestUtils", () => {
  it("should create test client", () => {
    const client = createTestClient();
    expect(client).toBeDefined();
  });

  it("should have test database configuration", () => {
    expect(TEST_DB_CONFIG.url).toBeDefined();
    expect(TEST_DB_CONFIG.anonKey).toBeDefined();
    expect(TEST_DB_CONFIG.serviceRoleKey).toBeDefined();
  });

  it("should have database test utilities", () => {
    expect(testDbUtils).toBeDefined();
    expect(testDbUtils.seedCampaigns).toBeDefined();
    expect(testDbUtils.cleanupAll).toBeDefined();
  });
});
