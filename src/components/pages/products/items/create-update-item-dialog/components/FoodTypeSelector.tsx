"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FoodTypeSelectorProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export function FoodTypeSelector({
  value,
  onChange,
  disabled = false,
  hasError = false,
  errorMessage,
}: FoodTypeSelectorProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-(--theme-burgundy-950)">
        Food Type <span className="text-red-500">*</span>
      </Label>
      <div
        className={cn(
          "grid h-11 grid-cols-2 gap-1 rounded-xl border bg-white p-1 transition-colors",
          hasError ? "border-red-500" : "border-(--theme-burgundy-200)"
        )}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(false)}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 select-none",
            value === false
              ? "border border-red-200 bg-red-50 text-red-700 shadow-xs"
              : "border border-transparent text-(--theme-coffee-500) hover:bg-(--theme-coffee-50)/50 hover:text-(--theme-burgundy-950)"
          )}
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-all duration-200",
              value === false ? "scale-100 bg-red-500" : "scale-75 bg-red-200/50"
            )}
          />
          Non-Veg
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(true)}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 select-none",
            value === true
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-xs"
              : "border border-transparent text-(--theme-coffee-500) hover:bg-(--theme-coffee-50)/50 hover:text-(--theme-burgundy-950)"
          )}
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-all duration-200",
              value === true ? "scale-100 bg-emerald-500" : "scale-75 bg-emerald-200/50"
            )}
          />
          Veg
        </button>
      </div>
      {hasError && errorMessage && (
        <p className="text-xs font-medium text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
