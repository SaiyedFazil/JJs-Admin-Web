"use client";

import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonText?: string;
  loadingText?: string;
  variant?: "danger" | "warning" | "default";
  icon?: React.ReactNode;
}

/**
 * Shared Alert dialog component for confirming actions.
 */
export function ConfirmationDialog({
  isOpen,
  title,
  description,
  isLoading,
  onClose,
  onConfirm,
  confirmButtonText = "Confirm",
  loadingText = "Processing...",
  variant = "default",
  icon,
}: ConfirmationDialogProps) {
  const getButtonStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-600";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 focus:ring-amber-600";
      default:
        return "bg-(--theme-teal) text-(--theme-navy-900) hover:bg-(--theme-teal-500)";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="mx-auto max-w-[calc(100vw-2.5rem)] rounded-[24px] p-4 shadow-2xl sm:max-w-md sm:rounded-[32px]">
        <AlertDialogHeader className="flex flex-col items-center">
          {icon && (
            <div
              className={cn(
                "mb-2 flex h-16 w-16 items-center justify-center rounded-full sm:h-14 sm:w-14",
                variant === "danger"
                  ? "bg-red-50 text-red-600"
                  : variant === "warning"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-(--theme-teal-50) text-(--theme-teal-600)"
              )}
            >
              {icon}
            </div>
          )}
          <AlertDialogTitle className="text-center text-2xl font-bold text-(--theme-navy-900) sm:text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription
            asChild
            className="text-center text-sm leading-relaxed text-(--theme-navy-500)"
          >
            <div className="mt-1">{description}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 flex w-full flex-col gap-3 sm:mt-3 sm:flex-row sm:gap-4">
          <AlertDialogCancel
            disabled={isLoading}
            onClick={onClose}
            className="w-full cursor-pointer rounded-xl py-5 hover:bg-(--theme-navy-50) sm:flex-1 sm:rounded-lg sm:py-2"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={cn(
              "w-full cursor-pointer rounded-xl py-5 text-center text-white sm:flex-1 sm:rounded-lg sm:py-2",
              getButtonStyles()
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-center" />
                {loadingText}
              </>
            ) : (
              confirmButtonText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
