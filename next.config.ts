import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack Konfiguration (neue Syntax)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // TypeScript Konfiguration
  typescript: {
    // TypeScript Fehler nicht als Build-Fehler behandeln
    ignoreBuildErrors: false,
  },
  // ESLint Konfiguration
  eslint: {
    // ESLint Fehler nicht als Build-Fehler behandeln
    ignoreDuringBuilds: false,
  },
  // Output Konfiguration
  output: "standalone",
  // Explizit das Output File Tracing Root setzen
  outputFileTracingRoot: __dirname,
  // Trailing Slash Konfiguration
  trailingSlash: false,
  // Images Konfiguration
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
