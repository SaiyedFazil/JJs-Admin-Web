"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { MobileNavMenu } from "./mobile-nav-menu";
import {
  HelpCircleIcon,
  ChevronDownIcon,
  Home,
  Briefcase,
  Heart,
  MessageSquare,
  User,
  Settings,
  LogOut,
  UserCircle,
  Shield,
} from "lucide-react";
import { Button } from "./button";
// import { Input } from "./input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./navigation-menu";
// Popover no longer needed – mobile menu uses MobileNavMenu (Sheet)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "@/lib/utils";
import { version } from "../../../package.json";

// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 324 323"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="88.1023"
        y="144.792"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 88.1023 144.792)"
        fill="currentColor"
      />
      <rect
        x="85.3459"
        y="244.537"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 85.3459 244.537)"
        fill="currentColor"
      />
    </svg>
  );
};

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center translate-y-[-7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
    />
  </svg>
);

// Info Menu Component
const InfoMenu = ({ onItemClick }: { onItemClick?: (item: string) => void }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
        <HelpCircleIcon className="h-4 w-4" />
        <span className="sr-only">Help and Information</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>Help & Support</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("privacy")} className="cursor-pointer">
        Privacy Policy
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("terms")} className="cursor-pointer">
        Terms & Conditions
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("contact")} className="cursor-pointer">
        Contact Support
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("faq")} className="cursor-pointer">
        FAQs
      </DropdownMenuItem>
      <div className="mt-2 flex items-center justify-center rounded-b-md border-t border-slate-100 bg-slate-50 py-1">
        <span className="mt-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Version {version}
        </span>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);

// User Menu Component - Clean Professional Design
const UserMenu = ({
  userName = "John Doe",
  // userEmail = "john@example.com",
  userAvatar,
  userRole = "CONSULTANT",
  onItemClick,
  forceOpen = false,
}: {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userRole?: string;
  onItemClick?: (item: string) => void;
  /** When true the dropdown is force-opened (used during the product tour) */
  forceOpen?: boolean;
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = forceOpen ? true : internalOpen;
  const onOpenChange = forceOpen ? undefined : setInternalOpen;

  // Format role display name
  const formatRoleDisplay = (role: string) => {
    return role.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  };

  // Get role color based on role type
  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case "SUPER_ADMIN":
        return "text-purple-600";
      case "CLIENT":
        return "text-emerald-600";
      case "CONSULTANT":
      default:
        return "text-blue-600";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          id="nav-account-btn"
          variant="ghost"
          className="group relative flex h-12 cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
        >
          <div className="relative">
            <Avatar className="h-10 w-10 ring-1 ring-white transition-transform duration-200 group-hover:scale-105">
              <AvatarImage src={userAvatar} alt={userName} className="object-cover" />
              <AvatarFallback className="bg-slate-700 text-xs font-semibold text-white">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
          <ChevronDownIcon className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:text-slate-700 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="max-h-full min-w-54 overflow-y-auto rounded-xl border border-slate-200 bg-white p-0 shadow-xl"
      >
        {/* User Info Header */}
        <div className="border-b border-slate-100 px-4 py-2">
          <div className="flex flex-col gap-1.5">
            {/* Name Row */}
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-slate-400" />
              <span className="text-md font-semibold text-slate-900">{userName}</span>
            </div>
            {/* Role Row */}
            <div className="flex items-center gap-2">
              <Shield
                className={cn(
                  "h-4 w-4",
                  userRole.toUpperCase() === "CLIENT" ? "text-emerald-500" : "text-blue-500"
                )}
              />
              {/* <span className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                Role
              </span> */}
              <span className={cn("text-xs font-semibold", getRoleColor(userRole))}>
                {formatRoleDisplay(userRole)}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-1.5">
          <DropdownMenuItem
            onClick={() => onItemClick?.("profile")}
            className="group flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors duration-150 group-hover:bg-slate-200 group-hover:text-slate-700">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Profile</span>
              <span className="text-[11px] text-slate-400">View and edit your profile</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onItemClick?.("settings")}
            className="group flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors duration-150 group-hover:bg-slate-200 group-hover:text-slate-700">
              <Settings className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Settings</span>
              <span className="text-[11px] text-slate-400">Account preferences</span>
            </div>
          </DropdownMenuItem>
        </div>

        {/* Logout Section */}
        <div className="border-t border-slate-100 p-1.5">
          <DropdownMenuItem
            onClick={() => onItemClick?.("logout")}
            className="group flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 text-sm text-slate-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700 focus:bg-red-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors duration-150 group-hover:bg-red-100 group-hover:text-red-600">
              <LogOut className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Log out</span>
              <span className="text-[11px] text-slate-400">Sign out of your account</span>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Types
export interface Navbar05NavItem {
  href?: string;
  label: string;
  icon?: React.ReactNode;
}

export interface Navbar05Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar05NavItem[];
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userRole?: string;
  onNavItemClick?: (href: string) => void;
  onInfoItemClick?: (item: string) => void;
  onNotificationItemClick?: (item: string) => void;
  onUserItemClick?: (item: string) => void;
  /** Force the user avatar dropdown open (used by the product tour) */
  userMenuForceOpen?: boolean;
}

