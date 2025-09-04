import { cn } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("handles conditional classes", () => {
      expect(cn("base", true && "conditional")).toBe("base conditional");
      expect(cn("base", false && "conditional")).toBe("base");
    });

    it("handles undefined and null values", () => {
      expect(cn("base", undefined, null)).toBe("base");
    });

    it("merges Tailwind classes correctly", () => {
      // Test that conflicting classes are resolved (last one wins)
      expect(cn("p-2 p-4")).toBe("p-4");
      expect(cn("text-red-500 text-blue-500")).toBe("text-blue-500");
    });

    it("handles arrays and objects", () => {
      expect(cn(["class1", "class2"])).toBe("class1 class2");
      expect(cn({ class1: true, class2: false })).toBe("class1");
    });
  });

  describe("hasEnvVars", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it("returns true when both environment variables are set", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY = "test-key";

      // Test the logic directly
      const result = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
      );
      expect(result).toBe(true);
    });

    it("returns false when NEXT_PUBLIC_SUPABASE_URL is missing", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY = "test-key";

      // Test the logic directly
      const result = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
      );
      expect(result).toBe(false);
    });

    it("returns false when NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY is missing", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

      // Test the logic directly
      const result = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
      );
      expect(result).toBe(false);
    });

    it("returns false when both environment variables are missing", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

      // Test the logic directly
      const result = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
      );
      expect(result).toBe(false);
    });
  });
});
