"use client";

import React, { useEffect, useState } from "react";
import { getAdminName, getAdminRole } from "@/lib/admin-auth";
import { LayoutDashboard, Users, Briefcase, Mail, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [adminName, setAdminName] = useState("Administrator");
  const [adminRole, setAdminRole] = useState("ADMIN");

  useEffect(() => {
    const name = getAdminName();
    const role = getAdminRole();
    if (name) setAdminName(name);
    if (role) setAdminRole(role);
  }, []);

  const stats = [
    {
      title: "Consultants",
      value: "24",
      description: "Active onboarding consultants",
      icon: Users,
      color: "text-(--theme-taupe)",
    },
    {
      title: "Active Jobs",
      value: "142",
      description: "Jobs currently published",
      icon: Briefcase,
      color: "text-(--theme-coffee)",
    },
    {
      title: "Verification Requests",
      value: "8",
      description: "Pending link/certificate reviews",
      icon: ShieldCheck,
      color: "text-(--theme-burgundy)",
    },
    {
      title: "Email Logs",
      value: "1,248",
      description: "Total emails sent today",
      icon: Mail,
      color: "text-(--theme-cream-600)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-theme-gradient relative overflow-hidden rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-(--theme-taupe-200) opacity-20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-(--theme-coffee-200) opacity-20 blur-3xl" />

        <div className="relative z-10 space-y-2">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            {adminRole.replace(/_/g, " ")} Portal
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {adminName}!
          </h1>
          <p className="max-w-xl text-white/80">
            Welcome to the JJs Kitchen Administration system. Access and manage onboarding
            configurations, job publications, content verification requests, and email logs.
          </p>
        </div>
      </div>

      {/* Grid Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="theme-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold tracking-wider text-(--theme-burgundy-600) uppercase">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-(--theme-burgundy-950)">{stat.value}</div>
              <p className="mt-1 text-xs text-(--theme-coffee-500)">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder Details Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="theme-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-(--theme-burgundy-900)">
            <LayoutDashboard className="h-5 w-5 text-(--theme-taupe)" />
            Recent Activity Log
          </h2>
          <div className="space-y-4">
            {[
              "System configuration updated by Super Admin",
              "New consultant registration request received",
              "Job publication status modified: Job #12048",
              "System backup successfully executed",
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 border-b border-(--theme-burgundy-100) pb-3 last:border-0 last:pb-0"
              >
                <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--theme-taupe)" />
                <div>
                  <p className="text-sm font-medium text-(--theme-burgundy-900)">{activity}</p>
                  <p className="mt-0.5 text-xs text-(--theme-coffee-400)">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="theme-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-(--theme-burgundy-900)">
            <Users className="h-5 w-5 text-(--theme-coffee)" />
            Pending Actions Checklist
          </h2>
          <div className="space-y-4">
            {[
              "Verify 3 consultant certificate uploads",
              "Review 5 reported onboarding links",
              "Check system email failure logs (2 warnings)",
              "Approve pending onboarding templates",
            ].map((action, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  disabled
                  className="h-4 w-4 rounded border-(--theme-burgundy-300) text-(--theme-taupe) focus:ring-(--theme-taupe)"
                />
                <span className="text-sm font-medium text-(--theme-burgundy-800)">{action}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
