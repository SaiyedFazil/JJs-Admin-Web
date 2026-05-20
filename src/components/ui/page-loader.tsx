import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/loader";

interface PageLoaderProps {
  className?: string;
  loadingMessage?: string;
}

/**
 * Reusable loading component for page loading states.
 * Used as a Suspense fallback across the application.
 */
export function PageLoader({ className, loadingMessage = "Loading..." }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-(--theme-mint-50)",
        className
      )}
    >
      <div className="flex flex-col items-center">
        <Spinner variant="circle-filled" size={80} className="text-(--theme-navy)" />
        <p className="mt-2 text-sm text-(--theme-blue-600)">{loadingMessage}</p>
      </div>
    </div>
  );
}

export default PageLoader;
