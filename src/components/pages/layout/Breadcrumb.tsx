"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

// --- Context Types ---
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

// --- Context Creation ---
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

// --- Provider Component ---
export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbState, setBreadcrumbState] = useState<{
    items: BreadcrumbItem[];
    pathname: string;
  }>({ items: [], pathname: "" });
  const pathname = usePathname();

  // Custom setter that also tracks which pathname the breadcrumbs were set for
  // Memoized to prevent infinite loops when used in useEffect dependencies
  const setBreadcrumbs = useCallback(
    (newBreadcrumbs: BreadcrumbItem[]) => {
      setBreadcrumbState((prev) => {
        // Avoid unnecessary state updates if nothing changed
        if (
          prev.pathname === pathname &&
          prev.items.length === newBreadcrumbs.length &&
          prev.items.every((item, i) => item.label === newBreadcrumbs[i]?.label)
        ) {
          return prev;
        }
        return { items: newBreadcrumbs, pathname };
      });
    },
    [pathname]
  );

  // Derive the actual breadcrumbs - return empty if route changed
  const breadcrumbs = breadcrumbState.pathname === pathname ? breadcrumbState.items : [];

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

// --- Hook to Use Breadcrumbs ---
export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
}

// --- Breadcrumb Display Component ---
export function Breadcrumb() {
  const { breadcrumbs } = useBreadcrumb();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-(--theme-burgundy-600)">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isFirst = index === 0;
        return (
          <React.Fragment key={index}>
            {!isFirst && <ChevronRight className="h-4 w-4 text-(--theme-burgundy-300)" />}
            {item.onClick && !isLast ? (
              <button
                onClick={item.onClick}
                className="cursor-pointer transition-colors hover:text-(--theme-burgundy-500) hover:underline"
              >
                {item.label}
              </button>
            ) : item.href && !isLast ? (
              <Link
                href={item.href}
                prefetch={false}
                className="transition-colors hover:text-(--theme-burgundy-500) hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-(--theme-burgundy-900)" : ""}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
