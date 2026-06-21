import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { LayoutClient } from "@/components/pages/layout/LayoutClient";

import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "JJ's Kitchen Admin",
  description: "JJ's Kitchen Admin Dashboard",
  applicationName: "JJ's Admin",
  manifest: "/manifest.webmanifest",
  icons: {
    // Theme-aware tab favicons. The dark (red) mark shows on LIGHT backgrounds,
    // the light (cream) mark shows on DARK backgrounds — selected purely via the
    // `media` attribute. We deliberately do NOT add a `sizes="any"` / .ico entry
    // here: Chrome treats a scalable icon as the best match and would use it in
    // both schemes, defeating the dark/light switch.
    icon: [
      // Light mode → red mark
      {
        url: "/favicon/favicon-dark/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon/favicon-dark/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon/favicon-dark/favicon-48x48.png",
        type: "image/png",
        sizes: "48x48",
        media: "(prefers-color-scheme: light)",
      },
      // Dark mode → cream mark
      {
        url: "/favicon/favicon-light/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon/favicon-light/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon/favicon-light/favicon-48x48.png",
        type: "image/png",
        sizes: "48x48",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    // iOS home-screen icon: solid cream backplate (no transparency → no black box).
    apple: { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  appleWebApp: {
    capable: true,
    title: "JJ's Admin",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  // Colors the browser UI (Android address bar / installed PWA) per scheme.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1E2D1" },
    { media: "(prefers-color-scheme: dark)", color: "#541A1A" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("sidebar_state");
  const defaultOpen = sidebarCookie?.value !== "false";

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LayoutClient defaultOpen={defaultOpen}>{children}</LayoutClient>
      </body>
    </html>
  );
}
