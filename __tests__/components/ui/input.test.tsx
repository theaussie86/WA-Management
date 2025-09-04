import { render, screen } from "../../utils/test-utils";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  it("renders input with correct attributes", () => {
    render(<Input data-testid="input" placeholder="Enter text" />);

    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).toHaveClass(
      "flex",
      "h-9",
      "w-full",
      "rounded-md",
      "border",
      "border-input"
    );
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Input ref={ref} data-testid="input" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("custom-class");
  });

  it("handles different input types", () => {
    render(<Input type="email" data-testid="email-input" />);

    const input = screen.getByTestId("email-input");
    expect(input).toHaveAttribute("type", "email");
  });

  it("handles disabled state", () => {
    render(<Input disabled data-testid="disabled-input" />);

    const input = screen.getByTestId("disabled-input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      "disabled:cursor-not-allowed",
      "disabled:opacity-50"
    );
  });

  it("handles required attribute", () => {
    render(<Input required data-testid="required-input" />);

    const input = screen.getByTestId("required-input");
    expect(input).toBeRequired();
  });

  it("handles value and onChange", () => {
    const handleChange = jest.fn();
    render(
      <Input value="test value" onChange={handleChange} data-testid="input" />
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveValue("test value");
  });

  it("handles focus and blur events", () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(
      <Input onFocus={handleFocus} onBlur={handleBlur} data-testid="input" />
    );

    const input = screen.getByTestId("input");

    input.focus();
    expect(handleFocus).toHaveBeenCalled();

    input.blur();
    expect(handleBlur).toHaveBeenCalled();
  });

  it("has correct display name", () => {
    expect(Input.displayName).toBe("Input");
  });
});
