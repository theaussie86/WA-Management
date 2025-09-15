// Simplified API test utilities without NextRequest dependency

// API test utilities
export class ApiTestUtils {
  static createMockRequest(
    options: {
      method?: string;
      url?: string;
      headers?: Record<string, string>;
      body?: any;
      searchParams?: Record<string, string>;
    } = {}
  ) {
    const {
      method = "GET",
      url = "http://localhost:3000/api/test",
      headers = {},
      body,
      searchParams = {},
    } = options;

    const urlObj = new URL(url);
    Object.entries(searchParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });

    return {
      method,
      url: urlObj.toString(),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };
  }

  static createAuthenticatedRequest(
    options: {
      method?: string;
      url?: string;
      headers?: Record<string, string>;
      body?: any;
      searchParams?: Record<string, string>;
      user?: any;
    } = {}
  ) {
    const {
      user = { id: "test-user-id", email: "test@example.com" },
      ...rest
    } = options;

    return this.createMockRequest({
      ...rest,
      headers: {
        ...rest.headers,
        Authorization: `Bearer test-jwt-token`,
        "X-User-Id": user.id,
        "X-User-Email": user.email,
      },
    });
  }

  static expectApiResponse(response: Response, expectedStatus: number) {
    expect(response.status).toBe(expectedStatus);
    return response;
  }

  static async expectJsonResponse(response: Response, expectedData?: any) {
    const data = await response.json();
    expect(data).toBeDefined();

    if (expectedData) {
      expect(data).toMatchObject(expectedData);
    }

    return data;
  }

  static expectErrorResponse(data: any, expectedError?: string) {
    expect(data.error).toBeDefined();
    expect(data.data).toBeUndefined();

    if (expectedError) {
      expect(data.error).toContain(expectedError);
    }

    return data;
  }

  static expectSuccessResponse(data: any, expectedData?: any) {
    expect(data.error).toBeUndefined();
    expect(data.data).toBeDefined();

    if (expectedData) {
      expect(data.data).toMatchObject(expectedData);
    }

    return data;
  }
}

