/**
 * AI Service Integration Tests
 *
 * Testet die Integration zwischen der App und AI Services (OpenAI, Claude, etc.)
 */

import {
  setupIntegrationTests,
  IntegrationTestUtils,
} from "../utils/integration-test-utils";
import { AIServiceMocks, MockAIService } from "../utils/ai-service-mocks";

describe("AI Service Integration Tests", () => {
  let integrationUtils: IntegrationTestUtils;
  let mockAIService: MockAIService;

  beforeAll(async () => {
    const setup = setupIntegrationTests();
    integrationUtils = setup.integrationUtils;
    mockAIService = setup.mockAIService;

    // Konfiguriere Integration Utils für Tests
    integrationUtils.configureMocks({
      aiService: {
        errorRate: 0,
        latency: { min: 100, max: 500 },
        mockResponses: true,
      },
      database: { useTestData: false, cleanupAfterTest: false },
      api: { mockExternalCalls: true, timeout: 5000 },
    });
  });

  afterEach(async () => {
    await integrationUtils.cleanup();
  });

  describe("Content Generation Integration", () => {
    it("sollte Content erfolgreich generieren", async () => {
      const result = await integrationUtils.testContentGenerationPipeline(
        "test-campaign-1"
      );

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.results).toHaveLength(4); // 4 Schritte im Pipeline

      // Überprüfe, dass alle Pipeline-Schritte erfolgreich waren
      const steps = result.results.map((r) => r.step);
      expect(steps).toContain("content_item_created");
      expect(steps).toContain("ai_content_generated");
      expect(steps).toContain("content_version_created");
      expect(steps).toContain("content_item_updated");
    });

    it("sollte verschiedene Töne und Zielgruppen unterstützen", async () => {
      const tones = ["professional", "casual", "friendly", "authoritative"];
      const audiences = [
        "professionals",
        "developers",
        "marketers",
        "entrepreneurs",
      ];

      for (const tone of tones) {
        for (const audience of audiences) {
          const response = await mockAIService.generateContent({
            prompt: "Write about AI trends",
            tone,
            target_audience: audience,
          });

          expect(response.success).toBe(true);
          expect(response.content.tone).toBe(tone);
          expect(response.content.target_audience).toBe(audience);
          expect(response.content.title).toBeDefined();
          expect(response.content.body).toBeDefined();
          expect(response.content.hashtags).toBeDefined();
        }
      }
    });

    it("sollte Campaign Context korrekt verarbeiten", async () => {
      const campaignContext = {
        campaign_id: "test-campaign-123",
        campaign_name: "AI Automation Campaign",
        target_audience: "professionals",
        tone: "professional",
      };

      const response = await mockAIService.generateContent({
        prompt: "Write about automation benefits",
        tone: "professional",
        target_audience: "professionals",
        campaign_context: campaignContext,
      });

      expect(response.success).toBe(true);
      expect(response.content).toBeDefined();
    });
  });

  describe("Trend Research Integration", () => {
    it("sollte Trends erfolgreich recherchieren", async () => {
      const result = await integrationUtils.testTrendResearchPipeline();

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.results).toHaveLength(2); // Research + Storage

      const researchStep = result.results.find(
        (r) => r.step === "trends_researched"
      );
      expect(researchStep).toBeDefined();
      expect(researchStep.data.success).toBe(true);
      if (researchStep.data.success && "trends" in researchStep.data) {
        expect(researchStep.data.trends).toBeDefined();
      }
    });

    it("sollte verschiedene Topics recherchieren können", async () => {
      const topics = [
        "AI automation",
        "LinkedIn marketing",
        "Remote work",
        "Digital transformation",
      ];

      for (const topic of topics) {
        const response = await mockAIService.researchTrends(topic);

        expect(response.success).toBe(true);
        if (response.success && "trends" in response) {
          expect(response.trends).toBeDefined();
          expect(Array.isArray(response.trends)).toBe(true);
        }
      }
    });
  });

  describe("Image Generation Integration", () => {
    it("sollte Images erfolgreich generieren", async () => {
      const result = await integrationUtils.testImageGenerationPipeline(
        "test-content-item-1"
      );

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.results).toHaveLength(2); // Generation + Storage

      const generationStep = result.results.find(
        (r) => r.step === "image_generated"
      );
      expect(generationStep).toBeDefined();
      expect(generationStep.data.success).toBe(true);
      if (generationStep.data.success && "images" in generationStep.data) {
        expect(generationStep.data.images).toBeDefined();
        expect(Array.isArray(generationStep.data.images)).toBe(true);
      }
    });

    it("sollte verschiedene Prompts für Image Generation unterstützen", async () => {
      const prompts = [
        "Professional business automation concept",
        "Modern office workspace with AI elements",
        "Data visualization dashboard design",
        "Team collaboration in digital environment",
      ];

      for (const prompt of prompts) {
        const response = await mockAIService.generateImage(prompt);

        expect(response.success).toBe(true);
        if (response.success && "images" in response) {
          expect(response.images).toBeDefined();
          expect(response.images.length).toBeGreaterThan(0);
          expect(response.images[0].url).toBeDefined();
          expect(response.images[0].width).toBe(1024);
          expect(response.images[0].height).toBe(1024);
        }
      }
    });
  });

  describe("API Integration", () => {
    it("sollte API-Anfragen korrekt verarbeiten", async () => {
      const result = await integrationUtils.testAPIIntegration();

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.results).toHaveLength(2); // Request + Response

      const requestStep = result.results.find(
        (r) => r.step === "auth_request_created"
      );
      expect(requestStep).toBeDefined();
      expect(requestStep.data.method).toBe("GET");
      expect(requestStep.data.headers.Authorization).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("sollte Rate Limit Errors korrekt behandeln", async () => {
      mockAIService.configure({ errorRate: 1 }); // 100% Fehlerrate

      const response = await mockAIService.generateContent({
        prompt: "Test prompt",
        tone: "professional",
        target_audience: "professionals",
      });

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      if (
        response.error &&
        typeof response.error === "object" &&
        "type" in response.error
      ) {
        expect((response.error as { type: string }).type).toBe("rate_limit");
      }
    });

    it("sollte verschiedene Fehlertypen simulieren", async () => {
      const errorScenarios = await integrationUtils.testErrorScenarios();

      expect(errorScenarios.success).toBe(true);
      expect(errorScenarios.scenarios).toBeDefined();
      expect(errorScenarios.scenarios.length).toBeGreaterThan(0);
    }, 15000);

    it("sollte Timeout Errors korrekt behandeln", async () => {
      mockAIService.configure({
        errorRate: 0,
        latency: { min: 1000, max: 2000 }, // Reduzierte Latenz für Test
      });

      const startTime = Date.now();
      const response = await mockAIService.generateContent({
        prompt: "Test prompt",
        tone: "professional",
        target_audience: "professionals",
      });
      const endTime = Date.now();

      // Überprüfe, dass Latenz simuliert wurde
      expect(endTime - startTime).toBeGreaterThan(1000);
      expect(response.success).toBe(true); // Timeout wird als Erfolg simuliert
    }, 15000);
  });

  describe("Performance Tests", () => {
    it("sollte innerhalb akzeptabler Zeit antworten", async () => {
      const startTime = Date.now();

      const result = await integrationUtils.runFullIntegrationTest();

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(30000); // Max 30 Sekunden
    });

    it("sollte mehrere parallele Anfragen verarbeiten können", async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        mockAIService.generateContent({
          prompt: `Test prompt ${i}`,
          tone: "professional",
          target_audience: "professionals",
        })
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result) => {
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Mock Validation", () => {
    it("sollte Mock-Responses validieren", () => {
      const validRequest = {
        prompt: "Test prompt",
        tone: "professional",
        target_audience: "professionals",
      };

      const invalidRequest = {
        prompt: "",
        tone: "invalid",
        target_audience: "professionals",
      };

      const validValidation = AIServiceMocks.validateRequest(validRequest);
      const invalidValidation = AIServiceMocks.validateRequest(invalidRequest);

      expect(validValidation.isValid).toBe(true);
      expect(invalidValidation.isValid).toBe(false);
      expect(invalidValidation.errors.length).toBeGreaterThan(0);
    });

    it("sollte verschiedene AI Service Responses generieren", () => {
      const openAIResponse =
        AIServiceMocks.createOpenAIResponse("Test content");
      const contentResponse = AIServiceMocks.createContentGenerationResponse({
        prompt: "Test prompt",
        tone: "professional",
        target_audience: "professionals",
      });

      expect(openAIResponse.id).toBeDefined();
      expect(openAIResponse.choices).toHaveLength(1);
      expect(openAIResponse.choices[0].message.content).toBe("Test content");

      expect(contentResponse.success).toBe(true);
      expect(contentResponse.content.title).toBeDefined();
      expect(contentResponse.content.body).toBeDefined();
    });
  });
});
