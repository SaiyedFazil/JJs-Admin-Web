"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ImagePlay, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/pages/layout/Breadcrumb";

export function AppCustomizationClient() {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard", href: "/dashboard" }, { label: "App Customization" }]);
  }, [setBreadcrumbs]);

  return (
    <div className="py-4">
      {/* ── Core Options Grid ── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Option 1: Banners Management Card */}
        <Card className="theme-card group relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:border-(--theme-taupe-400) hover:shadow-xl">
          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-(--theme-taupe-100)/20 blur-xl transition-transform duration-300 group-hover:scale-125" />

          <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Banners Icon */}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-(--theme-taupe-100) text-(--theme-taupe-600) ring-4 ring-(--theme-taupe-50) transition-transform duration-300 group-hover:rotate-6">
                <ImagePlay className="h-7 w-7 text-(--theme-taupe-700)" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1">
                  <span className="text-xs font-semibold tracking-wider text-(--theme-taupe-600) uppercase">
                    Visual Promotion
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-(--theme-burgundy-950)">
                  Banners Management
                </h2>
                <p className="text-sm leading-relaxed text-(--theme-coffee-500)">
                  Design, schedule, and organize active advertising and promotional banners featured
                  on the home screen of the customer apps. Set run timelines, priority tiers, and
                  deep-link click redirections.
                </p>
              </div>
            </div>

            {/* Action button */}
            <Button
              variant="accent"
              size="lg"
              className="flex w-full cursor-pointer items-center justify-center gap-2 group-hover:bg-(--theme-taupe-300) hover:bg-(--theme-taupe-300)"
              asChild
            >
              <Link href="/app-customization/banners">
                <span>Manage Banners</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Option 2: App Settings Setup Card */}
        <Card className="theme-card group relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:border-(--theme-burgundy-300) hover:shadow-xl">
          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-(--theme-burgundy-100)/20 blur-xl transition-transform duration-300 group-hover:scale-125" />

          <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* App Settings Icon */}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-(--theme-burgundy-100) text-(--theme-burgundy-600) ring-4 ring-(--theme-burgundy-50) transition-transform duration-300 group-hover:-rotate-6">
                <SlidersHorizontal className="h-7 w-7 text-(--theme-burgundy-700)" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1">
                  <span className="text-xs font-semibold tracking-wider text-(--theme-burgundy-500) uppercase">
                    App Preferences
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-(--theme-burgundy-950)">
                  App Settings
                </h2>
                <p className="text-sm leading-relaxed text-(--theme-coffee-500)">
                  Control core configuration switches, display variables, operational modes, active
                  alerts, and announcement notices. Adjust global interface toggles to personalize
                  user experience dynamically.
                </p>
              </div>
            </div>

            {/* Action button */}
            <Button
              variant="premium"
              size="lg"
              className="flex w-full cursor-pointer items-center justify-center gap-2 hover:bg-(--theme-burgundy-700)"
              asChild
            >
              <Link href="/app-customization/settings">
                <span>Manage App Settings</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
