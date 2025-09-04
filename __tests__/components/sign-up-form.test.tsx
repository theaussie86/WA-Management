import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import { SignUpForm } from "@/components/sign-up-form";

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

describe("SignUpForm", () => {
  const mockSupabaseAuth = {
    signUp: jest.fn(),
    signInWithOAuth: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation
    const { createClient } = jest.requireMock("@/lib/supabase/client");
    createClient.mockImplementation(() => ({
      auth: mockSupabaseAuth,
    }));
  });

  it("renders sign up form correctly", () => {
    render(<SignUpForm />);

    expect(
      screen.getByText("Sign up", { selector: '[data-slot="card-title"]' })
    ).toBeInTheDocument();
    expect(screen.getByText("Create a new account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Repeat Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("handles form submission with valid data", async () => {
    mockSupabaseAuth.signUp.mockResolvedValue({ error: null });

    render(<SignUpForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const repeatPasswordInput = screen.getByLabelText("Repeat Password");
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(repeatPasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        options: {
          emailRedirectTo: expect.stringContaining("/protected"),
        },
      });
    });

    expect(mockPush).toHaveBeenCalledWith("/auth/sign-up-success");
  });

  it("displays error when passwords do not match", async () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const repeatPasswordInput = screen.getByLabelText("Repeat Password");
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(repeatPasswordInput, {
      target: { value: "different123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    expect(mockSupabaseAuth.signUp).not.toHaveBeenCalled();
  });

  it("displays error message on sign up failure", async () => {
    const errorMessage = "Email already registered";
    mockSupabaseAuth.signUp.mockRejectedValue(new Error(errorMessage));

    render(<SignUpForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const repeatPasswordInput = screen.getByLabelText("Repeat Password");
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(repeatPasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("shows loading state during form submission", async () => {
    mockSupabaseAuth.signUp.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100)
        )
    );

    render(<SignUpForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const repeatPasswordInput = screen.getByLabelText("Repeat Password");
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(repeatPasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("Creating an account...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("handles GitHub OAuth sign up", async () => {
    mockSupabaseAuth.signInWithOAuth.mockResolvedValue({ error: null });

    render(<SignUpForm />);

    const githubButton = screen.getByRole("button", {
      name: /mit github registrieren/i,
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

  it("shows login link", () => {
    render(<SignUpForm />);

    const loginLink = screen.getByText("Login");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/auth/login");
  });

  it("validates required fields", async () => {
    render(<SignUpForm />);

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission
    expect(mockSupabaseAuth.signUp).not.toHaveBeenCalled();
  });
});
