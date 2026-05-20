"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout, getAdminName, getAdminEmail, getAdminRole } from "@/lib/admin-auth";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  LogOut,
  // BarChart3,
  Search,
  ChevronRight,
  UserCog,
  ShieldCheck,
  Shield,
  Link2,
  Award,
  Mail,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  // SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Navigation items type definition
type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  items?: {
    label: string;
    href: string;
    icon?: React.ElementType;
  }[];
};

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  {
    icon: Users,
    label: "Users Management",
    href: "/admin/users",
    items: [
      { label: "Consultants", href: "/admin/users/consultants" },
      { label: "Clients", href: "/admin/users/clients" },
    ],
  },
  { icon: Briefcase, label: "Job Management", href: "/admin/jobs?status=PUBLISHED" },
  { icon: UserCog, label: "Onboarding Configuration", href: "/admin/onboarding-configuration" },
  {
    icon: ShieldCheck,
    label: "Content Verification",
    href: "/admin/content-verification",
    items: [
      { label: "Links", href: "/admin/content-verification/links", icon: Link2 },
      { label: "Certificates", href: "/admin/content-verification/certificates", icon: Award },
    ],
  },
  { icon: Mail, label: "Email Logs", href: "/admin/email-logs" },

  {
    icon: Settings,
    label: "System Settings",
    href: "/admin/settings",
    items: [{ label: "Global Variables", href: "/admin/settings/global-variables" }],
  },
  // { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Admin user info from localStorage
  const [adminName, setAdminName] = useState<string>("System Admin");
  const [adminEmail, setAdminEmail] = useState<string>("admin@unicon.com");
  const [adminRole, setAdminRole] = useState<string>("ADMIN");

  // Fetch admin info from localStorage on mount
  useEffect(() => {
    // Wrap in setTimeout to avoid synchronous setState in effect warning
    setTimeout(() => {
      const name = getAdminName();
      const email = getAdminEmail();
      const role = getAdminRole();

      if (name) setAdminName(name);
      if (email) setAdminEmail(email);
      if (role) setAdminRole(role);
    }, 0);
  }, []);

  // Get initials from admin name
  const getInitials = (name: string): string => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Format role for display
  const formatRole = (role: string): string => {
    return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Initialize open state based on current path - run only when pathname changes
  useEffect(() => {
    // Check if we need to open any items based on the new path
    const shouldOpen: string[] = [];
    mainNavItems.forEach((item) => {
      if (item.items && pathname.startsWith(item.href)) {
        shouldOpen.push(item.href);
      }
    });

    if (shouldOpen.length > 0) {
      // Wrap in setTimeout to avoid "synchronous setState in effect" linter error
      setTimeout(() => {
        setOpenItems((prev) => {
          const next = { ...prev };
          let hasChanges = false;
          shouldOpen.forEach((href) => {
            if (!next[href]) {
              next[href] = true;
              hasChanges = true;
            }
          });
          return hasChanges ? next : prev;
        });
      }, 0);
    }
  }, [pathname]);

  const toggleItem = (href: string) => {
    setOpenItems((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const handleAdminLogout = () => {
    adminLogout();
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-(--theme-navy-800) bg-(--theme-navy-950) text-(--theme-navy-100)"
    >
      {/* Sidebar Header */}
      <SidebarHeader className="h-16 border-b border-(--theme-navy-800)/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-(--theme-navy-900) hover:text-white data-[state=open]:bg-(--theme-navy-900) data-[state=open]:text-white"
            >
              <Link href="/admin/dashboard" prefetch={false}>
                <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-(--theme-teal-100) text-(--theme-navy-900) shadow-(--theme-teal)/20 shadow-lg transition-all group-data-[collapsible=icon]:size-8">
                  <Image
                    src="/images/logo/logo-without-bg.webp"
                    alt="uniCon"
                    width={44}
                    height={44}
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <div className="grid flex-1 text-left text-base leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold tracking-wide text-white">
                    uniCon<span className="ml-0.5 font-normal text-(--theme-teal)">Admin</span>
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="py-4">
        {/* Search Bar (Optional, can be hidden in collapsed state usually) */}
        <div className="mb-4 px-2 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-(--theme-navy-400)" />
            <SidebarInput
              placeholder="Search..."
              className="border-(--theme-navy-800) bg-(--theme-navy-900) pl-8 text-(--theme-navy-100) placeholder:text-(--theme-navy-500) focus:border-(--theme-teal) focus:ring-(--theme-teal)/20"
            />
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {mainNavItems.map((item) => {
                // Strip query string from href for pathname comparison
                // (usePathname() returns path only, without query params)
                const itemPath = item.href.split("?")[0];
                const isActive =
                  pathname === itemPath ||
                  (pathname.startsWith(itemPath) && !item.items) ||
                  (item.items && pathname === itemPath);
                const isChildActive = item.items?.some((sub) => pathname === sub.href);
                const isOpen = openItems[item.href];

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={`group h-10 transition-all duration-200 ease-in-out ${
                        isActive
                          ? "rounded-l-none border-l-2 border-(--theme-teal) bg-(--theme-teal)/15 font-medium text-(--theme-teal) shadow-sm group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:border-l-0 group-data-[collapsible=icon]:text-(--theme-teal)"
                          : isChildActive
                            ? "font-medium text-(--theme-navy-100)"
                            : "text-(--theme-navy-200) hover:bg-(--theme-navy-800) hover:text-white"
                      } `}
                    >
                      <Link
                        // If it has items, the main click goes to href (as requested)
                        href={item.href}
                        prefetch={false}
                        className="flex w-full items-center group-data-[collapsible=icon]:justify-center"
                      >
                        <item.icon
                          className={`${isActive || isChildActive ? "text-(--theme-teal)" : "text-(--theme-navy-400) group-hover:text-(--theme-teal)"} transition-colors`}
                        />
                        <span className="ml-3 group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                        {/* Active Indicator Arrow - ONLY if no sub-items */}
                        {isActive && !item.items && (
                          <ChevronRight className="ml-auto h-4 w-4 text-(--theme-teal) opacity-50 group-data-[collapsible=icon]:hidden" />
                        )}
                      </Link>
                    </SidebarMenuButton>

                    {/* Render Toggle Action if items exist */}
                    {item.items && (
                      <SidebarMenuAction
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); // Ensure it doesn't trigger parent link
                          toggleItem(item.href);
                        }}
                        showOnHover={true}
                        className={`absolute right-2 translate-y-1 cursor-pointer transition-transform duration-200 group-data-[collapsible=icon]:hidden hover:bg-(--theme-navy-800) hover:text-white ${isOpen ? "rotate-90 text-white" : "text-(--theme-navy-400)"}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </SidebarMenuAction>
                    )}

                    {/* Sub Menu with Animation */}
                    <AnimatePresence>
                      {item.items && isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <SidebarMenuSub className="ml-3.5 border-l border-(--theme-navy-800) py-1 pl-2">
                            {item.items.map((subItem, index) => {
                              const isSubActive = pathname === subItem.href;

                              return (
                                <div key={subItem.href}>
                                  <SidebarMenuSubItem>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isSubActive}
                                      className={`h-8 cursor-pointer transition-colors ${
                                        isSubActive
                                          ? "bg-(--theme-teal)/10 font-medium text-(--theme-teal)"
                                          : "text-(--theme-navy-300) hover:bg-(--theme-navy-800)/50 hover:text-(--theme-navy-100)"
                                      }`}
                                    >
                                      <Link href={subItem.href} prefetch={false}>
                                        {/* Adjusted icon size/color */}
                                        {subItem.icon && (
                                          <subItem.icon
                                            className={`mr-2 h-4 w-4 ${isSubActive ? "text-(--theme-teal)" : "text-(--theme-navy-500) group-hover:text-(--theme-teal)"}`}
                                          />
                                        )}
                                        <span>{subItem.label}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                  {/* Add divider between items, but not after the last one */}
                                  {index < item.items!.length - 1 && (
                                    <div className="mx-2 my-1 border-b border-(--theme-navy-800)/40" />
                                  )}
                                </div>
                              );
                            })}
                          </SidebarMenuSub>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-(--theme-navy-800)/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full cursor-pointer transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2! hover:bg-(--theme-navy-800)/60 data-[state=open]:bg-(--theme-navy-800)/80"
                >
                  <Avatar className="size-9 shrink-0 rounded-lg ring-2 ring-(--theme-teal)/40">
                    <AvatarFallback className="rounded-lg bg-(--theme-teal) text-sm font-bold text-(--theme-navy-950)">
                      {getInitials(adminName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-white">{adminName}</span>
                    <span className="truncate text-xs text-(--theme-navy-400)">{adminEmail}</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 text-(--theme-navy-400) transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]:rotate-90" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-[240px] overflow-hidden rounded-lg border border-(--theme-navy-700) bg-(--theme-navy-900) p-0 shadow-2xl"
                side="top"
                align="start"
                sideOffset={6}
              >
                {/* Profile Header */}
                <div className="border-b border-(--theme-navy-700)/60 bg-(--theme-navy-800)/40 px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0 rounded-lg ring-2 ring-(--theme-teal)/50">
                      <AvatarFallback className="rounded-lg bg-(--theme-teal) font-bold text-(--theme-navy-950)">
                        {getInitials(adminName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{adminName}</p>
                      <p className="truncate text-xs text-(--theme-navy-400)">{adminEmail}</p>

                      {/* Role Badge */}
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-(--theme-teal)/30 bg-(--theme-teal)/10 px-2 py-1">
                        <Shield className="size-3.5 text-(--theme-teal)" />
                        <span className="text-xs font-medium text-(--theme-teal)">
                          {formatRole(adminRole)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1">
                  {/* <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-(--theme-navy-200) transition-colors hover:bg-(--theme-navy-800) hover:text-white focus:bg-(--theme-navy-800) focus:text-white">
                    <Settings className="size-4 text-(--theme-navy-400)" />
                    <span>Account Settings</span>
                  </DropdownMenuItem> */}

                  <DropdownMenuItem
                    onClick={handleAdminLogout}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-3 text-sm text-red-400 transition-colors hover:bg-red-500/15 hover:text-red-300 focus:bg-red-500/15 focus:text-red-300"
                  >
                    <LogOut className="size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail className="hover:after:bg-(--theme-teal)" />
    </Sidebar>
  );
}
