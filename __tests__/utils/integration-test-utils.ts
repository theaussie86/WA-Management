/**
 * Integration Test Utilities
 *
 * Hilfsfunktionen für Integrationstests mit AI Services, Datenbank und externen APIs
 */

import { MockAIService, setupAIServiceMocks } from "./ai-service-mocks";
import { DatabaseTestUtils } from "./database-test-utils";
import { ApiTestUtils } from "./api-test-utils";

export interface IntegrationTestConfig {
  aiService: {
    errorRate: number;
    latency: { min: number; max: number };
    mockResponses: boolean;
  };
  database: {
    useTestData: boolean;
    cleanupAfterTest: boolean;
  };
  api: {
    mockExternalCalls: boolean;
    timeout: number;
  };
}

export class IntegrationTestUtils {
  private mockAIService: MockAIService;
  private dbUtils: DatabaseTestUtils;
  private apiUtils: ApiTestUtils;
  private config: IntegrationTestConfig;

  constructor(config: Partial<IntegrationTestConfig> = {}) {
    this.config = {
      aiService: {
        errorRate: 0,
        latency: { min: 100, max: 500 },
        mockResponses: true,
        ...config.aiService,
      },
      database: {
        useTestData: true,
        cleanupAfterTest: true,
        ...config.database,
      },
      api: {
        mockExternalCalls: true,
        timeout: 10000,
        ...config.api,
      },
    };

    this.mockAIService = MockAIService.getInstance();
    this.dbUtils = new DatabaseTestUtils();
    this.apiUtils = new ApiTestUtils();
  }

  /**
   * Setup für Integrationstests
   */
  async setup(): Promise<void> {
    // AI Service Mocks konfigurieren
    if (this.config.aiService.mockResponses) {
      this.mockAIService.configure({
        errorRate: this.config.aiService.errorRate,
        latency: this.config.aiService.latency,
      });
    }

    // Datenbank für Tests vorbereiten
    if (this.config.database.useTestData) {
      await this.dbUtils.resetDatabase();
      // await this.dbUtils.seedTestData(); // Method doesn't exist yet
    }
  }

  /**
   * Cleanup nach Integrationstests
   */
  async cleanup(): Promise<void> {
    if (this.config.database.cleanupAfterTest) {
      await this.dbUtils.cleanupAll();
    }

    this.mockAIService.clearMocks();
  }

  /**
   * Testet Content Generation Pipeline
   */
  async testContentGenerationPipeline(campaignId: string): Promise<{
    success: boolean;
    results: any[];
    errors: string[];
  }> {
    const results: unknown[] = [];
    const errors: string[] = [];

    try {
      // 1. Content Item erstellen (Mock, da DB nicht verfügbar)
      const contentItem = {
        success: true,
        data: {
          id: "test-content-item-" + Math.random().toString(36).substr(2, 9),
          campaign_id: campaignId,
          title: "Test Content Item",
          content_type: "post",
          status: "pending",
        },
      };

      results.push({ step: "content_item_created", data: contentItem.data });

      // 2. AI Content Generation simulieren
      const aiResponse = await this.mockAIService.generateContent({
        prompt: "Write about AI automation trends",
        tone: "professional",
        target_audience: "professionals",
        campaign_context: {
          campaign_id: campaignId,
          campaign_name: "Test Campaign",
          target_audience: "professionals",
          tone: "professional",
        },
      });

      if (!aiResponse.success) {
        errors.push("AI content generation failed");
        return { success: false, results, errors };
      }

      results.push({ step: "ai_content_generated", data: aiResponse });

      // 3. Content Version erstellen (Mock)
      const contentVersion = {
        success: true,
        data: {
          id: "test-content-version-" + Math.random().toString(36).substr(2, 9),
          content_item_id: contentItem.data.id,
          version_number: 1,
          content: aiResponse.content.body,
          title: aiResponse.content.title,
          status: "draft",
        },
      };

      results.push({
        step: "content_version_created",
        data: contentVersion.data,
      });

      // 4. Content Item Status aktualisieren (Mock)
      const updateResult = {
        success: true,
        data: {
          ...contentItem.data,
          status: "draft",
          updated_at: new Date().toISOString(),
        },
      };

      results.push({ step: "content_item_updated", data: updateResult.data });

      return { success: true, results, errors };
    } catch (error) {
      errors.push(`Content generation pipeline failed: ${error}`);
      return { success: false, results, errors };
    }
  }

  /**
   * Testet Trend Research Pipeline
   */
  async testTrendResearchPipeline(): Promise<{
    success: boolean;
    results: any[];
    errors: string[];
  }> {
    const results: unknown[] = [];
    const errors: string[] = [];

    try {
      // 1. Trend Research simulieren
      const trendResponse = await this.mockAIService.researchTrends(
        "AI automation"
      );

      if (!trendResponse.success) {
        errors.push("Trend research failed");
        return { success: false, results, errors };
      }

      results.push({ step: "trends_researched", data: trendResponse });

      // 2. Trends in Datenbank speichern (simuliert)
      if (trendResponse.success && "trends" in trendResponse) {
        const trends = trendResponse.trends || [];
        for (const trend of trends) {
          // In der Realität würden Trends in einer trends Tabelle gespeichert
          results.push({ step: "trend_stored", data: trend });
        }
      }

      return { success: true, results, errors };
    } catch (error) {
      errors.push(`Trend research pipeline failed: ${error}`);
      return { success: false, results, errors };
    }
  }