// Mock API responses
export const mockApiResponses = {
  campaigns: {
    list: {
      data: [
        {
          id: "campaign-1",
          name: "Test Campaign 1",
          description: "Test description",
          target_audience: "Test audience",
          messaging_tone: "Professional",
          content_themes: ["Technology"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: "test-user-id",
        },
      ],
      error: null,
      message: "Campaigns retrieved successfully",
    },

    create: {
      data: {
        id: "new-campaign-id",
        name: "New Campaign",
        description: "New campaign description",
        target_audience: "New audience",
        messaging_tone: "Casual",
        content_themes: ["Innovation"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "test-user-id",
      },
      error: null,
      message: "Campaign created successfully",
    },

    error: {
      data: null,
      error: "Campaign not found",
      message: "The requested campaign could not be found",
    },
  },

  content: {
    list: {
      data: [
        {
          id: "content-1",
          campaign_id: "campaign-1",
          title: "Test Content",
          content_type: "linkedin_post",
          pipeline_state: "draft",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: "test-user-id",
        },
      ],
      error: null,
      message: "Content items retrieved successfully",
    },

    create: {
      data: {
        id: "new-content-id",
        campaign_id: "campaign-1",
        title: "New Content",
        content_type: "linkedin_post",
        pipeline_state: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "test-user-id",
      },
      error: null,
      message: "Content item created successfully",
    },
  },
};

// Webhook test utilities
export class WebhookTestUtils {
  static createN8nWebhookRequest(payload: any) {
    return ApiTestUtils.createMockRequest({
      method: "POST",
      url: "http://localhost:3000/api/webhooks/n8n",
      headers: {
        "Content-Type": "application/json",
        "X-N8N-Signature": "test-signature",
      },
      body: payload,
    });
  }

  static createMockN8nPayload(
    options: {
      workflowId?: string;
      executionId?: string;
      data?: any;
    } = {}
  ) {
    const {
      workflowId = "test-workflow-id",
      executionId = "test-execution-id",
      data = {},
    } = options;

    return {
      workflow_id: workflowId,
      execution_id: executionId,
      timestamp: new Date().toISOString(),
      data: {
        content: "Generated content from n8n workflow",
        metadata: {
          model: "gpt-4",
          tokens_used: 150,
          processing_time_ms: 2000,
        },
        ...data,
      },
    };
  }

  static expectWebhookResponse(
    response: Response,
    expectedStatus: number = 200
  ) {
    expect(response.status).toBe(expectedStatus);
    return response;
  }
}

// AI service test utilities
export class AIServiceTestUtils {
  static createMockAIRequest(prompt: string, options: any = {}) {
    return {
      prompt,
      model: options.model || "gpt-4",
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
      ...options,
    };
  }

  static createMockAIResponse(content: string, options: any = {}) {
    return {
      success: true,
      content,
      metadata: {
        model: options.model || "gpt-4",
        tokens_used: options.tokensUsed || 150,
        processing_time_ms: options.processingTime || 2000,
        finish_reason: options.finishReason || "stop",
      },
      timestamp: new Date().toISOString(),
    };
  }

  static createMockAIError(error: string, code: string = "AI_ERROR") {
    return {
      success: false,
      error: {
        code,
        message: error,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

// Tests for API utilities
describe("ApiTestUtils", () => {
  it("should create mock request", () => {
    const request = ApiTestUtils.createMockRequest({
      method: "POST",
      url: "http://localhost:3000/api/test",
      body: { test: "data" },
    });

    expect(request).toBeDefined();
    expect(request.method).toBe("POST");
  });

  it("should create authenticated request", () => {
    const request = ApiTestUtils.createAuthenticatedRequest({
      method: "GET",
      url: "http://localhost:3000/api/campaigns",
      user: { id: "test-user", email: "test@example.com" },
    });

    expect(request).toBeDefined();
    expect((request.headers as any)["Authorization"]).toBe(
      "Bearer test-jwt-token"
    );
  });

  it("should have mock API responses", () => {
    expect(mockApiResponses.campaigns.list).toBeDefined();
    expect(mockApiResponses.campaigns.create).toBeDefined();
    expect(mockApiResponses.campaigns.error).toBeDefined();
    expect(mockApiResponses.content.list).toBeDefined();
  });
});

describe("WebhookTestUtils", () => {
  it("should create n8n webhook request", () => {
    const request = WebhookTestUtils.createN8nWebhookRequest({
      test: "payload",
    });

    expect(request).toBeDefined();
    expect(request.method).toBe("POST");
  });

  it("should create mock n8n payload", () => {
    const payload = WebhookTestUtils.createMockN8nPayload({
      workflowId: "test-workflow",
      data: { content: "test" },
    });

    expect(payload).toBeDefined();
    expect(payload.workflow_id).toBe("test-workflow");
    expect(payload.data.content).toBe("test");
  });
});

describe("AIServiceTestUtils", () => {
  it("should create mock AI request", () => {
    const request = AIServiceTestUtils.createMockAIRequest("Test prompt", {
      model: "gpt-4",
      temperature: 0.7,
    });

    expect(request).toBeDefined();
    expect(request.prompt).toBe("Test prompt");
    expect(request.model).toBe("gpt-4");
  });

  it("should create mock AI response", () => {
    const response = AIServiceTestUtils.createMockAIResponse(
      "Generated content",
      {
        model: "gpt-4",
        tokensUsed: 150,
      }
    );

    expect(response).toBeDefined();
    expect(response.success).toBe(true);
    expect(response.content).toBe("Generated content");
    expect(response.metadata.model).toBe("gpt-4");
  });

  it("should create mock AI error", () => {
    const error = AIServiceTestUtils.createMockAIError(
      "Test error",
      "TEST_ERROR"
    );

    expect(error).toBeDefined();
    expect(error.success).toBe(false);
    expect(error.error.message).toBe("Test error");
    expect(error.error.code).toBe("TEST_ERROR");
  });
});
