"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

/**
 * 404 Not Found — rendered inside the authenticated sidebar layout.
 *
 * LayoutClient already handles:
 *  - Auth guard (redirects to /login when unauthenticated)
 *  - Sidebar + navbar shell
 *
 * This component just needs to fill the content area and centre the 404 UI.
 * `flex flex-1` lets it expand into the `flex flex-col flex-1` main element
 * from LayoutClient, achieving true vertical centering.
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      {/* Soft decorative blobs — relative to this container */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-xl">
        <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-(--theme-cream-50) opacity-70 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-(--theme-coffee-50) opacity-60 blur-3xl" />
      </div>

      {/* 404 block */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* Large "404" */}
        <h1 className="text-[8rem] leading-none font-bold tracking-tighter text-(--theme-burgundy-900) sm:text-[10rem]">
          404
        </h1>

        <p className="mt-1 text-2xl font-bold text-(--theme-taupe-600) sm:text-3xl">
          Page Not Found
        </p>

        <p className="mt-4 max-w-md text-base text-(--theme-burgundy-500)">
          The page you&apos;re looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* Go Back */}
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl border-2 border-(--theme-coffee-200) bg-white px-8 text-base font-semibold text-(--theme-burgundy-700) transition-all hover:border-(--theme-taupe-300) hover:bg-(--theme-coffee-50)"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>

          {/* Dashboard */}
          <Link
            href="/dashboard"
            prefetch={false}
            className="inline-flex h-12 items-center gap-2 rounded-xl px-8 text-base font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
            style={{ backgroundColor: "var(--theme-burgundy-900)" }}
          >
            <Home className="size-4" />
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
