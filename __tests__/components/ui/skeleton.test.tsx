import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton Component", () => {
  it("renders with default props", () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("data-slot", "skeleton");
  });

  it("applies custom className", () => {
    render(<Skeleton className="custom-class" data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveClass("custom-class");
  });

  it("applies correct base classes", () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveClass("bg-accent animate-pulse rounded-md");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Skeleton ref={ref} data-testid="skeleton" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with children", () => {
    render(
      <Skeleton data-testid="skeleton">
        <span>Loading...</span>
      </Skeleton>
    );
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveTextContent("Loading...");
  });

  it("handles different HTML attributes", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        id="test-skeleton"
        role="presentation"
        aria-label="Loading content"
      />
    );
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveAttribute("id", "test-skeleton");
    expect(skeleton).toHaveAttribute("role", "presentation");
    expect(skeleton).toHaveAttribute("aria-label", "Loading content");
  });
});
