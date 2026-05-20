"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

/**
 * Professional 404 Not Found Page
 * Features:
 * - Attractive, modern design matching app theme
 * - Animated countdown timer
 * - Auto-redirect to login page after countdown
 * - Quick action buttons for navigation
 */
export default function NotFound() {
  const router = useRouter();

  return (
    // Fixed positioning with high z-index to cover the main layout navbar
    <div className="fixed inset-0 z-100 flex flex-col bg-white">
      {/* Header with Logo - Absolute positioned to remove top spacing issues */}
      <header className="absolute top-0 left-0 -mt-4 pl-4">
        <Link
          href="/"
          prefetch={false}
          className="inline-block transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/logo/logo-with-name-without-bg.webp"
            alt="uniCon Logo"
            width={140}
            height={40}
            priority
            className="h-auto w-auto"
          />
        </Link>
      </header>

      {/* Main Content - Centered */}
      <main className="flex flex-1 flex-col items-center justify-center p-1 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md"
        >
          {/* Large 404 Text */}
          <h1 className="text-8xl font-bold tracking-tighter text-(--theme-navy-900) sm:text-9xl">
            404
          </h1>

          <div className="mt-2 text-2xl font-bold text-(--theme-teal-600) sm:text-3xl">
            Page Not Found
          </div>

          <p className="mt-4 text-base text-(--theme-navy-600)">
            The page you are looking for might have been removed, had its name changed, or is
            temporarily unavailable.
          </p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => router.back()}
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-(--theme-blue-200) bg-white px-8 text-base font-semibold text-(--theme-navy-700) transition-all hover:border-(--theme-teal-300) hover:bg-(--theme-blue-50) sm:w-auto"
            >
              Go Back
            </button>
            <Link
              href="/login"
              prefetch={false}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--theme-navy-900) px-8 text-base font-semibold text-white transition-all hover:bg-black hover:shadow-lg sm:w-auto"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative Background Elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-(--theme-mint-50) opacity-70 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-(--theme-blue-50) opacity-70 blur-3xl" />
      </div>
    </div>
  );
}
