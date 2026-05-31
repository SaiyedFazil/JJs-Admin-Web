"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PasswordStrengthIndicator } from "@/components/custom/PasswordStrengthIndicator";
import { validatePassword } from "@/lib/validation";
import { changeAdminPassword } from "@/lib/api/admin/auth-api";

interface ChangePasswordFormProps {
  profileRole: string;
  showToast: (message: string, type: "success" | "error") => void;
  isUpdatingPassword: boolean;
  setIsUpdatingPassword: (updating: boolean) => void;
}

export function ChangePasswordForm({
  profileRole,
  showToast,
  isUpdatingPassword,
  setIsUpdatingPassword,
}: ChangePasswordFormProps) {
  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  // Validation Error States
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const showIndicator =
    newPassword.length > 0 && (isNewPasswordFocused || isConfirmPasswordFocused);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error states
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    // Validate Current Password
    if (!currentPassword) {
      setCurrentPasswordError("Current password is required.");
      hasError = true;
    }

    // Validate New Password
    if (!newPassword) {
      setNewPasswordError("New password is required.");
      hasError = true;
    } else {
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        setNewPasswordError(validation.errors[0]);
        hasError = true;
      } else if (newPassword === currentPassword) {
        setNewPasswordError("New password cannot be the same as the current password.");
        hasError = true;
      }
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your new password.");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Confirmation password does not match.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await changeAdminPassword(currentPassword, newPassword, profileRole);

      if (response.status) {
        showToast(response.message, "success");
        // Clear inputs on success
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(response.message, "error");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update password.";
      showToast(errorMessage, "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <form id="change-password-form" onSubmit={handleUpdatePassword} className="space-y-5">
      {/* Current Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-(--theme-burgundy-900)">
          Current Password
        </label>
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-(--theme-coffee-400)" />
          <Input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (currentPasswordError) setCurrentPasswordError("");
            }}
            placeholder="••••••••"
            disabled={isUpdatingPassword}
            className={`placeholder:text-muted-foreground/50 border-(--theme-burgundy-200) bg-white/40 pr-10 pl-10 focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
              currentPasswordError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            disabled={isUpdatingPassword}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-(--theme-coffee-400) hover:text-(--theme-burgundy-900) focus:outline-none"
          >
            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {currentPasswordError && (
          <p className="mt-1 text-xs font-medium text-red-500">{currentPasswordError}</p>
        )}
      </div>

      {/* New Password with Dynamic Flex Row */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-(--theme-burgundy-900)">New Password</label>

        <div className="relative flex w-full flex-col items-start md:flex-row">
          {/* Input Container */}
          <div
            className={`relative w-full shrink-0 transition-all duration-300 ease-in-out ${
              showIndicator ? "md:w-[58%]" : "md:w-full"
            }`}
          >
            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-(--theme-coffee-400)" />
            <Input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (newPasswordError) setNewPasswordError("");
              }}
              onFocus={() => setIsNewPasswordFocused(true)}
              onBlur={() => setIsNewPasswordFocused(false)}
              placeholder="Minimum 8 characters with strength requirements"
              disabled={isUpdatingPassword}
              className={`placeholder:text-muted-foreground/50 border-(--theme-burgundy-200) bg-white/40 pr-10 pl-10 focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                newPasswordError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={isUpdatingPassword}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-(--theme-coffee-400) hover:text-(--theme-burgundy-900) focus:outline-none"
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Indicator Popover Container */}
          <div
            className={`shrink-0 transition-all duration-300 ease-in-out ${
              showIndicator
                ? "pointer-events-auto mt-3 translate-x-0 transform opacity-100 md:mt-0"
                : "pointer-events-none h-0 transform overflow-hidden opacity-0 md:h-auto md:translate-x-4"
            } z-50 w-full md:absolute md:top-0 md:left-[60%] md:w-[40%]`}
          >
            <PasswordStrengthIndicator
              password={newPassword}
              isFocused={isNewPasswordFocused || isConfirmPasswordFocused}
              className="shadow-theme-md"
            />
          </div>
        </div>
        {newPasswordError && (
          <p className="mt-1 text-xs font-medium text-red-500">{newPasswordError}</p>
        )}
      </div>

      {/* Confirm Password with Matching Dynamic Flex Row */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-(--theme-burgundy-900)">
          Confirm New Password
        </label>

        <div className="flex w-full flex-col items-start md:flex-row">
          {/* Input Container */}
          <div
            className={`relative w-full shrink-0 transition-all duration-300 ease-in-out ${
              showIndicator ? "md:w-[58%]" : "md:w-full"
            }`}
          >
            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-(--theme-coffee-400)" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError("");
              }}
              onFocus={() => setIsConfirmPasswordFocused(true)}
              onBlur={() => setIsConfirmPasswordFocused(false)}
              placeholder="Re-type new password"
              disabled={isUpdatingPassword}
              className={`placeholder:text-muted-foreground/50 border-(--theme-burgundy-200) bg-white/40 pr-10 pl-10 focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                confirmPasswordError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isUpdatingPassword}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-(--theme-coffee-400) hover:text-(--theme-burgundy-900) focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>
        {confirmPasswordError && (
          <p className="mt-1 text-xs font-medium text-red-500">{confirmPasswordError}</p>
        )}
      </div>
    </form>
  );
}
