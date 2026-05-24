"use client";

import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import * as React from "react";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  isFocused: boolean;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  isFocused,
  className,
}: PasswordStrengthIndicatorProps) {
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: "Uppercase and lowercase character",
      test: (pwd) => /(?=.*[a-z])/.test(pwd) && /(?=.*[A-Z])/.test(pwd),
    },
    {
      label: "One special character",
      test: (pwd) => /[!@#$%^&*()_+\-={}[\]|;:'"\\,<.>/?`~]/.test(pwd),
    },
    {
      label: "One number",
      test: (pwd) => /\d/.test(pwd),
    },
  ];

  const getPasswordStrength = (
    pwd: string
  ): {
    label: string;
    value: number;
    colorClass: string;
    barColor: string;
  } => {
    if (pwd.length === 0) {
      return {
        label: "",
        value: 0,
        colorClass: "text-(--theme-coffee-400)",
        barColor: "var(--theme-coffee-200)",
      };
    }

    const metRequirements = requirements.filter((req) => req.test(pwd)).length;

    // Map requirements to visual strength levels
    // 0-1 requirements: Weak (25%)
    // 2 requirements: So-so (50%)
    // 3 requirements: Good (75%)
    // 4 requirements: Strong (100%)

    if (metRequirements <= 1) {
      return {
        label: "Weak",
        value: 25,
        colorClass: "text-red-500",
        barColor: "#ef4444", // red-500
      };
    } else if (metRequirements === 2) {
      return {
        label: "So-so",
        value: 50,
        colorClass: "text-amber-500",
        barColor: "#f59e0b", // amber-500
      };
    } else if (metRequirements === 3) {
      return {
        label: "Good",
        value: 75,
        colorClass: "text-(--theme-coffee)",
        barColor: "var(--theme-coffee)", // theme blue
      };
    } else {
      return {
        label: "Strong",
        value: 100,
        colorClass: "text-(--theme-taupe-500)",
        barColor: "var(--theme-taupe-500)", // theme teal
      };
    }
  };

  const strength = getPasswordStrength(password);
  const showIndicator = password.length > 0 && isFocused;

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          className={cn(
            "shadow-theme-xl rounded-lg border border-(--theme-taupe-200) bg-white p-3 sm:p-4",
            // Mobile/Tablet (below xl): relative positioning, below the input
            "relative z-40 mt-3 w-full",
            // Desktop xl+: absolute positioning, to the right of input
            "xl:absolute xl:top-1/2 xl:left-full xl:z-50 xl:mt-0 xl:ml-4 xl:w-64 xl:-translate-y-1/2",
            // Apply custom styling
            className
          )}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Arrow pointing to input - only show on xl+ desktop */}
          <div className="absolute top-1/2 left-0 -ml-2 hidden h-4 w-4 -translate-y-1/2 rotate-315 border-t border-l border-(--theme-taupe-200) bg-white xl:block" />

          {/* Title */}
          <h4 className="mb-3 text-sm font-semibold text-(--theme-burgundy-800)">
            Password must have:
          </h4>

          {/* Requirements List */}
          <ul className="mb-4 space-y-2">
            {requirements.map((requirement, index) => {
              const isMet = requirement.test(password);
              return (
                <motion.li
                  key={index}
                  className="flex items-center gap-2 text-xs"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {isMet ? (
                    <Check className="h-3.5 w-3.5 text-(--theme-taupe-500)" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-(--theme-coffee-400)" />
                  )}
                  <span
                    className={cn(isMet ? "text-(--theme-taupe-700)" : "text-(--theme-coffee-500)")}
                  >
                    {requirement.label}
                  </span>
                </motion.li>
              );
            })}
          </ul>

          {/* Password Strength Indicator */}
          {strength.label && (
            <div className="border-t border-(--theme-taupe-100) pt-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-(--theme-burgundy-600)">Strength:</span>
                <span className={cn("text-xs font-semibold", strength.colorClass)}>
                  {strength.label}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-(--theme-coffee-100)">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: strength.barColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${strength.value}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
