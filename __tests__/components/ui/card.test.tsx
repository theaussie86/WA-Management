import { render, screen } from "../../utils/test-utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

describe("Card Components", () => {
  it("renders Card with correct attributes", () => {
    render(<Card data-testid="card">Card content</Card>);

    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveClass(
      "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
    );
  });

  it("renders CardHeader with correct attributes", () => {
    render(<CardHeader data-testid="card-header">Header content</CardHeader>);

    const header = screen.getByTestId("card-header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute("data-slot", "card-header");
  });

  it("renders CardTitle with correct attributes", () => {
    render(<CardTitle data-testid="card-title">Title content</CardTitle>);

    const title = screen.getByTestId("card-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute("data-slot", "card-title");
    expect(title).toHaveClass("leading-none font-semibold");
  });

  it("renders CardDescription with correct attributes", () => {
    render(
      <CardDescription data-testid="card-description">
        Description content
      </CardDescription>
    );

    const description = screen.getByTestId("card-description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveAttribute("data-slot", "card-description");
    expect(description).toHaveClass("text-muted-foreground text-sm");
  });

  it("renders CardContent with correct attributes", () => {
    render(<CardContent data-testid="card-content">Content</CardContent>);

    const content = screen.getByTestId("card-content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("data-slot", "card-content");
    expect(content).toHaveClass("px-6");
  });

  it("renders CardFooter with correct attributes", () => {
    render(<CardFooter data-testid="card-footer">Footer content</CardFooter>);

    const footer = screen.getByTestId("card-footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute("data-slot", "card-footer");
    expect(footer).toHaveClass("flex items-center px-6");
  });

  it("renders CardAction with correct attributes", () => {
    render(<CardAction data-testid="card-action">Action content</CardAction>);

    const action = screen.getByTestId("card-action");
    expect(action).toBeInTheDocument();
    expect(action).toHaveAttribute("data-slot", "card-action");
    expect(action).toHaveClass(
      "col-start-2 row-span-2 row-start-1 self-start justify-self-end"
    );
  });

  it("applies custom className to Card", () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("custom-class");
  });

  it("renders complete card structure", () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>
    );

    expect(screen.getByTestId("complete-card")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });
});
