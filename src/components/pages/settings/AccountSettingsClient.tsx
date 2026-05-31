"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/pages/layout/Breadcrumb";
import { getAdminName, getAdminRole, getAdminPhoneNumber } from "@/lib/admin-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { ForgotPasswordFlow } from "./components/ForgotPasswordFlow";
import { Toast, useToast } from "@/components/common";

export function AccountSettingsClient() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { toast, showToast, hideToast } = useToast();

  // Set breadcrumbs on mount
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "System Settings", href: "/settings" },
      { label: "Account Settings" },
    ]);
  }, [setBreadcrumbs]);

  // Profile States
  const [profileName, setProfileName] = useState("System Admin");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileRole, setProfileRole] = useState("ADMIN");

  // Password Update Loader State
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Forgot / Reset Password States
  const [viewMode, setViewMode] = useState<"change" | "forgot_send" | "forgot_verify">("change");

  // Load cookies on mount
  useEffect(() => {
    const name = getAdminName();
    const phone = getAdminPhoneNumber();
    const role = getAdminRole();

    if (name) setProfileName(name);
    if (phone) setProfilePhone(phone);
    if (role) setProfileRole(role);
  }, []);

  // Get initials from admin name
  const getInitials = (name: string): string => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatRole = (role: string): string => {
    return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="space-y-6 py-4">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={5000} />
      )}

      {/* ── Top Header Profile Card (Full Width) ── */}
      <Card className="theme-card relative overflow-hidden border border-(--theme-burgundy-200)/40 p-6 sm:p-8">
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-(--theme-taupe-100)/20 blur-xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-(--theme-burgundy-100)/20 blur-xl" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            {/* Profile Avatar */}
            <Avatar className="h-20 w-20 shrink-0 rounded-2xl shadow-md ring-4 ring-(--theme-taupe)/35">
              <AvatarFallback className="rounded-2xl bg-(--theme-taupe) text-2xl font-bold text-(--theme-burgundy-950)">
                {getInitials(profileName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col justify-center space-y-1.5">
              <div className="flex flex-col justify-center gap-2 sm:flex-row sm:items-center sm:justify-start">
                <h2 className="text-2xl font-bold tracking-tight text-(--theme-burgundy-950)">
                  {profileName}
                </h2>
                <div className="inline-flex items-center gap-1.5 self-center rounded-full border border-(--theme-burgundy-200) bg-(--theme-burgundy-50) px-3 py-0.5 text-xs font-semibold text-(--theme-burgundy) sm:self-auto">
                  <Shield className="h-3.5 w-3.5" />
                  <span>{formatRole(profileRole)}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-(--theme-coffee-500)">{profilePhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-center rounded-full border border-emerald-100 bg-emerald-50/50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:self-start">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Active Session</span>
          </div>
        </div>
      </Card>

      {/* ── Security Settings Card (Change Password Form) ── */}
      <Card className="theme-card border border-(--theme-burgundy-200)/40">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-(--theme-burgundy-100)/50 pb-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-bold text-(--theme-burgundy-950)">
              {viewMode === "change" ? "Change Password" : "Reset Password via OTP"}
            </CardTitle>
            <CardDescription className="text-xs text-(--theme-coffee-500)">
              {viewMode === "change"
                ? "Keep your administrative account highly secure by updating your access password."
                : viewMode === "forgot_send"
                  ? "Begin your password reset by requesting a verification OTP to your registered phone."
                  : "Verify the OTP code sent to your phone and set a secure new password."}
            </CardDescription>
          </div>
          {viewMode === "change" ? (
            <div className="flex shrink-0 items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setViewMode("forgot_send");
                }}
                className="cursor-pointer text-xs font-semibold text-(--theme-burgundy) hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
              <Button
                type="submit"
                form="change-password-form"
                disabled={isUpdatingPassword}
                variant="premium"
                className="cursor-pointer hover:bg-(--theme-burgundy-800)"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setViewMode("change");
              }}
              className="shrink-0 cursor-pointer text-xs font-semibold text-(--theme-burgundy) hover:underline focus:outline-none"
            >
              Remember Current Password?
            </button>
          )}
        </CardHeader>
        <CardContent>
          {viewMode === "change" && (
            <ChangePasswordForm
              profileRole={profileRole}
              showToast={showToast}
              isUpdatingPassword={isUpdatingPassword}
              setIsUpdatingPassword={setIsUpdatingPassword}
            />
          )}

          {viewMode !== "change" && (
            <ForgotPasswordFlow
              viewMode={viewMode}
              setViewMode={setViewMode}
              profilePhone={profilePhone}
              profileRole={profileRole}
              showToast={showToast}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
