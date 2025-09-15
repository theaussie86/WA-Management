import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/hero";

describe("Hero Component", () => {
  it("renders hero section correctly", () => {
    render(<Hero />);

    // Check for main heading (screen reader only)
    expect(
      screen.getByText("Weissteiner Automation Plattform")
    ).toBeInTheDocument();
    expect(screen.getByText("Weissteiner Automation")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<Hero />);

    expect(
      screen.getByText(
        "Die intelligente Plattform für moderne Automatisierungslösungen"
      )
    ).toBeInTheDocument();
  });

  it("renders technology links", () => {
    render(<Hero />);

    const supabaseLink = screen.getByRole("link", { name: "Supabase" });
    const nextjsLink = screen.getByRole("link", { name: "Next.js" });

    expect(supabaseLink).toBeInTheDocument();
    expect(supabaseLink).toHaveAttribute(
      "href",
      "https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
    );
    expect(supabaseLink).toHaveAttribute("target", "_blank");
    expect(supabaseLink).toHaveAttribute("rel", "noreferrer");

    expect(nextjsLink).toBeInTheDocument();
    expect(nextjsLink).toHaveAttribute("href", "https://nextjs.org/");
    expect(nextjsLink).toHaveAttribute("target", "_blank");
    expect(nextjsLink).toHaveAttribute("rel", "noreferrer");
  });

  it("renders logo link", () => {
    render(<Hero />);

    const logoLink = screen.getByRole("link", { name: "" });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "https://nextjs.org/");
    expect(logoLink).toHaveAttribute("target", "_blank");
    expect(logoLink).toHaveAttribute("rel", "noreferrer");
  });

  it("renders technology description", () => {
    render(<Hero />);

    expect(screen.getByText(/Entwickelt mit/)).toBeInTheDocument();
    expect(
      screen.getByText(/für maximale Performance und Skalierbarkeit/)
    ).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    render(<Hero />);

    const heroContainer = screen
      .getByText("Weissteiner Automation Plattform")
      .closest("div");
    expect(heroContainer).toHaveClass("flex flex-col gap-16 items-center");
  });

  it("renders gradient separator", () => {
    render(<Hero />);

    const separator = screen
      .getByText("Weissteiner Automation Plattform")
      .closest("div")
      ?.querySelector(".w-full.p-\\[1px\\].bg-gradient-to-r");
    expect(separator).toBeInTheDocument();
  });
});
