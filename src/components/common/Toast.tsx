"use client";

import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  /** Duration in milliseconds before auto-close (default: 5000ms) */
  duration?: number;
  position?: "top-right" | "top-center" | "bottom-center";
}

/**
 * Toast notification component for displaying success/error messages.
 * Automatically dismisses after the specified duration.
 */
export function Toast({
  message,
  type,
  onClose,
  duration = 5000,
  position = "top-right",
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={cn(
        // Base styles
        "fixed z-100 flex items-center gap-3 rounded-lg px-4 py-3 shadow-xl",
        // Animation
        "animate-in duration-300",
        // Position
        position === "top-right"
          ? "slide-in-from-top-2 top-4 right-4 left-4 sm:right-4 sm:left-auto sm:max-w-md"
          : position === "top-center"
            ? "slide-in-from-top-2 top-8 left-1/2 w-max max-w-[90vw] -translate-x-1/2"
            : "slide-in-from-bottom-2 bottom-8 left-1/2 w-max max-w-[90vw] -translate-x-1/2",
        // Colors based on type
        type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
      )}
    >
      <div className="shrink-0">
        {type === "success" ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
      </div>
      <span className="flex-1 text-sm font-medium sm:text-base">{message}</span>
      <button
        onClick={onClose}
        className="shrink-0 cursor-pointer rounded-full p-1 transition-colors hover:bg-white/20"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Hook for managing toast state
 */
export function useToast() {
  const [toast, setToast] = React.useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = React.useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
  }, []);

  const hideToast = React.useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
}
