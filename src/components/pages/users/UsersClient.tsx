"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Users, ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/pages/layout/Breadcrumb";

export function UsersClient() {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard", href: "/dashboard" }, { label: "Users Management" }]);
  }, [setBreadcrumbs]);

  return (
    <div className="py-4">
      {/* ── Core Options Grid ── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Option 1: Application Users Card */}
        <Card className="theme-card group relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:border-(--theme-taupe-400) hover:shadow-xl">
          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-(--theme-taupe-100)/20 blur-xl transition-transform duration-300 group-hover:scale-125" />

          <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Application Users Icon */}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-(--theme-taupe-100) text-(--theme-taupe-600) ring-4 ring-(--theme-taupe-50) transition-transform duration-300 group-hover:rotate-6">
                <Users className="h-7 w-7 text-(--theme-taupe-700)" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1">
                  <span className="text-xs font-semibold tracking-wider text-(--theme-taupe-600) uppercase">
                    Customer Directory
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-(--theme-burgundy-950)">
                  Application Users
                </h2>
                <p className="text-sm leading-relaxed text-(--theme-coffee-500)">
                  Browse and search every customer using the JJ&apos;s Kitchen application. Look up
                  profiles by name, email or phone number and review their contact details at a
                  glance.
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
              <Link href="/users/application-users">
                <span>View Application Users</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Option 2: Admin & Rider Users Card */}
        <Card className="theme-card group relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:border-(--theme-burgundy-300) hover:shadow-xl">
          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-(--theme-burgundy-100)/20 blur-xl transition-transform duration-300 group-hover:scale-125" />

          <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Admin & Rider Users Icon */}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-(--theme-burgundy-100) text-(--theme-burgundy-600) ring-4 ring-(--theme-burgundy-50) transition-transform duration-300 group-hover:-rotate-6">
                <ShieldCheck className="h-7 w-7 text-(--theme-burgundy-700)" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1">
                  <span className="text-xs font-semibold tracking-wider text-(--theme-burgundy-500) uppercase">
                    Staff Directory
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-(--theme-burgundy-950)">
                  Admin &amp; Rider Users
                </h2>
                <p className="text-sm leading-relaxed text-(--theme-coffee-500)">
                  Manage staff accounts — super admins, admins and delivery riders. Filter by role
                  and search the team to quickly find the account you need.
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
              <Link href="/users/admin-rider-users">
                <span>View Admin &amp; Rider Users</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
