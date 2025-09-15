import { render, screen } from "@testing-library/react";
import { EnvVarWarning } from "@/components/env-var-warning";

describe("EnvVarWarning Component", () => {
  it("renders warning message correctly", () => {
    render(<EnvVarWarning />);

    expect(
      screen.getByText("Supabase environment variables required")
    ).toBeInTheDocument();
  });

  it("renders disabled buttons", () => {
    render(<EnvVarWarning />);

    const signInButton = screen.getByRole("button", { name: "Sign in" });
    const signUpButton = screen.getByRole("button", { name: "Sign up" });

    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toBeDisabled();

    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toBeDisabled();
  });

  it("renders badge with correct variant", () => {
    render(<EnvVarWarning />);

    const badge = screen.getByText("Supabase environment variables required");
    expect(badge).toBeInTheDocument();
    expect(badge.closest("div")).toHaveClass("font-normal");
  });

  it("has correct layout structure", () => {
    render(<EnvVarWarning />);

    const container = screen
      .getByText("Supabase environment variables required")
      .closest("div")?.parentElement;
    expect(container).toHaveClass("flex gap-4 items-center");
  });

  it("renders buttons with correct sizes and variants", () => {
    render(<EnvVarWarning />);

    const signInButton = screen.getByRole("button", { name: "Sign in" });
    const signUpButton = screen.getByRole("button", { name: "Sign up" });

    // Check that buttons have correct classes (size="sm" and variant="outline"/"default")
    expect(signInButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
});