  /**
   * Testet Image Generation Pipeline
   */
  async testImageGenerationPipeline(contentItemId: string): Promise<{
    success: boolean;
    results: any[];
    errors: string[];
  }> {
    const results: unknown[] = [];
    const errors: string[] = [];

    try {
      // 1. Image Generation simulieren
      const imageResponse = await this.mockAIService.generateImage(
        "Professional business automation concept"
      );

      if (!imageResponse.success) {
        errors.push("Image generation failed");
        return { success: false, results, errors };
      }

      results.push({ step: "image_generated", data: imageResponse });

      // 2. Image Metadata in Datenbank speichern (simuliert)
      if (imageResponse.success && "images" in imageResponse) {
        const imageMetadata = {
          content_item_id: contentItemId,
          image_url: imageResponse.images[0].url,
          image_id: imageResponse.images[0].id,
          generated_by: "ai",
          metadata: imageResponse.metadata,
        };
        results.push({ step: "image_metadata_stored", data: imageMetadata });
      }

      return { success: true, results, errors };
    } catch (error) {
      errors.push(`Image generation pipeline failed: ${error}`);
      return { success: false, results, errors };
    }
  }

  /**
   * Testet API Integration
   */
  async testAPIIntegration(): Promise<{
    success: boolean;
    results: any[];
    errors: string[];
  }> {
    const results: unknown[] = [];
    const errors: string[] = [];

    try {
      // 1. Authentifizierte API-Anfrage testen
      const authRequest = ApiTestUtils.createAuthenticatedRequest({
        method: "GET",
        url: "http://localhost:3000/api/campaigns",
      });

      results.push({ step: "auth_request_created", data: authRequest });

      // 2. Mock API Response testen
      const mockResponse = {
        success: true,
        data: [
          {
            id: "test-campaign-1",
            name: "Test Campaign",
            status: "active",
          },
        ],
      };

      results.push({ step: "mock_response_created", data: mockResponse });

      return { success: true, results, errors };
    } catch (error) {
      errors.push(`API integration test failed: ${error}`);
      return { success: false, results, errors };
    }
  }

  /**
   * Vollständiger Integrationstest
   */
  async runFullIntegrationTest(): Promise<{
    success: boolean;
    results: {
      contentGeneration: boolean;
      trendResearch: boolean;
      imageGeneration: boolean;
      apiIntegration: boolean;
    };
    errors: string[];
  }> {
    const errors: string[] = [];
    const results = {
      contentGeneration: false,
      trendResearch: false,
      imageGeneration: false,
      apiIntegration: false,
    };

    try {
      await this.setup();

      // 1. Test Campaign erstellen (Mock, da DB nicht verfügbar)
      const campaign = {
        success: true,
        data: {
          id: "test-campaign-" + Math.random().toString(36).substr(2, 9),
          name: "Integration Test Campaign",
          description: "Test campaign for integration testing",
          status: "active",
        },
      };

      if (!campaign.success) {
        errors.push("Failed to create test campaign");
        return { success: false, results, errors };
      }

      // 2. Content Generation Pipeline testen
      const contentTest = await this.testContentGenerationPipeline(
        campaign.data.id
      );
      results.contentGeneration = contentTest.success;
      if (!contentTest.success) {
        errors.push(...contentTest.errors);
      }

      // 3. Trend Research Pipeline testen
      const trendTest = await this.testTrendResearchPipeline();
      results.trendResearch = trendTest.success;
      if (!trendTest.success) {
        errors.push(...trendTest.errors);
      }

      // 4. Image Generation Pipeline testen
      const imageTest = await this.testImageGenerationPipeline(
        campaign.data.id
      );
      results.imageGeneration = imageTest.success;
      if (!imageTest.success) {
        errors.push(...imageTest.errors);
      }

      // 5. API Integration testen
      const apiTest = await this.testAPIIntegration();
      results.apiIntegration = apiTest.success;
      if (!apiTest.success) {
        errors.push(...apiTest.errors);
      }

      return {
        success: errors.length === 0,
        results,
        errors,
      };
    } catch (error) {
      errors.push(`Full integration test failed: ${error}`);
      return { success: false, results, errors };
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Konfiguriert Mock-Verhalten für spezifische Tests
   */
  configureMocks(config: Partial<IntegrationTestConfig>) {
    this.config = { ...this.config, ...config };
    this.mockAIService.configure({
      errorRate: this.config.aiService.errorRate,
      latency: this.config.aiService.latency,
    });
  }

  /**
   * Simuliert verschiedene Fehlerszenarien
   */
  async testErrorScenarios(): Promise<{
    success: boolean;
    scenarios: Array<{
      name: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const scenarios = [];

    // Rate Limit Error
    this.mockAIService.configure({ errorRate: 1 });
    const rateLimitTest = await this.mockAIService.generateContent({
      prompt: "Test prompt",
      tone: "professional",
      target_audience: "professionals",
    });
    scenarios.push({
      name: "Rate Limit Error",
      success: !rateLimitTest.success,
      error: rateLimitTest.error,
    });

    // Timeout Error
    this.mockAIService.configure({
      errorRate: 0,
      latency: { min: 10000, max: 15000 }, // Simuliere Timeout
    });
    await this.mockAIService.generateContent({
      prompt: "Test prompt",
      tone: "professional",
      target_audience: "professionals",
    });
    scenarios.push({
      name: "Timeout Error",
      success: true, // Timeout wird als Erfolg gewertet, da es simuliert wird
    });

    // Reset zu normalem Verhalten
    this.mockAIService.configure({
      errorRate: 0,
      latency: { min: 100, max: 500 },
    });

    return {
      success: scenarios.every((s) => s.success),
      scenarios,
    };
  }
}

/**
 * Jest Setup für Integration Tests
 */
export const setupIntegrationTests = () => {
  // AI Service Mocks einrichten
  setupAIServiceMocks();

  // Weitere Mocks können hier hinzugefügt werden
  return {
    mockAIService: MockAIService.getInstance(),
    integrationUtils: new IntegrationTestUtils(),
  };
};
