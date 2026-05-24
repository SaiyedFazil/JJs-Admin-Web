"use client";

import React, { useEffect, useState } from "react";
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

  /**
   * Determine auth state synchronously on the client.
   * `isAdminAuthenticated()` reads `document.cookie` — it's purely synchronous
   * so we can initialise state immediately without a useEffect round-trip.
   * During SSR (`typeof window === "undefined"`) cookies are unavailable,
   * so we fall back to "checking" and resolve it in the useEffect below.
   */
  const [authState, setAuthState] = useState<"checking" | "authenticated" | "unauthenticated">(
    () => {
      if (isLoginPage) return "authenticated";
      // Client-side: resolve immediately (no flash, no full-page loader on navigation)
      if (typeof window !== "undefined") {
        return isAdminAuthenticated() ? "authenticated" : "unauthenticated";
      }
      // SSR: unknown until hydration
      return "checking";
    }
  );

  // Re-verify on every pathname change (guards navigating to a protected page
  // after the session expires, and resolves the SSR "checking" state).
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

  // ── Unauthenticated: brief redirect spinner (full-screen, no layout) ─────────
  if (authState === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--theme-burgundy-50)">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-(--theme-burgundy)" />
          <p className="text-sm text-(--theme-burgundy-600)">Redirecting to login...</p>
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
   * When authState === "checking" (SSR-only hydration gap) we still render the
   * full shell with the sidebar and header so the layout never "disappears".
   * The content area shows a subtle spinner until hydration resolves.
   */
  const isContentLoading = authState === "checking";

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
            {isContentLoading ? (
              /* Content-area only loader — sidebar + navbar remain visible */
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-7 w-7 animate-spin text-(--theme-burgundy)" />
                  <p className="text-sm text-(--theme-burgundy-500)">Loading...</p>
                </div>
              </div>
            ) : (
              <main className="animate-in fade-in mx-auto flex w-full max-w-7xl flex-1 flex-col py-6 duration-300">
                {children}
              </main>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BreadcrumbProvider>
  );
}
