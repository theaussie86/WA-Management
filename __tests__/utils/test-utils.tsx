import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

// Mock Supabase Provider
const MockSupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <MockSupabaseProvider>{children}</MockSupabaseProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Test utilities
export const createMockUser = (overrides = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  user_metadata: {
    full_name: "Test User",
  },
  ...overrides,
});

export const createMockSupabaseResponse = (data: unknown, error = null) => ({
  data,
  error,
  status: error ? 400 : 200,
  statusText: error ? "Bad Request" : "OK",
});

// Mock functions
export const mockSupabaseAuth = {
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  getUser: jest.fn(),
  onAuthStateChange: jest.fn(),
};

export const mockSupabaseClient = {
  auth: mockSupabaseAuth,
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
};

// Dummy test to prevent "no tests" error
describe("test-utils", () => {
  it("should export utility functions", () => {
    expect(createMockUser).toBeDefined();
    expect(createMockSupabaseResponse).toBeDefined();
  });
});
