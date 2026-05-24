import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { LayoutClient } from "@/components/pages/layout/LayoutClient";

import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "JJ's Kitchen Admin",
  description: "JJ's Kitchen Admin Dashboard",
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
