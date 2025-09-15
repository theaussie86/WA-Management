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
    // Mock implementation for testing
    return Promise.resolve();
  }

  async cleanupContentItems() {
    // Mock implementation for testing
    return Promise.resolve();
  }

  async cleanupContentVersions() {
    // Mock implementation for testing
    return Promise.resolve();
  }

  async cleanupWorkflowExecutions() {
    // Mock implementation for testing
    return Promise.resolve();
  }

  async cleanupAll() {
    await this.cleanupWorkflowExecutions();
    await this.cleanupContentVersions();
    await this.cleanupContentItems();
    await this.cleanupCampaigns();
  }

  async resetDatabase() {
    await this.cleanupAll();
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
