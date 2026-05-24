"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type OptionCardColor = "teal" | "purple" | "indigo" | "blue" | "emerald" | "orange";

interface OptionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  color: OptionCardColor;
  className?: string;
}

export function OptionCard({
  icon: Icon,
  title,
  description,
  onClick,
  color,
  className,
}: OptionCardProps) {
  const colorMap: Record<OptionCardColor, string> = {
    teal: "text-teal-600 bg-teal-50 hover:border-teal-200 group-hover:bg-teal-100",
    purple: "text-purple-600 bg-purple-50 hover:border-purple-200 group-hover:bg-purple-100",
    indigo: "text-indigo-600 bg-indigo-50 hover:border-indigo-200 group-hover:bg-indigo-100",
    blue: "text-blue-600 bg-blue-50 hover:border-blue-200 group-hover:bg-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 hover:border-emerald-200 group-hover:bg-emerald-100",
    orange: "text-orange-600 bg-orange-50 hover:border-orange-200 group-hover:bg-orange-100",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-(--theme-burgundy-100) bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-(--theme-taupe)/30 hover:shadow-md",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300",
          colorMap[color]
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2 text-left">
        <h3 className="text-lg font-bold text-(--theme-burgundy-900) transition-colors group-hover:text-(--theme-taupe)">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-(--theme-burgundy-500)">{description}</p>
      </div>
    </div>
  );
}