// Default navigation links
const defaultNavigationLinks: Navbar05NavItem[] = [
  { href: "#", label: "Home", icon: <Home className="h-4 w-4" /> },
  { href: "#", label: "Find Work", icon: <Briefcase className="h-4 w-4" /> },
  { href: "#", label: "Saved Jobs", icon: <Heart className="h-4 w-4" /> },
  { href: "#", label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
];

export const Navbar05 = React.forwardRef<HTMLElement, Navbar05Props>(
  (
    {
      className,
      logo = (
        <Image
          src="/images/logo/logo-with-name-without-bg.webp"
          alt="Logo"
          width={140}
          height={40}
          className="h-16 w-auto"
          priority
        />
      ),
      navigationLinks = defaultNavigationLinks,
      userName = "John Doe",
      userEmail = "john@example.com",
      userAvatar,
      userRole = "CONSULTANT",
      onNavItemClick,
      onInfoItemClick,
      onUserItemClick,
      userMenuForceOpen = false,
      ...props
    },
    ref
  ) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null); // Renamed from containerRef for clarity
    const pathname = usePathname();

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        headerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    return (
      <header
        id="app-navbar"
        ref={combinedRef}
        className={cn(
          "bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b px-4 backdrop-blur **:no-underline md:px-6",
          className
        )}
        {...props}
      >
        <div className="relative container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            <div className="md:hidden">
              <Button
                className="group relative flex h-12 cursor-pointer items-center gap-1 rounded-full border border-slate-200 bg-white px-1 py-1 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                variant="ghost"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(true)}
              >
                <div className="text-slate-500 transition-colors group-hover:text-slate-800">
                  <HamburgerIcon className="h-4 w-4" />
                </div>
                <Avatar className="h-10 w-10 ring-1 ring-slate-200 transition-transform duration-200 group-hover:scale-105">
                  <AvatarImage src={userAvatar} alt={userName} className="object-cover" />
                  <AvatarFallback className="bg-slate-700 text-[10px] font-semibold text-white">
                    {(userName || "User")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Button>
              <MobileNavMenu
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
                navigationLinks={navigationLinks}
                userName={userName}
                userAvatar={userAvatar}
                userRole={userRole}
                onNavItemClick={onNavItemClick}
                onInfoItemClick={onInfoItemClick}
                onUserItemClick={onUserItemClick}
              />
            </div>

            {/* Main nav / Logo - Centered on mobile, Left-aligned on Desktop */}
            <div
              className={cn(
                "flex items-center gap-6",
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0"
              )}
            >
              <button
                onClick={(e) => e.preventDefault()}
                className="text-primary hover:text-primary/90 flex cursor-pointer items-center space-x-2 transition-colors"
                aria-label="Home"
              >
                <div>{logo}</div>
              </button>

              {/* Navigation menu - Desktop only */}
              <NavigationMenu id="nav-links-section" className="hidden md:flex">
                <NavigationMenuList className="gap-2">
                  {navigationLinks.map((link, index) => {
                    const linkPath = link.href ? link.href.split("?")[0] : "";
                    const isActive =
                      linkPath && linkPath !== "#"
                        ? pathname === linkPath || pathname?.startsWith(linkPath + "/")
                        : false;

                    return (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink asChild>
                          <Link
                            id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                            href={link.href || "#"}
                            onClick={() => {
                              if (onNavItemClick && link.href) onNavItemClick(link.href);
                            }}
                            prefetch={false}
                            className={cn(
                              "group relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200",
                              "focus:ring-0 focus:outline-none",
                              isActive
                                ? "bg-transparent! text-(--theme-navy-900) hover:bg-transparent!"
                                : "text-(--theme-navy-500) hover:bg-(--theme-teal-300)! hover:text-(--theme-navy-900)"
                            )}
                          >
                            {/* Icon */}
                            {link.icon && (
                              <span
                                className={cn(
                                  "flex items-center justify-center transition-colors duration-200 [&_svg]:h-5 [&_svg]:w-5",
                                  isActive
                                    ? "text-(--theme-teal-600)"
                                    : "text-(--theme-navy-400) group-hover:text-(--theme-teal-500)"
                                )}
                              >
                                {link.icon}
                              </span>
                            )}
                            {/* Label */}
                            <span className="relative text-xs font-semibold tracking-wide">
                              {link.label}
                            </span>
                            {/* Active indicator - bottom border */}
                            {isActive && (
                              <span className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-(--theme-teal-500)" />
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Info menu - hidden on mobile, shown in MobileNavMenu */}
              <div className="hidden md:block">
                <InfoMenu onItemClick={onInfoItemClick} />
              </div>
            </div>
            <div className="hidden md:block">
              <UserMenu
                userName={userName}
                userEmail={userEmail}
                userAvatar={userAvatar}
                userRole={userRole}
                onItemClick={onUserItemClick}
                forceOpen={userMenuForceOpen}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Navbar05.displayName = "Navbar05";

export { Logo, HamburgerIcon, InfoMenu, UserMenu };
