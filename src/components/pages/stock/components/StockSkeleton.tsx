"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function StockSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      {/* Grid Skeleton for Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-gray-150 rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="mt-2 h-8 w-16" />
          </div>
        ))}
      </div>

      <div className="border-muted space-y-4 rounded-xl border p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border-muted/50 flex items-center gap-6 border-b py-3 last:border-0"
          >
            <Skeleton className="h-6 max-w-sm flex-1" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
