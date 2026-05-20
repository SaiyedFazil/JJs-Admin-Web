import React, { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmationShutterProps {
  show: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  confirmLoadingText?: string;
  icon?: ReactNode;
  confirmButtonClass?: string;
  iconContainerClass?: string;
  containerClass?: string;
  contentContainerClass?: string;
  descriptionClass?: string;
}

export function ConfirmationShutter({
  show,
  isSubmitting,
  onCancel,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  confirmLoadingText = "Processing...",
  icon = <AlertCircle className="h-5 w-5" />,
  confirmButtonClass = "bg-(--theme-teal-600) hover:bg-(--theme-teal-700)",
  iconContainerClass = "bg-(--theme-teal-50) text-(--theme-teal-600)",
  containerClass = "absolute inset-x-0 bottom-0 z-10 flex min-h-full items-center bg-white px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]",
  contentContainerClass = "flex w-full flex-col items-center justify-between gap-4 sm:flex-row",
  descriptionClass = "text-sm text-(--theme-navy-500)",
}: ConfirmationShutterProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "absolute inset-0 z-10 flex items-center bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]",
            containerClass
          )}
        >
          <div
            className={cn(
              "mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-4 py-2 md:flex-row md:py-0",
              contentContainerClass
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  iconContainerClass
                )}
              >
                {icon}
              </div>
              <div className="flex flex-col justify-center text-left">
                <p className="font-semibold text-(--theme-navy-800)">{title}</p>
                {description && (
                  <div className={cn("hidden text-sm md:block", descriptionClass)}>
                    {description}
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full gap-3 sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1 cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-50 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onConfirm();
                }}
                disabled={isSubmitting}
                className={cn("flex-1 cursor-pointer text-white sm:flex-none", confirmButtonClass)}
              >
                {isSubmitting ? confirmLoadingText : confirmText}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
