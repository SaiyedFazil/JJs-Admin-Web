"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  categories: Category[];
  isLoadingCategories: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  productCategory?: { id: number; name: string };
}

export function CategorySelect({
  value,
  onChange,
  disabled = false,
  hasError = false,
  errorMessage,
  categories,
  isLoadingCategories,
  onOpenChange,
  isEditMode,
  productCategory,
}: CategorySelectProps) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1 text-xs font-semibold text-(--theme-burgundy-950)">
        Category <span className="text-red-500">*</span>
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
        onOpenChange={onOpenChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={`h-11! w-full cursor-pointer rounded-xl border-(--theme-burgundy-200) bg-white text-(--theme-burgundy-950) focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
            hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
        >
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent position="popper" className="w-(--radix-select-trigger-width) bg-white!">
          {isLoadingCategories ? (
            <div className="text-muted-foreground flex items-center justify-center p-2 text-xs">
              Loading categories...
            </div>
          ) : categories.length === 0 && !isEditMode ? (
            <div className="text-muted-foreground p-2 text-center text-xs">
              Click/Wait to load categories
            </div>
          ) : (
            // Show pre-loaded or currently selected categories list
            (categories.length > 0 ? categories : productCategory ? [productCategory] : []).map(
              (cat) => (
                <SelectItem key={cat.id} value={String(cat.id)} className="cursor-pointer">
                  {cat.name}
                </SelectItem>
              )
            )
          )}
        </SelectContent>
      </Select>
      {hasError && errorMessage && (
        <p className="text-xs font-medium text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
