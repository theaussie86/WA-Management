import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge Component", () => {
  it("renders with default props", () => {
    render(<Badge data-testid="badge">Test Badge</Badge>);
    const badge = screen.getByTestId("badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Test Badge");
  });

  it("renders with default variant", () => {
    render(<Badge data-testid="badge">Test Badge</Badge>);
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveClass(
      "border-transparent bg-primary text-primary-foreground"
    );
  });

  it("renders with different variants", () => {
    const { rerender } = render(
      <Badge variant="secondary" data-testid="badge">
        Secondary
      </Badge>
    );
    let badge = screen.getByTestId("badge");
    expect(badge).toHaveClass("bg-secondary text-secondary-foreground");

    rerender(
      <Badge variant="destructive" data-testid="badge">
        Destructive
      </Badge>
    );
    badge = screen.getByTestId("badge");
    expect(badge).toHaveClass("bg-destructive text-destructive-foreground");

    rerender(
      <Badge variant="outline" data-testid="badge">
        Outline
      </Badge>
    );
    badge = screen.getByTestId("badge");
    expect(badge).toHaveClass("text-foreground");
  });

  it("applies custom className", () => {
    render(
      <Badge className="custom-class" data-testid="badge">
        Test
      </Badge>
    );
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveClass("custom-class");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(
      <Badge onClick={handleClick} data-testid="badge">
        Clickable
      </Badge>
    );
    const badge = screen.getByTestId("badge");
    badge.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with all base classes", () => {
    render(<Badge data-testid="badge">Test</Badge>);
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveClass(
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors"
    );
  });
});
