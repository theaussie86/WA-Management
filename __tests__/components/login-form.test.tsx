import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import { LoginForm } from "@/components/login-form";

// Mock the Supabase client module
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("LoginForm", () => {
  const mockSupabaseAuth = {
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation
    const { createClient } = require("@/lib/supabase/client");
    createClient.mockImplementation(() => ({
      auth: mockSupabaseAuth,
    }));
  });

  it("renders login form correctly", () => {
    render(<LoginForm />);

    expect(
      screen.getByText("Login", { selector: '[data-slot="card-title"]' })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter your email below to login to your account")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("handles form submission with valid credentials", async () => {
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({ error: null });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(mockPush).toHaveBeenCalledWith("/protected");
  });

  it("displays error message on login failure", async () => {
    const errorMessage = "Invalid credentials";
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({
      error: { message: errorMessage },
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("An error occurred")).toBeInTheDocument();
    });
  });

  it("shows loading state during form submission", async () => {
    mockSupabaseAuth.signInWithPassword.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100)
        )
    );

    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("Logging in...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("handles GitHub OAuth login", async () => {
    mockSupabaseAuth.signInWithOAuth.mockResolvedValue({ error: null });

    render(<LoginForm />);

    const githubButton = screen.getByRole("button", {
      name: /mit github anmelden/i,
    });
    fireEvent.click(githubButton);

    await waitFor(() => {
      expect(mockSupabaseAuth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "github",
        options: {
          redirectTo: expect.stringContaining("/auth/oauth"),
        },
      });
    });
  });

  it("validates required fields", async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission
    expect(mockSupabaseAuth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("shows forgot password link", () => {
    render(<LoginForm />);

    const forgotPasswordLink = screen.getByText("Forgot your password?");
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.closest("a")).toHaveAttribute(
      "href",
      "/auth/forgot-password"
    );
  });

  it("shows sign up link", () => {
    render(<LoginForm />);

    const signUpLink = screen.getByText("Sign up");
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest("a")).toHaveAttribute("href", "/auth/sign-up");
  });
});
