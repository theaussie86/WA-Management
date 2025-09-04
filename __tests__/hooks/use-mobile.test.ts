import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock window.matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: mockMatchMedia,
});

// Mock window.innerWidth
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

describe("useIsMobile", () => {
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;

  beforeEach(() => {
    mockAddEventListener = jest.fn();
    mockRemoveEventListener = jest.fn();

    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns false for desktop width", () => {
    window.innerWidth = 1024;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("returns true for mobile width", () => {
    window.innerWidth = 500;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("returns true for tablet width (below breakpoint)", () => {
    window.innerWidth = 767; // Just below 768px breakpoint

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("returns false for tablet width (above breakpoint)", () => {
    window.innerWidth = 768; // At breakpoint

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("sets up media query listener on mount", () => {
    renderHook(() => useIsMobile());

    expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 767px)");
    expect(mockAddEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("removes media query listener on unmount", () => {
    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("updates when media query changes", () => {
    let changeCallback: (event: MediaQueryListEvent) => void;

    mockAddEventListener.mockImplementation((event, callback) => {
      if (event === "change") {
        changeCallback = callback;
      }
    });

    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate window resize to mobile
    act(() => {
      window.innerWidth = 500;
      changeCallback({
        matches: true,
        media: "(max-width: 768px)",
      } as unknown as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });

  it("handles undefined initial state correctly", () => {
    // Mock initial state as undefined
    window.innerWidth = 1024;

    const { result } = renderHook(() => useIsMobile());

    // Should convert undefined to false
    expect(result.current).toBe(false);
  });
});
