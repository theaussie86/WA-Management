import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

// Mock @supabase/ssr
jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;

describe("Supabase Server Client - Additional Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY = "test-anon-key";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
  });

  it("should create client with correct environment variables", async () => {
    const mockCookieStore = {
      getAll: jest
        .fn()
        .mockReturnValue([{ name: "test-cookie", value: "test-value" }]),
      set: jest.fn(),
    };

    mockCookies.mockResolvedValue(mockCookieStore as any);

    const { createServerClient } = require("@supabase/ssr");
    const mockClient = { auth: { getUser: jest.fn() } };
    createServerClient.mockReturnValue(mockClient);

    await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
      {
        cookies: {
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        },
      }
    );
  });

  it("should handle getAll cookies correctly", async () => {
    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([
        { name: "cookie1", value: "value1" },
        { name: "cookie2", value: "value2" },
      ]),
      set: jest.fn(),
    };

    mockCookies.mockResolvedValue(mockCookieStore as any);

    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockImplementation(
      (url: string, key: string, config: any) => {
        // Test the getAll function
        const result = config.cookies.getAll();
        expect(result).toEqual([
          { name: "cookie1", value: "value1" },
          { name: "cookie2", value: "value2" },
        ]);
        return {};
      }
    );

    await createClient();
  });

  it("should handle setAll cookies with successful set", async () => {
    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([]),
      set: jest.fn(),
    };

    mockCookies.mockResolvedValue(mockCookieStore as any);

    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockImplementation(
      (url: string, key: string, config: any) => {
        // Test the setAll function
        const cookiesToSet = [
          { name: "cookie1", value: "value1", options: { httpOnly: true } },
          { name: "cookie2", value: "value2", options: { secure: true } },
        ];

        config.cookies.setAll(cookiesToSet);

        expect(mockCookieStore.set).toHaveBeenCalledWith("cookie1", "value1", {
          httpOnly: true,
        });
        expect(mockCookieStore.set).toHaveBeenCalledWith("cookie2", "value2", {
          secure: true,
        });

        return {};
      }
    );

    await createClient();
  });

  it("should handle setAll cookies with error gracefully", async () => {
    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([]),
      set: jest.fn().mockImplementation(() => {
        throw new Error("Cookie set failed");
      }),
    };

    mockCookies.mockResolvedValue(mockCookieStore as any);

    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockImplementation(
      (url: string, key: string, config: any) => {
        // Test the setAll function with error
        const cookiesToSet = [
          { name: "cookie1", value: "value1", options: {} },
        ];

        // Should not throw error
        expect(() => {
          config.cookies.setAll(cookiesToSet);
        }).not.toThrow();

        return {};
      }
    );

    await createClient();
  });

  it("should handle empty cookies array in setAll", async () => {
    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([]),
      set: jest.fn(),
    };

    mockCookies.mockResolvedValue(mockCookieStore as any);

    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockImplementation(
      (url: string, key: string, config: any) => {
        // Test the setAll function with empty array
        config.cookies.setAll([]);

        expect(mockCookieStore.set).not.toHaveBeenCalled();

        return {};
      }
    );

    await createClient();
  });

  it("should handle cookies without options", async () => {
    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([]),
      set: jest.fn(),
    };

    mockCookies.mockResolvedValue(mockCookieStore as any);

    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockImplementation(
      (url: string, key: string, config: any) => {
        // Test the setAll function with cookies without options
        const cookiesToSet = [
          { name: "cookie1", value: "value1" },
          { name: "cookie2", value: "value2", options: undefined },
        ];

        config.cookies.setAll(cookiesToSet);

        expect(mockCookieStore.set).toHaveBeenCalledWith(
          "cookie1",
          "value1",
          undefined
        );
        expect(mockCookieStore.set).toHaveBeenCalledWith(
          "cookie2",
          "value2",
          undefined
        );

        return {};
      }
    );

    await createClient();
  });

  it("should return the created client", async () => {
    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([]),
      set: jest.fn(),
    };

    mockCookies.mockResolvedValue(mockCookieStore as any);

    const { createServerClient } = require("@supabase/ssr");
    const mockClient = { auth: { getUser: jest.fn() } };
    createServerClient.mockReturnValue(mockClient);

    const result = await createClient();

    expect(result).toBe(mockClient);
  });

  it("should handle missing environment variables", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([]),
      set: jest.fn(),
    };

    mockCookies.mockResolvedValue(mockCookieStore as any);

    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockReturnValue({});

    // Should not throw error even with missing env vars
    await expect(createClient()).resolves.toBeDefined();

    expect(createServerClient).toHaveBeenCalledWith(
      undefined,
      undefined,
      expect.any(Object)
    );
  });
});
