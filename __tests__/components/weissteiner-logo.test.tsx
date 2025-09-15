import { render } from "@testing-library/react";
import { WeissteinerLogo } from "@/components/weissteiner-logo";

describe("WeissteinerLogo Component", () => {
  it("renders SVG logo correctly", () => {
    render(<WeissteinerLogo />);

    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.tagName).toBe("svg");
  });

  it("has correct SVG attributes", () => {
    render(<WeissteinerLogo />);

    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    expect(svg).toHaveAttribute("width", "879");
    expect(svg).toHaveAttribute("height", "305");
    expect(svg).toHaveAttribute("viewBox", "0 0 879 305");
    expect(svg).toHaveAttribute("fill", "none");
  });

  it("renders with correct structure", () => {
    render(<WeissteinerLogo />);

    const svg = document.querySelector("svg");

    // Check for mask elements
    const masks = svg?.querySelectorAll("mask");
    expect(masks).toHaveLength(2);

    // Check for path elements
    const paths = svg?.querySelectorAll("path");
    expect(paths?.length).toBeGreaterThan(0);

    // Check for g elements
    const groups = svg?.querySelectorAll("g");
    expect(groups?.length).toBeGreaterThan(0);
  });

  it("has correct mask definitions", () => {
    render(<WeissteinerLogo />);

    const svg = document.querySelector("svg");

    const mask0 = svg?.querySelector('mask[id="mask0_210_99"]');
    const mask1 = svg?.querySelector('mask[id="mask1_210_99"]');

    expect(mask0).toBeInTheDocument();
    expect(mask1).toBeInTheDocument();
  });

  it("renders without accessibility issues", () => {
    render(<WeissteinerLogo />);

    // SVG should be present but not have alt text (it's decorative)
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveAttribute("alt");
  });

  it("has correct fill colors", () => {
    render(<WeissteinerLogo />);

    const svg = document.querySelector("svg");
    const paths = svg?.querySelectorAll("path");

    // Check that paths have expected fill colors
    const fillColors = Array.from(paths || []).map((path) =>
      path.getAttribute("fill")
    );
    expect(fillColors).toContain("#003970");
    expect(fillColors).toContain("#001F3D");
  });
});
