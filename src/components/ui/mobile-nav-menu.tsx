"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HelpCircleIcon,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Mail,
  MessageSquareText,
  Headphones,
  X,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import type { Navbar05NavItem } from "./navbar";
import { version } from "../../../package.json";

// ─── Types ──────────────────────────────────────────────
type MenuView = "main" | "notifications" | "help";

interface MobileNavMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navigationLinks: Navbar05NavItem[];
  userName?: string;
  userAvatar?: string;
  userRole?: string;
  onNavItemClick?: (href: string) => void;
  onInfoItemClick?: (item: string) => void;
  onUserItemClick?: (item: string) => void;
}

// ─── Component ──────────────────────────────────────────
export function MobileNavMenu({
  open,
  onOpenChange,
  navigationLinks,
  userName = "User",
  userAvatar,
  userRole = "CONSULTANT",
  onNavItemClick,
  onInfoItemClick,
  onUserItemClick,
}: MobileNavMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeView, setActiveView] = React.useState<MenuView>("main");

  // Reset to main view when menu closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Small delay to let close animation play before resetting view
      setTimeout(() => setActiveView("main"), 300);
    }
    onOpenChange(newOpen);
  };

  // Format role display name
  const formatRoleDisplay = (role: string) => {
    return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Get user initials
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    // Prevent default Link behavior to avoid Next.js interrupting the close animation
    e.preventDefault();

    // 1. Instantly close the menu
    handleOpenChange(false);

    // 2. Safely navigate programmatically AFTER the animation completes
    // A 300ms delay perfectly aligns with the CSS transition duration, avoiding main thread freezes
    if (href && href !== "#") {
      setTimeout(() => {
        router.push(href);
        if (onNavItemClick) {
          onNavItemClick(href);
        }
      }, 150);
    }
  };

  const handleInfoClick = (item: string) => {
    handleOpenChange(false);
    setTimeout(() => {
      onInfoItemClick?.(item);
    }, 150);
  };

  const handleUserAction = (item: string) => {
    handleOpenChange(false);
    setTimeout(() => {
      onUserItemClick?.(item);
    }, 150);
  };

  const isSettingsActive =
    (userRole === "CLIENT" &&
      (pathname === "/client/settings" || pathname?.startsWith("/client/settings/"))) ||
    (userRole === "CONSULTANT" && (pathname === "/settings" || pathname?.startsWith("/settings/")));

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="w-[300px] border-r-0 p-0 sm:max-w-[300px] [&>button]:hidden"
      >
        {/* Accessible title & description - visually hidden */}
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Mobile navigation menu featuring quick links, notifications, and profile settings.
        </SheetDescription>

        {/* ───── Header ───── */}
        <div
          className="relative overflow-hidden px-5 pt-5 pb-4"
          style={{
            background: "var(--theme-burgundy)",
          }}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white opacity-10" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white opacity-[0.07]" />

          {/* Close button */}
          <button
            onClick={() => handleOpenChange(false)}
            className="absolute top-6 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition-all duration-200 hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* User profile card */}
          <div className="flex items-center gap-3 pr-10">
            <div className="relative">
              <Avatar className="h-11 w-11 shadow-lg ring-2 ring-white/25">
                <AvatarImage src={userAvatar} alt={userName} className="object-cover" />
                <AvatarFallback
                  className="text-xs font-bold"
                  style={{
                    background: "var(--theme-taupe)",
                    color: "var(--theme-burgundy-900)",
                  }}
                >
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              {/* <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-(--theme-burgundy) bg-emerald-400" /> */}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{userName}</p>
              <p className="text-xs font-medium" style={{ color: "var(--theme-taupe-300)" }}>
                {formatRoleDisplay(userRole)}
              </p>
            </div>
          </div>
        </div>

        {/* ─── View Container with transition ─── */}
        <div className="relative flex-1 overflow-hidden">
          {/* ═══════ MAIN VIEW ═══════ */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out",
              activeView === "main" ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {/* Navigation Links Section */}
              <div className="mb-2">
                <p
                  className="mb-1.5 px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase"
                  style={{ color: "var(--theme-burgundy-400)" }}
                >
                  Navigation
                </p>
                <nav className="space-y-0.5">
                  {navigationLinks.map((link, index) => {
                    const linkPath = link.href ? link.href.split("?")[0] : "";
                    const isActive =
                      linkPath && linkPath !== "#"
                        ? pathname === linkPath || pathname?.startsWith(linkPath + "/")
                        : false;

                    return (
                      <Link
                        key={index}
                        href={link.href || "#"}
                        onClick={(e) => handleNavClick(e, link.href || "#")}
                        prefetch={false}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive ? "shadow-sm" : "hover:bg-(--theme-burgundy-50)"
                        )}
                        style={
                          isActive
                            ? {
                                background: "var(--theme-taupe-50)",
                                color: "var(--theme-burgundy-900)",
                              }
                            : {
                                color: "var(--theme-burgundy-600)",
                              }
                        }
                      >
                        {/* Active indicator bar */}
                        {isActive && (
                          <span
                            className="absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
                            style={{ background: "var(--theme-taupe-500)" }}
                          />
                        )}
                        {link.icon && (
                          <span
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 [&_svg]:h-[18px] [&_svg]:w-[18px]",
                              isActive ? "" : "group-hover:shadow-sm"
                            )}
                            style={
                              isActive
                                ? {
                                    background: "var(--theme-taupe-100)",
                                    color: "var(--theme-taupe-700)",
                                  }
                                : {
                                    background: "var(--theme-burgundy-50)",
                                    color: "var(--theme-burgundy-400)",
                                  }
                            }
                          >
                            {link.icon}
                          </span>
                        )}
                        <span className="flex-1">{link.label}</span>
                        {isActive && (
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: "var(--theme-taupe-500)" }}
                          />
                        )}
                      </Link>
                    );
                  })}

                  {/* Settings Item - Below Navigation Links */}
                  <button
                    onClick={() => handleUserAction("settings")}
                    className={cn(
                      "group relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isSettingsActive ? "shadow-sm" : "hover:bg-(--theme-burgundy-50)"
                    )}
                    style={
                      isSettingsActive
                        ? {
                            background: "var(--theme-taupe-50)",
                            color: "var(--theme-burgundy-900)",
                          }
                        : {
                            color: "var(--theme-burgundy-600)",
                          }
                    }
                  >
                    {/* Active indicator bar */}
                    {isSettingsActive && (
                      <span
                        className="absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
                        style={{ background: "var(--theme-taupe-500)" }}
                      />
                    )}
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 [&_svg]:h-[18px] [&_svg]:w-[18px]",
                        isSettingsActive ? "" : "group-hover:shadow-sm"
                      )}
                      style={
                        isSettingsActive
                          ? {
                              background: "var(--theme-taupe-100)",
                              color: "var(--theme-taupe-700)",
                            }
                          : {
                              background: "var(--theme-burgundy-50)",
                              color: "var(--theme-burgundy-400)",
                            }
                      }
                    >
                      <Settings className="h-[18px] w-[18px]" />
                    </span>
                    <span className="flex-1 text-left">Settings</span>
                    {isSettingsActive && (
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--theme-taupe-500)" }}
                      />
                    )}
                  </button>
                </nav>
              </div>
            </div>

            {/* ───── Footer (Help & Support + Log Out) ───── */}
            <div
              className="border-t px-3 py-3"
              style={{ borderColor: "var(--theme-burgundy-100)" }}
            >
              {/* Help & Support Section */}
              <button
                onClick={() => setActiveView("help")}
                className="group relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-(--theme-burgundy-50)"
                style={{ color: "var(--theme-burgundy-600)" }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
                  style={{
                    background: "var(--theme-burgundy-50)",
                    color: "var(--theme-burgundy-400)",
                  }}
                >
                  <HelpCircleIcon className="h-[18px] w-[18px]" />
                </span>
                <span className="flex-1 text-left">Help & Support</span>
              </button>

              {/* Log Out */}
              <button
                onClick={() => handleUserAction("logout")}
                className="group relative mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all duration-200 group-hover:bg-red-100 group-hover:text-red-600">
                  <LogOut className="h-[18px] w-[18px]" />
                </span>
                <span className="flex-1 text-left">Log out</span>
              </button>

              {/* Version Info */}
              <div className="mt-2 flex justify-center">
                <span className="text-xs font-semibold tracking-wide text-slate-400">
                  Version {version}
                </span>
              </div>
            </div>
          </div>

          {/* ═══════ HELP & SUPPORT VIEW ═══════ */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out",
              activeView === "help" ? "translate-x-0" : "translate-x-full"
            )}
          >
            {/* Help header with back button */}
            <div
              className="-pt-2 flex items-center gap-3 border-b px-3 pb-3"
              style={{ borderColor: "var(--theme-burgundy-100)" }}
            >
              <button
                onClick={() => setActiveView("main")}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 hover:bg-(--theme-burgundy-50)"
                style={{ color: "var(--theme-burgundy-500)" }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex flex-1 items-center gap-2">
                <HelpCircleIcon
                  className="h-4 w-4"
                  style={{ color: "var(--theme-burgundy-500)" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--theme-burgundy-900)" }}
                >
                  Help & Support
                </span>
              </div>
            </div>

            {/* Help items list */}
            <div className="flex-1 overflow-y-auto py-2">
              {[
                {
                  label: "Privacy Policy",
                  key: "privacy",
                  description: "Read our privacy policy",
                  icon: <HelpCircleIcon className="h-[18px] w-[18px]" />,
                },
                {
                  label: "Terms & Conditions",
                  key: "terms",
                  description: "Review our rules and guidelines",
                  icon: <BookOpen className="h-[18px] w-[18px]" />,
                },
                {
                  label: "Contact Support",
                  key: "contact",
                  description: "Get in touch with our team",
                  icon: <Headphones className="h-[18px] w-[18px]" />,
                },
                {
                  label: "FAQs",
                  key: "faq",
                  description: "Frequently asked questions",
                  icon: <MessageSquareText className="h-[18px] w-[18px]" />,
                },
              ].map((item, index, arr) => (
                <React.Fragment key={item.key}>
                  <button
                    onClick={() => handleInfoClick(item.key)}
                    className="group flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-(--theme-burgundy-50)"
                  >
                    <div
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: "var(--theme-burgundy-50)",
                        color: "var(--theme-burgundy-400)",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm leading-snug font-semibold"
                        style={{ color: "var(--theme-burgundy-900)" }}
                      >
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--theme-burgundy-400)" }}>
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight
                      className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                      style={{ color: "var(--theme-burgundy-300)" }}
                    />
                  </button>
                  {index < arr.length - 1 && (
                    <div
                      className="mx-4 h-px"
                      style={{ background: "var(--theme-burgundy-100)" }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Help footer */}
            <div
              className="border-t px-4 py-3"
              style={{ borderColor: "var(--theme-burgundy-100)" }}
            >
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" style={{ color: "var(--theme-burgundy-400)" }} />
                <span className="text-[11px]" style={{ color: "var(--theme-burgundy-400)" }}>
                  support@unicon.Work
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
