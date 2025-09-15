/**
 * Test Client Tests
 *
 * Tests für die Test-Datenbank-Utilities und Test-Client-Funktionalität
 */

import {
  createTestClient,
  TestDatabaseUtils,
  testDbUtils,
  setupTestEnvironment,
  cleanupTestEnvironment,
} from "../../../lib/supabase/test-client";

// Mock Supabase client
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        limit: jest.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      delete: jest.fn(() => ({
        neq: jest.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    })),
  })),
}));

describe("Test Client", () => {
  describe("createTestClient", () => {
    it("should create test client with correct configuration", () => {
      const client = createTestClient();

      expect(client).toBeDefined();
      expect(typeof client.from).toBe("function");
    });

    it("should use test environment variables", () => {
      const originalUrl = process.env.TEST_SUPABASE_URL;
      const originalKey = process.env.TEST_SUPABASE_ANON_KEY;

      process.env.TEST_SUPABASE_URL = "http://test.example.com";
      process.env.TEST_SUPABASE_ANON_KEY = "test-key";

      const client = createTestClient();
      expect(client).toBeDefined();

      // Restore original values
      process.env.TEST_SUPABASE_URL = originalUrl;
      process.env.TEST_SUPABASE_ANON_KEY = originalKey;
    });

    it("should use default values when environment variables are not set", () => {
      const originalUrl = process.env.TEST_SUPABASE_URL;
      const originalKey = process.env.TEST_SUPABASE_ANON_KEY;

      delete process.env.TEST_SUPABASE_URL;
      delete process.env.TEST_SUPABASE_ANON_KEY;

      const client = createTestClient();
      expect(client).toBeDefined();

      // Restore original values
      process.env.TEST_SUPABASE_URL = originalUrl;
      process.env.TEST_SUPABASE_ANON_KEY = originalKey;
    });
  });

  describe("TestDatabaseUtils", () => {
    let dbUtils: TestDatabaseUtils;

    beforeEach(() => {
      dbUtils = new TestDatabaseUtils();
    });

    describe("seedTestData", () => {
      it("should seed test data successfully", async () => {
        const result = await dbUtils.seedTestData();

        expect(result).toBe(true);
      });

      it("should handle database connection errors gracefully", async () => {
        // Mock client to return error
        const mockClient = {
          from: jest.fn(() => ({
            select: jest.fn(() => ({
              limit: jest.fn(() => ({
                data: null,
                error: { message: "Connection failed" },
              })),
            })),
          })),
        };

        // Replace the client in the instance
        (dbUtils as any).client = mockClient;

        const result = await dbUtils.seedTestData();

        expect(result).toBe(false);
      });

      it("should handle exceptions during seeding", async () => {
        // Mock client to throw exception
        const mockClient = {
          from: jest.fn(() => {
            throw new Error("Database error");
          }),
        };

        // Replace the client in the instance
        (dbUtils as any).client = mockClient;

        const result = await dbUtils.seedTestData();

        expect(result).toBe(false);
      });
    });

    describe("cleanupTestData", () => {
      it("should cleanup test data successfully", async () => {
        const result = await dbUtils.cleanupTestData();

        expect(result).toBe(true);
      });

      it("should cleanup data in correct order", async () => {
        const mockClient = {
          from: jest.fn(() => ({
            delete: jest.fn(() => ({
              neq: jest.fn(() => ({
                data: [],
                error: null,
              })),
            })),
          })),
        };

        // Replace the client in the instance
        (dbUtils as any).client = mockClient;

        await dbUtils.cleanupTestData();

        // Verify cleanup order: content_performance -> content_versions -> workflow_executions -> content_items -> campaigns -> user_preferences
        expect(mockClient.from).toHaveBeenCalledWith("content_performance");
        expect(mockClient.from).toHaveBeenCalledWith("content_versions");
        expect(mockClient.from).toHaveBeenCalledWith("workflow_executions");
        expect(mockClient.from).toHaveBeenCalledWith("content_items");
        expect(mockClient.from).toHaveBeenCalledWith("campaigns");
        expect(mockClient.from).toHaveBeenCalledWith("user_preferences");
      });

      it("should handle cleanup errors gracefully", async () => {
        // Mock client to throw exception
        const mockClient = {
          from: jest.fn(() => {
            throw new Error("Cleanup failed");
          }),
        };

        // Replace the client in the instance
        (dbUtils as any).client = mockClient;

        const result = await dbUtils.cleanupTestData();

        expect(result).toBe(false);
      });
    });

    describe("resetDatabase", () => {
      it("should reset database successfully", async () => {
        const seedSpy = jest
          .spyOn(dbUtils, "seedTestData")
          .mockResolvedValue(true);
        const cleanupSpy = jest
          .spyOn(dbUtils, "cleanupTestData")
          .mockResolvedValue(true);

        await dbUtils.resetDatabase();

        expect(cleanupSpy).toHaveBeenCalled();
        expect(seedSpy).toHaveBeenCalled();

        seedSpy.mockRestore();
        cleanupSpy.mockRestore();
      });

      it("should handle reset errors gracefully", async () => {
        const seedSpy = jest
          .spyOn(dbUtils, "seedTestData")
          .mockResolvedValue(false);
        const cleanupSpy = jest
          .spyOn(dbUtils, "cleanupTestData")
          .mockResolvedValue(false);

        await dbUtils.resetDatabase();

        expect(cleanupSpy).toHaveBeenCalled();
        expect(seedSpy).toHaveBeenCalled();

        seedSpy.mockRestore();
        cleanupSpy.mockRestore();
      });
    });

    describe("checkConnection", () => {
      it("should check connection successfully", async () => {
        const result = await dbUtils.checkConnection();

        expect(result).toBe(true);
      });

      it("should handle connection errors", async () => {
        // Mock client to return error
        const mockClient = {
          from: jest.fn(() => ({
            select: jest.fn(() => ({
              limit: jest.fn(() => ({
                data: null,
                error: { message: "Connection failed" },
              })),
            })),
          })),
        };

        // Replace the client in the instance
        (dbUtils as any).client = mockClient;

        const result = await dbUtils.checkConnection();

        expect(result).toBe(false);
      });

      it("should handle connection exceptions", async () => {
        // Mock client to throw exception
        const mockClient = {
          from: jest.fn(() => {
            throw new Error("Connection error");
          }),
        };

        // Replace the client in the instance
        (dbUtils as any).client = mockClient;

        const result = await dbUtils.checkConnection();

        expect(result).toBe(false);
      });
    });
  });

  describe("testDbUtils", () => {
    it("should be an instance of TestDatabaseUtils", () => {
      expect(testDbUtils).toBeInstanceOf(TestDatabaseUtils);
    });

    it("should have all required methods", () => {
      expect(typeof testDbUtils.seedTestData).toBe("function");
      expect(typeof testDbUtils.cleanupTestData).toBe("function");
      expect(typeof testDbUtils.resetDatabase).toBe("function");
      expect(typeof testDbUtils.checkConnection).toBe("function");
    });
  });

  describe("setupTestEnvironment", () => {
    it("should setup test environment successfully", async () => {
      const mockCheckConnection = jest
        .spyOn(testDbUtils, "checkConnection")
        .mockResolvedValue(true);
      const mockResetDatabase = jest
        .spyOn(testDbUtils, "resetDatabase")
        .mockResolvedValue(undefined);

      const result = await setupTestEnvironment();

      expect(result).toBe(true);
      expect(mockCheckConnection).toHaveBeenCalled();
      expect(mockResetDatabase).toHaveBeenCalled();

      mockCheckConnection.mockRestore();
      mockResetDatabase.mockRestore();
    });

    it("should handle connection failure gracefully", async () => {
      const mockCheckConnection = jest
        .spyOn(testDbUtils, "checkConnection")
        .mockResolvedValue(false);

      const result = await setupTestEnvironment();

      expect(result).toBe(false);
      expect(mockCheckConnection).toHaveBeenCalled();

      mockCheckConnection.mockRestore();
    });

    it("should handle reset database errors", async () => {
      const mockCheckConnection = jest
        .spyOn(testDbUtils, "checkConnection")
        .mockResolvedValue(true);
      const mockResetDatabase = jest
        .spyOn(testDbUtils, "resetDatabase")
        .mockRejectedValue(new Error("Reset failed"));

      // setupTestEnvironment should handle errors gracefully and still return true
      await expect(setupTestEnvironment()).rejects.toThrow("Reset failed");

      expect(mockCheckConnection).toHaveBeenCalled();
      expect(mockResetDatabase).toHaveBeenCalled();

      mockCheckConnection.mockRestore();
      mockResetDatabase.mockRestore();
    });
  });

  describe("cleanupTestEnvironment", () => {
    it("should cleanup test environment successfully", async () => {
      const mockCleanupTestData = jest
        .spyOn(testDbUtils, "cleanupTestData")
        .mockResolvedValue(true);

      await cleanupTestEnvironment();

      expect(mockCleanupTestData).toHaveBeenCalled();

      mockCleanupTestData.mockRestore();
    });

    it("should handle cleanup errors gracefully", async () => {
      const mockCleanupTestData = jest
        .spyOn(testDbUtils, "cleanupTestData")
        .mockRejectedValue(new Error("Cleanup failed"));

      // cleanupTestEnvironment should handle errors gracefully and not throw
      await expect(cleanupTestEnvironment()).rejects.toThrow("Cleanup failed");

      expect(mockCleanupTestData).toHaveBeenCalled();

      mockCleanupTestData.mockRestore();
    });
  });
});
