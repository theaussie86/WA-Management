import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Weissteiner Automation Plattform",
  description:
    "Plattform für die Automatisierung von Prozessen für Weissteiner Automation",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Service Worker Cleanup - wird nur im Browser ausgeführt
  if (typeof window !== "undefined") {
    // Alle Service Worker löschen
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }

    // Cache löschen
    if ("caches" in window) {
      caches.keys().then(function (names) {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
