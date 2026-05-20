"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/pages/layout/AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  BreadcrumbProvider,
  AdminBreadcrumb,
} from "@/components/pages/layout/AdminBreadcrumb";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Loader2 } from "lucide-react";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  // Initialize auth checking state - only check auth for non-login pages
  const [authState, setAuthState] = useState<"checking" | "authenticated" | "unauthenticated">(
    isLoginPage ? "authenticated" : "checking"
  );

  // Check admin authentication for protected routes
  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) {
      return;
    }

    // Check if admin is authenticated using admin-specific tokens
    const checkAuth = () => {
      if (isAdminAuthenticated()) {
        setAuthState("authenticated");
      } else {
        setAuthState("unauthenticated");
        // Redirect to admin login if not authenticated
        router.replace("/admin/login");
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

  // For admin login, render clean layout without sidebar
  if (isLoginPage) {
    return <div className="min-h-screen bg-(--theme-navy-50)">{children}</div>;
  }

  // For profile and job detail pages, we want full-page view without sidebar
  const isProfilePage = pathname?.startsWith("/admin/profile/");
  // Match both /admin/jobs/[uuid] and /admin/jobs/[uuid]/query/[queryUuid]
  const isJobDetailPage = pathname?.startsWith("/admin/jobs/") && pathname !== "/admin/jobs";
  const isFullPageView = isProfilePage || isJobDetailPage;

  // Show loading while checking authentication
  if (authState === "checking") {
    if (isFullPageView) {
      return <>{children}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-(--theme-navy-50)">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-(--theme-navy)" />
          <p className="text-sm text-(--theme-navy-600)">Loading...</p>
        </div>
      </div>
    );
  }

  // If unauthenticated, show loading while redirecting
  if (authState === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--theme-navy-50)">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-(--theme-navy)" />
          <p className="text-sm text-(--theme-navy-600)">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // For profile and job detail pages, render without sidebar layout
  if (isFullPageView) {
    return <>{children}</>;
  }

  // For all other admin pages, render the dashboard layout with Shadcn Sidebar
  return (
    <BreadcrumbProvider>
      <SidebarProvider defaultOpen={true}>
        <AdminSidebar />
        <SidebarInset className="flex h-screen flex-col overflow-hidden bg-(--theme-navy-50)">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-(--theme-navy-200) bg-white px-4 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <div className="h-6 w-px bg-(--theme-navy-200)" />
            <AdminBreadcrumb />
          </header>
          <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
            <main className="animate-in fade-in mx-auto w-full max-w-7xl py-6 duration-500">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BreadcrumbProvider>
  );
}
