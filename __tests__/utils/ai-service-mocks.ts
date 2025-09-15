/**
 * AI Service Mock Utilities
 *
 * Mock-Implementierungen für AI-Services (OpenAI, Claude, etc.) für Integrationstests
 */

export interface MockAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface MockContentGenerationRequest {
  prompt: string;
  tone: string;
  target_audience: string;
  campaign_context?: {
    campaign_id: string;
    campaign_name: string;
    target_audience: string;
    tone: string;
  };
  max_tokens?: number;
  temperature?: number;
}

export interface MockContentGenerationResponse {
  success: boolean;
  content: {
    title: string;
    body: string;
    hashtags: string[];
    call_to_action: string;
    tone: string;
    target_audience: string;
  };
  metadata: {
    model_used: string;
    tokens_used: number;
    generation_time_ms: number;
    confidence_score: number;
  };
  error?: string;
}

export class AIServiceMocks {
  /**
   * Generiert Mock-Response für OpenAI Chat Completions
   */
  static createOpenAIResponse(
    content: string,
    model: string = "gpt-4",
    tokens: { prompt: number; completion: number } = {
      prompt: 50,
      completion: 100,
    }
  ): MockAIResponse {
    return {
      id: `chatcmpl-${Math.random().toString(36).substr(2, 9)}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content,
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: tokens.prompt,
        completion_tokens: tokens.completion,
        total_tokens: tokens.prompt + tokens.completion,
      },
    };
  }

  /**
   * Generiert Mock-Response für Content Generation
   */
  static createContentGenerationResponse(
    request: MockContentGenerationRequest
  ): MockContentGenerationResponse {
    const { prompt, tone, target_audience } = request;

    // Simuliere verschiedene Content-Typen basierend auf Prompt
    const contentTemplates = this.getContentTemplates(tone);
    const template =
      contentTemplates[Math.floor(Math.random() * contentTemplates.length)];

    const generatedContent = this.generateContentFromTemplate(
      template,
      prompt,
      tone,
      target_audience
    );

    return {
      success: true,
      content: generatedContent,
      metadata: {
        model_used: "gpt-4",
        tokens_used: Math.floor(Math.random() * 200) + 100,
        generation_time_ms: Math.floor(Math.random() * 2000) + 500,
        confidence_score: Math.random() * 0.3 + 0.7, // 0.7-1.0
      },
    };
  }

  /**
   * Generiert Mock-Response für Trend Research
   */
  static createTrendResearchResponse(topic: string) {
    const trends = [
      {
        topic: "AI Automation",
        trend_score: 0.85,
        search_volume: 12000,
        growth_rate: 0.23,
        related_keywords: ["automation", "AI", "workflow", "efficiency"],
        sentiment: "positive",
        source: "Google Trends",
        last_updated: new Date().toISOString(),
      },
      {
        topic: "LinkedIn Marketing",
        trend_score: 0.72,
        search_volume: 8500,
        growth_rate: 0.15,
        related_keywords: [
          "social media",
          "B2B",
          "content marketing",
          "engagement",
        ],
        sentiment: "positive",
        source: "Google Trends",
        last_updated: new Date().toISOString(),
      },
      {
        topic: "Remote Work",
        trend_score: 0.68,
        search_volume: 15000,
        growth_rate: 0.08,
        related_keywords: [
          "hybrid work",
          "productivity",
          "collaboration",
          "flexibility",
        ],
        sentiment: "neutral",
        source: "Google Trends",
        last_updated: new Date().toISOString(),
      },
    ];

    return {
      success: true,
      trends: trends.filter(
        (t) =>
          t.topic.toLowerCase().includes(topic.toLowerCase()) ||
          t.related_keywords.some((k) =>
            k.toLowerCase().includes(topic.toLowerCase())
          )
      ),
      metadata: {
        total_trends: trends.length,
        research_time_ms: Math.floor(Math.random() * 3000) + 1000,
        sources_checked: [
          "Google Trends",
          "LinkedIn Insights",
          "Industry Reports",
        ],
      },
    };
  }

  /**
   * Generiert Mock-Response für Image Generation
   */
  static createImageGenerationResponse(prompt: string) {
    return {
      success: true,
      images: [
        {
          id: `img-${Math.random().toString(36).substr(2, 9)}`,
          url: `https://mock-images.example.com/generated/${Math.random()
            .toString(36)
            .substr(2, 9)}.png`,
          width: 1024,
          height: 1024,
          format: "png",
          size_bytes: Math.floor(Math.random() * 500000) + 100000,
        },
      ],
      metadata: {
        model_used: "dall-e-3",
        generation_time_ms: Math.floor(Math.random() * 5000) + 2000,
        prompt_enhanced: `Enhanced: ${prompt} - professional, high-quality, business-focused`,
      },
    };
  }

  /**
   * Generiert Mock-Error Response
   */
  static createErrorResponse(
    errorType: "rate_limit" | "invalid_request" | "server_error" | "timeout",
    message?: string
  ) {
    const errorMessages = {
      rate_limit: "Rate limit exceeded. Please try again later.",
      invalid_request: "Invalid request parameters.",
      server_error: "Internal server error occurred.",
      timeout: "Request timed out. Please try again.",
    };

    return {
      success: false,
      error: {
        type: errorType,
        message: message || errorMessages[errorType],
        code: this.getErrorCode(errorType),
        retry_after: errorType === "rate_limit" ? 60 : undefined,
      },
    };
  }

  /**
   * Simuliert AI Service Latenz
   */
  static async simulateLatency(
    minMs: number = 100,
    maxMs: number = 500
  ): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Validiert Mock Request
   */
  static validateRequest(request: MockContentGenerationRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!request.prompt || typeof request.prompt !== "string") {
      errors.push("Prompt is required and must be a string");
    }

    if (
      request.tone &&
      !["professional", "casual", "friendly", "authoritative"].includes(
        request.tone
      )
    ) {
      errors.push(
        "Tone must be one of: professional, casual, friendly, authoritative"
      );
    }

    if (
      request.max_tokens &&
      (request.max_tokens < 1 || request.max_tokens > 4000)
    ) {
      errors.push("Max tokens must be between 1 and 4000");
    }

    if (
      request.temperature &&
      (request.temperature < 0 || request.temperature > 2)
    ) {
      errors.push("Temperature must be between 0 and 2");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Private Helper Methods

  private static getContentTemplates(tone: string) {
    const templates = {
      professional: [
        {
          title: "The Future of {topic} in {industry}",
          body: "As we navigate the evolving landscape of {topic}, it's clear that {industry} professionals need to stay ahead of the curve. Here's what you need to know...",
          hashtags: ["#innovation", "#technology", "#business"],
          call_to_action: "What are your thoughts on this trend?",
        },
        {
          title: "Why {topic} Matters for {audience}",
          body: "In today's competitive market, understanding {topic} is crucial for {audience}. Let me share some insights that could transform your approach...",
          hashtags: ["#strategy", "#growth", "#leadership"],
          call_to_action: "Share your experience in the comments!",
        },
      ],
      casual: [
        {
          title: "Quick thought on {topic}",
          body: "Hey everyone! 👋 Just had an interesting conversation about {topic} and thought I'd share some quick insights...",
          hashtags: ["#thoughts", "#discussion", "#community"],
          call_to_action: "What do you think?",
        },
      ],
      friendly: [
        {
          title: "Let's talk about {topic}",
          body: "I've been thinking a lot about {topic} lately, and I wanted to share some thoughts with this amazing community...",
          hashtags: ["#community", "#sharing", "#insights"],
          call_to_action: "I'd love to hear your perspective!",
        },
      ],
      authoritative: [
        {
          title: "The Definitive Guide to {topic}",
          body: "After years of experience in {industry}, I can confidently say that {topic} is the key to success. Here's my comprehensive analysis...",
          hashtags: ["#expertise", "#analysis", "#insights"],
          call_to_action: "Questions? I'm here to help!",
        },
      ],
    };

    return templates[tone as keyof typeof templates] || templates.professional;
  }

  private static generateContentFromTemplate(
    template: {
      title: string;
      body: string;
      hashtags: string[];
      call_to_action: string;
    },
    prompt: string,
    tone: string,
    targetAudience: string
  ) {
    const topic = this.extractTopicFromPrompt(prompt);
    const industry = this.getIndustryFromAudience(targetAudience);

    return {
      title: template.title
        .replace("{topic}", topic)
        .replace("{industry}", industry)
        .replace("{audience}", targetAudience),
      body: template.body
        .replace(/{topic}/g, topic)
        .replace(/{industry}/g, industry)
        .replace(/{audience}/g, targetAudience),
      hashtags: template.hashtags,
      call_to_action: template.call_to_action,
      tone,
      target_audience: targetAudience,
    };
  }

  private static extractTopicFromPrompt(prompt: string): string {
    // Einfache Topic-Extraktion - in der Realität würde das komplexer sein
    const topics = [
      "AI",
      "Automation",
      "Marketing",
      "Technology",
      "Business",
      "Innovation",
    ];
    const foundTopic = topics.find((topic) =>
      prompt.toLowerCase().includes(topic.toLowerCase())
    );
    return foundTopic || "Technology";
  }

  private static getIndustryFromAudience(audience: string): string {
    const industryMap: Record<string, string> = {
      professionals: "business",
      developers: "technology",
      marketers: "marketing",
      entrepreneurs: "startup",
      executives: "corporate",
    };
    return industryMap[audience] || "business";
  }

  private static getErrorCode(errorType: string): string {
    const errorCodes = {
      rate_limit: "RATE_LIMIT_EXCEEDED",
      invalid_request: "INVALID_REQUEST",
      server_error: "INTERNAL_SERVER_ERROR",
      timeout: "REQUEST_TIMEOUT",
    };
    return errorCodes[errorType as keyof typeof errorCodes] || "UNKNOWN_ERROR";
  }
}

/**
 * Mock AI Service für Integrationstests
 */
export class MockAIService {
  private static instance: MockAIService;
  private responses: Map<string, unknown> = new Map();
  private errorRate: number = 0; // 0-1, Wahrscheinlichkeit für Fehler
  private latency: { min: number; max: number } = { min: 100, max: 500 };

  static getInstance(): MockAIService {
    if (!MockAIService.instance) {
      MockAIService.instance = new MockAIService();
    }
    return MockAIService.instance;
  }

  /**
   * Konfiguriert Mock-Verhalten
   */
  configure(options: {
    errorRate?: number;
    latency?: { min: number; max: number };
  }) {
    if (options.errorRate !== undefined) {
      this.errorRate = Math.max(0, Math.min(1, options.errorRate));
    }
    if (options.latency) {
      this.latency = options.latency;
    }
  }

  /**
   * Simuliert Content Generation
   */
  async generateContent(
    request: MockContentGenerationRequest
  ): Promise<MockContentGenerationResponse> {
    await AIServiceMocks.simulateLatency(this.latency.min, this.latency.max);

    // Simuliere Fehler basierend auf errorRate
    if (Math.random() < this.errorRate) {
      // Bei hoher Fehlerrate (1.0) simuliere rate_limit, sonst server_error
      const errorType = this.errorRate >= 1.0 ? "rate_limit" : "server_error";
      return AIServiceMocks.createErrorResponse(
        errorType
      ) as unknown as MockContentGenerationResponse;
    }

    return AIServiceMocks.createContentGenerationResponse(request);
  }

  /**
   * Simuliert Trend Research
   */
  async researchTrends(topic: string) {
    await AIServiceMocks.simulateLatency(this.latency.min, this.latency.max);

    if (Math.random() < this.errorRate) {
      return AIServiceMocks.createErrorResponse("timeout");
    }

    return AIServiceMocks.createTrendResearchResponse(topic);
  }

  /**
   * Simuliert Image Generation
   */
  async generateImage(prompt: string) {
    await AIServiceMocks.simulateLatency(
      this.latency.min * 2,
      this.latency.max * 3
    );

    if (Math.random() < this.errorRate) {
      return AIServiceMocks.createErrorResponse("rate_limit");
    }

    return AIServiceMocks.createImageGenerationResponse(prompt);
  }

  /**
   * Setzt Mock-Response für bestimmten Request
   */
  setMockResponse(key: string, response: unknown) {
    this.responses.set(key, response);
  }

  /**
   * Löscht alle Mock-Responses
   */
  clearMocks() {
    this.responses.clear();
    this.errorRate = 0;
    this.latency = { min: 100, max: 500 };
  }
}

/**
 * Jest Mock Setup für AI Services
 */
export const setupAIServiceMocks = () => {
  const mockAIService = MockAIService.getInstance();

  // Mock OpenAI (nur wenn Modul verfügbar ist)
  jest.mock(
    "openai",
    () => ({
      OpenAI: jest.fn().mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockImplementation(async (params) => {
              const response = await mockAIService.generateContent({
                prompt: params.messages[0].content,
                tone: "professional",
                target_audience: "professionals",
              });
              return AIServiceMocks.createOpenAIResponse(response.content.body);
            }),
          },
        },
      })),
    }),
    { virtual: true }
  );

  // Mock Anthropic Claude (nur wenn Modul verfügbar ist)
  jest.mock(
    "@anthropic-ai/sdk",
    () => ({
      Anthropic: jest.fn().mockImplementation(() => ({
        messages: {
          create: jest.fn().mockImplementation(async (params) => {
            const response = await mockAIService.generateContent({
              prompt: params.messages[0].content,
              tone: "professional",
              target_audience: "professionals",
            });
            return {
              id: `msg_${Math.random().toString(36).substr(2, 9)}`,
              content: [{ text: response.content.body }],
              model: "claude-3-sonnet-20240229",
              role: "assistant",
              stop_reason: "end_turn",
              usage: {
                input_tokens: 50,
                output_tokens: 100,
              },
            };
          }),
        },
      })),
    }),
    { virtual: true }
  );

  return mockAIService;
};
