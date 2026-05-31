"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { FolderTree, ChefHat, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/pages/layout/Breadcrumb";

export function ProductsClient() {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard", href: "/dashboard" }, { label: "Product Management" }]);
  }, [setBreadcrumbs]);

  return (
    <div className="py-4">
      {/* ── Core Options Grid ── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Option 1: Category Management Card */}
        <Card className="theme-card group relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:border-(--theme-taupe-400) hover:shadow-xl">
          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-(--theme-taupe-100)/20 blur-xl transition-transform duration-300 group-hover:scale-125" />

          <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category Icon */}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-(--theme-taupe-100) text-(--theme-taupe-600) ring-4 ring-(--theme-taupe-50) transition-transform duration-300 group-hover:rotate-6">
                <FolderTree className="h-7 w-7 text-(--theme-taupe-700)" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1">
                  <span className="text-xs font-semibold tracking-wider text-(--theme-taupe-600) uppercase">
                    Menu Hierarchy
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-(--theme-burgundy-950)">
                  Category Management
                </h2>
                <p className="text-sm leading-relaxed text-(--theme-coffee-500)">
                  Design and order structural branches for your digital menu boards and client apps.
                  Configure category priority levels, add thematic illustrations, and switch
                  seasonal availabilities instantly.
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
              <Link href="/products/categories">
                <span>Manage Categories</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Option 2: Menu Items Setup Card */}
        <Card className="theme-card group relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:border-(--theme-burgundy-300) hover:shadow-xl">
          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-(--theme-burgundy-100)/20 blur-xl transition-transform duration-300 group-hover:scale-125" />

          <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Menu Items Icon */}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-(--theme-burgundy-100) text-(--theme-burgundy-600) ring-4 ring-(--theme-burgundy-50) transition-transform duration-300 group-hover:-rotate-6">
                <ChefHat className="h-7 w-7 text-(--theme-burgundy-700)" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1">
                  <span className="text-xs font-semibold tracking-wider text-(--theme-burgundy-500) uppercase">
                    Recipe Directory
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-(--theme-burgundy-950)">
                  Menu Items
                </h2>
                <p className="text-sm leading-relaxed text-(--theme-coffee-500)">
                  Supervise the master index of gourmet recipes, beverages, and pricing sets. Edit
                  listing descriptions, define nutritional profiles, specify allergen disclaimers,
                  and upload crisp media assets.
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
              <Link href="/products/items">
                <span>Manage Menu Items</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
