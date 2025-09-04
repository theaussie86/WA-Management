import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

// Mock the Supabase client module
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}));

describe("ForgotPasswordForm", () => {
  const mockSupabaseAuth = {
    resetPasswordForEmail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation
    const { createClient } = jest.requireMock("@/lib/supabase/client");
    createClient.mockImplementation(() => ({
      auth: mockSupabaseAuth,
    }));
  });

  it("renders forgot password form correctly", () => {
    render(<ForgotPasswordForm />);

    expect(
      screen.getByText("Reset Your Password", {
        selector: '[data-slot="card-title"]',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Type in your email and we'll send you a link to reset your password"
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset email/i })
    ).toBeInTheDocument();
  });

  it("handles form submission with valid email", async () => {
    mockSupabaseAuth.resetPasswordForEmail.mockResolvedValue({ error: null });

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", {
      name: /send reset email/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSupabaseAuth.resetPasswordForEmail).toHaveBeenCalledWith(
        "test@example.com",
        {
          redirectTo: expect.stringContaining("/auth/update-password"),
        }
      );
    });

    // Should show success message
    expect(screen.getByText("Check Your Email")).toBeInTheDocument();
    expect(
      screen.getByText("Password reset instructions sent")
    ).toBeInTheDocument();
  });

  it("displays error message on reset failure", async () => {
    const errorMessage = "Email not found";
    mockSupabaseAuth.resetPasswordForEmail.mockRejectedValue(
      new Error(errorMessage)
    );

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", {
      name: /send reset email/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("shows loading state during form submission", async () => {
    mockSupabaseAuth.resetPasswordForEmail.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100)
        )
    );

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", {
      name: /send reset email/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("Sending...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("shows login link", () => {
    render(<ForgotPasswordForm />);

    const loginLink = screen.getByText("Login");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/auth/login");
  });

  it("validates required email field", async () => {
    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole("button", {
      name: /send reset email/i,
    });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission
    expect(mockSupabaseAuth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("shows success state after successful submission", async () => {
    mockSupabaseAuth.resetPasswordForEmail.mockResolvedValue({ error: null });

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", {
      name: /send reset email/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Check Your Email")).toBeInTheDocument();
      expect(
        screen.getByText("Password reset instructions sent")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "If you registered using your email and password, you will receive a password reset email."
        )
      ).toBeInTheDocument();
    });
  });
});
