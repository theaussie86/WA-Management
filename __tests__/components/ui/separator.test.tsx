import { render, screen } from "@testing-library/react";
import { Separator } from "@/components/ui/separator";

describe("Separator Component", () => {
  it("renders with default props", () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-slot", "separator");
  });

  it("renders with default orientation (horizontal)", () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    // Radix UI doesn't expose orientation as HTML attribute, but we can test the component renders
  });

  it("renders with vertical orientation", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
  });

  it("renders with default decorative prop (true)", () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
  });

  it("renders with decorative false", () => {
    render(<Separator decorative={false} data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Separator className="custom-class" data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass("custom-class");
  });

  it("applies correct base classes for horizontal orientation", () => {
    render(<Separator orientation="horizontal" data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass(
      "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full"
    );
  });

  it("applies correct base classes for vertical orientation", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass(
      "bg-border shrink-0 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
    );
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Separator ref={ref} data-testid="separator" />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
