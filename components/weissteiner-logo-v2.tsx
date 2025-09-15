import { cn } from "@/lib/utils";

export interface WeissteinerLogoProps {
  variant?: "full" | "icon-only" | "text-only";
  color?: "dark" | "light" | "white" | "blue";
  size?: "sm" | "md" | "lg" | "xl" | "custom";
  width?: number;
  height?: number;
  className?: string;
}

const sizeMap = {
  sm: { width: 120, height: 42 },
  md: { width: 200, height: 70 },
  lg: { width: 300, height: 105 },
  xl: { width: 400, height: 140 },
};

const colorMap = {
  dark: "#001F3D",
  light: "#003970",
  white: "#FFFFFF",
  blue: "#003970",
};

export function WeissteinerLogo({
  variant = "full",
  color = "dark",
  size = "md",
  width,
  height,
  className,
}: WeissteinerLogoProps) {
  const dimensions =
    size === "custom"
      ? { width: width || 200, height: height || 70 }
      : sizeMap[size];

  const logoColor = colorMap[color];

  if (variant === "icon-only") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 305 305"
        fill="none"
        className={cn("flex-shrink-0", className)}
      >
        {/* Icon-only SVG hier */}
      </svg>
    );
  }

  if (variant === "text-only") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 482 60"
        fill="none"
        className={cn("flex-shrink-0", className)}
      >
        {/* Text-only SVG hier */}
      </svg>
    );
  }

  // Full Logo (Standard)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 879 305"
      fill="none"
      className={cn("flex-shrink-0", className)}
    >
      {/* Vollständiges Logo hier */}
    </svg>
  );
}
