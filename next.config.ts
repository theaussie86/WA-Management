import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack Konfiguration (nur für Development)
  ...(process.env.NODE_ENV === "development" && {
    turbopack: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  }),
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
  // Output Konfiguration - für Vercel entfernt
  // output: "standalone", // Entfernt für Vercel Kompatibilität
  // outputFileTracingRoot: __dirname, // Entfernt für Vercel Kompatibilität
  // Trailing Slash Konfiguration
  trailingSlash: false,
  // Images Konfiguration
  images: {
    unoptimized: false,
  },
  // Server External Packages für bessere Vercel Kompatibilität
  serverExternalPackages: [],
  // Redirects Konfiguration
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false, // 307 redirect (temporary)
        has: [
          {
            type: "cookie",
            key: "sb-access-token", // Supabase Auth Cookie
          },
        ],
      },
    ];
  },
};

export default nextConfig;
