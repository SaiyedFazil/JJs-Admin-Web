"use client";

import React, { useState, useRef } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordStrengthIndicator } from "@/components/custom/PasswordStrengthIndicator";
import { validatePassword } from "@/lib/validation";
import { forgotAdminPassword, resetAdminPassword } from "@/lib/api/admin/auth-api";

interface ForgotPasswordFlowProps {
  viewMode: "forgot_send" | "forgot_verify";
  setViewMode: React.Dispatch<React.SetStateAction<"change" | "forgot_send" | "forgot_verify">>;
  profilePhone: string;
  profileRole: string;
  showToast: (message: string, type: "success" | "error") => void;
}

export function ForgotPasswordFlow({
  viewMode,
  setViewMode,
  profilePhone,
  profileRole,
  showToast,
}: ForgotPasswordFlowProps) {
  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  // Validation Error States
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Forgot / Reset Password States
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [resetAuthToken, setResetAuthToken] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [otpError, setOtpError] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showIndicator =
    newPassword.length > 0 && (isNewPasswordFocused || isConfirmPasswordFocused);

  // OTP Keyboard Handling
  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, "").slice(-1);
    setOtp(newOtp);

    if (otpError) setOtpError("");

    if (newOtp[index] !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Enable Reset Button Conditionals
  const isOtpComplete = otp.join("").length === 6;
  const isNewPasswordValid = validatePassword(newPassword).isValid;
  const isConfirmPasswordMatching = newPassword === confirmPassword && confirmPassword.length > 0;
  const isResetSubmitEnabled =
    isOtpComplete && isNewPasswordValid && isConfirmPasswordMatching && !isResettingPassword;

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      const response = await forgotAdminPassword(profilePhone, profileRole);
      if (response.status) {
        showToast(response.message, "success");
        setResetAuthToken(response.authToken || "");
        setViewMode("forgot_verify");
      } else {
        showToast(response.message, "error");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send OTP.";
      showToast(errorMessage, "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setOtpError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter all 6 digits of the OTP.");
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setNewPasswordError(validation.errors[0]);
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Confirmation password does not match.");
      return;
    }

    setIsResettingPassword(true);
    try {
      const response = await resetAdminPassword(code, newPassword, profileRole, resetAuthToken);
      if (response.status) {
        showToast(response.message, "success");
        setOtp(["", "", "", "", "", ""]);
        setNewPassword("");
        setConfirmPassword("");
        setViewMode("change");
      } else {
        showToast(response.message, "error");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reset password.";
      showToast(errorMessage, "error");
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <>
      {viewMode === "forgot_send" && (
        <div className="animate-fadeIn flex w-full flex-col items-center justify-center py-2">
          {/* Centered Phone Card & Send Button */}
          <div className="shadow-theme-sm w-full max-w-md space-y-5 rounded-2xl border border-(--theme-burgundy-100)/60 bg-white/50 p-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-(--theme-burgundy-900)">
                Registered Mobile Number
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-(--theme-burgundy-200) bg-white p-4 shadow-inner">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--theme-burgundy-50) text-(--theme-burgundy)">
                  <Lock className="h-4 w-4" />
                </div>
                <span className="text-base font-bold tracking-wide text-(--theme-burgundy-950)">
                  {profilePhone || "Registered Phone Number"}
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp || !profilePhone}
              variant="premium"
              className="shadow-theme-md w-full cursor-pointer justify-center py-2.5 hover:bg-(--theme-burgundy-800)"
            >
              {isSendingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP SMS...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </div>
        </div>
      )}

      {viewMode === "forgot_verify" && (
        <form onSubmit={handleResetPassword} className="animate-fadeIn space-y-5">
          {/* 6 OTP Fields */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-(--theme-burgundy-900)">
              Enter 6-Digit OTP
            </label>
            <div className="flex items-center gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    otpRefs.current[idx] = el;
                  }}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  className={`h-12 w-10 border-(--theme-burgundy-200) bg-white/40 text-center text-lg font-bold focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) sm:h-14 sm:w-12 ${
                    otpError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  disabled={isResettingPassword}
                />
              ))}
            </div>
            {otpError && <p className="mt-1 text-xs font-medium text-red-500">{otpError}</p>}
          </div>

          {/* New Password with Flex Row */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-(--theme-burgundy-900)">
              New Password
            </label>

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
                  disabled={isResettingPassword}
                  className={`placeholder:text-muted-foreground/50 border-(--theme-burgundy-200) bg-white/40 pr-10 pl-10 focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                    newPasswordError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isResettingPassword}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-(--theme-coffee-400) hover:text-(--theme-burgundy-900) focus:outline-none"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Popover */}
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

          {/* Confirm Password with Flex Row */}
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
                  disabled={isResettingPassword}
                  className={`placeholder:text-muted-foreground/50 border-(--theme-burgundy-200) bg-white/40 pr-10 pl-10 focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                    confirmPasswordError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isResettingPassword}
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

          {/* Submit Action */}
          <div className="flex justify-end border-t border-(--theme-burgundy-100)/60 pt-4">
            <Button
              type="submit"
              disabled={!isResetSubmitEnabled}
              variant="premium"
              className="cursor-pointer hover:bg-(--theme-burgundy-800) disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
