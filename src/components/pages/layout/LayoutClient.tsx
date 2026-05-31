"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/pages/layout/Sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbProvider, Breadcrumb } from "@/components/pages/layout/Breadcrumb";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Loader2 } from "lucide-react";

export function LayoutClient({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";

  // Always start with "checking" so SSR and client initial render agree,
  // preventing the hydration mismatch caused by reading cookies in the initializer.
  const [authState, setAuthState] = useState<"checking" | "authenticated" | "unauthenticated">(
    "checking"
  );

  // Resolve auth synchronously before first paint — no visual flash, no hydration mismatch.
  useLayoutEffect(() => {
    if (isLoginPage) {
      setAuthState("authenticated");
      return;
    }
    if (isAdminAuthenticated()) {
      setAuthState("authenticated");
    } else {
      setAuthState("unauthenticated");
      router.replace("/login");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-verify on every pathname change (guards session expiry during navigation).
  useEffect(() => {
    if (isLoginPage) return;
    if (isAdminAuthenticated()) {
      setAuthState("authenticated");
    } else {
      setAuthState("unauthenticated");
      router.replace("/login");
    }
  }, [isLoginPage, pathname, router]);

  // ── Login page: clean full-screen layout ────────────────────────────────────
  if (isLoginPage) {
    return <div className="min-h-screen bg-(--theme-burgundy-50)">{children}</div>;
  }

  // ── Pages that intentionally skip the sidebar ────────────────────────────────
  const isProfilePage = pathname?.startsWith("/profile/");
  const isJobDetailPage = pathname?.startsWith("/jobs/") && pathname !== "/jobs";
  const isFullPageView = isProfilePage || isJobDetailPage;

  // ── Checking / Unauthenticated: brief redirect spinner (full-screen, no layout) ─────────
  if (authState === "checking" || authState === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--theme-burgundy-50)">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-(--theme-burgundy)" />
        </div>
      </div>
    );
  }

  // ── Full-page views (no sidebar) ─────────────────────────────────────────────
  if (isFullPageView) {
    return <>{children}</>;
  }

  /**
   * ── Dashboard layout (sidebar + navbar always visible) ──────────────────────
   *
   * Reached only when authState === "authenticated". Renders the full shell
   * with sidebar, header, and children seamlessly.
   */
  return (
    <BreadcrumbProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar />
        <SidebarInset className="flex h-screen flex-col overflow-hidden bg-(--theme-burgundy-50)">
          {/* ── Sticky top navbar ── */}
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-(--theme-burgundy-200) bg-white px-4 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <div className="h-6 w-px bg-(--theme-burgundy-200)" />
            <Breadcrumb />
          </header>

          {/* ── Scrollable content area ── */}
          <div className="flex flex-1 flex-col overflow-auto p-4">
            <main className="animate-in fade-in mx-auto flex w-full max-w-7xl flex-1 flex-col py-6 duration-300">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BreadcrumbProvider>
  );
}
