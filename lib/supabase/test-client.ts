import { createClient } from "@supabase/supabase-js";

// Test database configuration
const TEST_SUPABASE_URL =
  process.env.TEST_SUPABASE_URL || "http://localhost:54321";
const TEST_SUPABASE_ANON_KEY =
  process.env.TEST_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

// Create test client
export function createTestClient() {
  return createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);
}

// Test database utilities
export class TestDatabaseUtils {
  private client = createTestClient();

  async seedTestData() {
    try {
      // This would typically run the test data migration
      // For now, we'll just verify the connection
      const { error } = await this.client
        .from("campaigns")
        .select("count")
        .limit(1);

      if (error) {
        console.warn("Test database not ready:", error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.warn("Test database connection failed:", error);
      return false;
    }
  }

  async cleanupTestData() {
    try {
      // Clean up test data in reverse order of dependencies
      await this.client
        .from("content_performance")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      await this.client
        .from("content_versions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      await this.client
        .from("workflow_executions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      await this.client
        .from("content_items")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      await this.client
        .from("campaigns")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      await this.client
        .from("user_preferences")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      return true;
    } catch (error) {
      console.warn("Test data cleanup failed:", error);
      return false;
    }
  }

  async resetDatabase() {
    await this.cleanupTestData();
    await this.seedTestData();
  }

  async checkConnection() {
    try {
      const { error } = await this.client
        .from("campaigns")
        .select("count")
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  }
}

// Global test database utilities
export const testDbUtils = new TestDatabaseUtils();

// Test environment setup
export const setupTestEnvironment = async () => {
  const isConnected = await testDbUtils.checkConnection();

  if (!isConnected) {
    console.warn("Test database not available. Some tests may be skipped.");
    return false;
  }

  await testDbUtils.resetDatabase();
  return true;
};

// Test environment cleanup
export const cleanupTestEnvironment = async () => {
  await testDbUtils.cleanupTestData();
};
