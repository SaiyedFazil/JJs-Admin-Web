"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, Phone, ChevronRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { adminLogin } from "@/lib/api/admin/auth-api";

/**
 * Admin Login Page Component
 * Features a modern, professional interface specifically designed for administrators
 */
export function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  // Check if admin is already authenticated on page load
  useEffect(() => {
    if (isAdminAuthenticated()) {
      // Admin is already logged in, redirect to dashboard
      router.replace("/dashboard");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!phoneNumber || !password) {
        setIsLoading(false);
        throw new Error("Please enter both mobile number and password");
      }

      const cleanedPhone = phoneNumber.trim().replace(/[^\d]/g, "");
      if (cleanedPhone.length < 10) {
        setIsLoading(false);
        throw new Error("Please enter a valid mobile number (at least 10 digits)");
      }

      // Call the admin login API
      await adminLogin({
        phone_number: cleanedPhone,
        password: password,
      });

      // Redirect to admin dashboard on success
      // Note: We do NOT set isLoading to false here - loader continues until navigation completes
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading screen while checking if admin is already authenticated
  if (isCheckingAuth) {
    return (
      <div className="bg-background-secondary relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        <AdminBackground />
        <div className="relative z-10 flex flex-col items-center">
          <Spinner variant="circle-filled" size={80} className="text-accent" />
          <p className="text-foreground-secondary mt-4 text-sm font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4">
      {/* Background Elements */}
      <AdminBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Main Card */}
        <div className="glass-effect overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:bg-black/40">
          {/* Header Section */}
          <div className="bg-primary relative h-44 w-full overflow-hidden p-6 text-center">
            <div className="bg-primary-hover absolute inset-0 opacity-90" />
            <div className="bg-accent absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-20 blur-2xl" />
            <div className="bg-secondary absolute -bottom-10 -left-10 h-32 w-32 rounded-full opacity-20 blur-2xl" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 flex flex-col items-center justify-center text-white"
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/logo/PNG/JJ_s_Transperent.png"
                  loading="eager"
                  alt="JJ's Kitchen Logo"
                  width={200}
                  height={200}
                  unoptimized
                  className="h-auto max-h-[100px] w-auto object-contain"
                />
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-wide">Admin Login</h1>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-foreground-secondary text-xs font-semibold tracking-wider uppercase">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="text-foreground-subtle absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isLoading}
                      className="border-border focus:border-primary focus:ring-primary-light bg-white/50 pl-10 transition-all focus:bg-white disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-foreground-secondary text-xs font-semibold tracking-wider uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="text-foreground-subtle absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="border-border focus:border-primary focus:ring-primary-light bg-white/50 pr-10 pl-10 transition-all focus:bg-white disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading}
                      className="text-foreground-subtle hover:text-foreground-secondary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors focus:outline-none disabled:opacity-60"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-500"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="group bg-primary hover:bg-primary-hover relative h-11 w-full cursor-pointer overflow-hidden rounded-xl text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Login to Dashboard</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </Button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Footer copyright - positioned at the bottom middle */}
      <div className="text-foreground-subtle fixed right-0 bottom-6 left-0 z-10 px-4 text-center text-xs">
        &copy; {new Date().getFullYear()} JJ&apos;s Kitchen Admin Portal. Secure Access Only.
      </div>
    </div>
  );
}

function AdminBackground() {
  return (
    <div className="pointer-events-none fixed inset-0">
      {/* Base Background */}
      <div className="bg-background-secondary absolute inset-0 opacity-60" />

      {/* Culinary Background Image Watermark */}
      <div className="absolute inset-0 select-none">
        <Image
          src="/images/background/login_bg.png"
          alt="JJ's Kitchen Background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        {/* Soft radial overlay to focus on the center card */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle, transparent 30%, var(--background-secondary) 90%)",
          }}
        />
      </div>

      {/* Animated Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="bg-accent-light absolute top-[-10%] left-[-10%] h-[50vh] w-[50vh] rounded-full opacity-20 blur-[100px]"
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="bg-primary-light absolute right-[-10%] bottom-[-10%] h-[60vh] w-[60vh] rounded-full opacity-20 blur-[120px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="bg-secondary-light absolute top-[20%] right-[20%] h-[30vh] w-[30vh] rounded-full opacity-15 blur-[80px]"
      />
    </div>
  );
}
