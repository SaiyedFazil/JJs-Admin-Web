"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loader";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Top-level Error Boundary for the /app directory.
 * This component will catch errors in nested layouts and pages.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("App-level Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center p-6 text-center">
      <div className="animate-in fade-in zoom-in mb-6 flex flex-col items-center duration-500">
        <div className="relative mb-4">
          <Spinner variant="circle-filled" size={140} className="text-(--theme-burgundy)" />
          <div className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 ring-4 ring-white">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Something went wrong
        </h2>
        <p className="mt-3 max-w-md text-slate-500">
          We apologize for the inconvenience. An unexpected error occurred while rendering this
          page.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 max-w-xl overflow-auto rounded-lg border border-red-100 bg-slate-50 p-4 text-left font-mono text-xs text-red-800">
            <p className="mb-1 font-bold">Debug Info:</p>
            <p>{error.message}</p>
            {error.digest && <p className="mt-1 opacity-70">Digest: {error.digest}</p>}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => reset()}
          className="cursor-pointer gap-2 bg-(--theme-taupe) font-semibold text-(--theme-burgundy-900) hover:bg-(--theme-taupe-500)"
          size="lg"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="cursor-pointer gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
          size="lg"
        >
          <Home className="h-4 w-4" />
          Return Home
        </Button>
      </div>

      <p className="mt-12 text-xs text-slate-400">
        If the problem persists, please contact our support team.
      </p>
    </div>
  );
}
