import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AdminLayoutClient } from "@/components/pages/layout/AdminLayoutClient";

export const metadata: Metadata = {
  title: "JJ's Kitchen Admin",
  description: "JJ's Kitchen Admin Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
