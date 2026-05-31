"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout, getAdminName, getAdminRole, getAdminPhoneNumber } from "@/lib/admin-auth";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
  Search,
  ChevronRight,
  Shield,
  ClipboardList,
  Smartphone,
  BadgePercent,
  ImagePlay,
  SlidersHorizontal,
} from "lucide-react";

import {
  Sidebar as ShadcnSidebar,
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
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  {
    icon: ClipboardList,
    label: "Order Management",
    href: "/orders",
  },
  {
    icon: Users,
    label: "Users Management",
    href: "/users",
    items: [
      { label: "Consultants", href: "/users/consultants" },
      { label: "Clients", href: "/users/clients" },
    ],
  },
  {
    icon: Package,
    label: "Product Management",
    href: "/products",
    items: [
      { label: "Categories", href: "/products/categories" },
      { label: "Menu Items", href: "/products/items" },
    ],
  },
  { icon: BadgePercent, label: "Offers", href: "/offers" },
  {
    icon: Smartphone,
    label: "App Customization",
    href: "/app-customization",
    items: [
      { label: "Banners", href: "/app-customization/banners", icon: ImagePlay },
      { label: "App Settings", href: "/app-customization/settings", icon: SlidersHorizontal },
    ],
  },
  {
    icon: Settings,
    label: "System Settings",
    href: "/settings",
    items: [{ label: "Global Variables", href: "/settings/global-variables" }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Admin user info from cookies
  const [adminName, setAdminName] = useState<string>("System Admin");
  const [adminPhone, setAdminPhone] = useState<string>("");
  const [adminRole, setAdminRole] = useState<string>("ADMIN");

  // Fetch admin info from cookies on mount
  useEffect(() => {
    // Wrap in setTimeout to avoid synchronous setState in effect warning
    setTimeout(() => {
      const name = getAdminName();
      const phone = getAdminPhoneNumber();
      const role = getAdminRole();

      if (name) setAdminName(name);
      if (phone) {
        // Format phone number with a space if it lacks one (e.g., +917383375677 -> +91 7383375677)
        const trimmedPhone = phone.trim();
        if (trimmedPhone.startsWith("+") && !trimmedPhone.includes(" ")) {
          if (trimmedPhone.startsWith("+91")) {
            setAdminPhone(`+91 ${trimmedPhone.slice(3)}`);
          } else {
            setAdminPhone(`${trimmedPhone.slice(0, 3)} ${trimmedPhone.slice(3)}`);
          }
        } else {
          setAdminPhone(trimmedPhone);
        }
      }
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
    <ShadcnSidebar
      collapsible="icon"
      className="border-r border-(--theme-burgundy-800) bg-(--theme-burgundy-950) text-(--theme-burgundy-100)"
    >
      {/* Sidebar Header */}
      <SidebarHeader className="h-16 border-b border-(--theme-burgundy-800)/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:mt-1! group-data-[collapsible=icon]:mr-1! group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white"
            >
              <Link
                href="/dashboard"
                prefetch={false}
                className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
              >
                <Image
                  src="/logo/PNG/JJ_s_Transperent.png"
                  alt="JJ's Kitchen Logo"
                  width={200}
                  height={200}
                  unoptimized
                  className="h-9 w-9 object-contain transition-all group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
                  priority
                />
                <div className="grid flex-1 text-left text-base leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold tracking-wide text-white">
                    Kitchen
                    <span className="ml-1 text-xs font-normal text-(--theme-taupe)">Admin</span>
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
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-(--theme-burgundy-200)" />
            <SidebarInput
              placeholder="Search..."
              className="border-(--theme-burgundy-800) bg-(--theme-burgundy-900) pl-8 text-(--theme-burgundy-100) placeholder:text-(--theme-burgundy-200) focus:border-(--theme-taupe) focus:ring-(--theme-taupe)/20"
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
                          ? "rounded-l-none border-l-2 border-(--theme-burgundy-950) bg-(--theme-taupe) font-semibold text-(--theme-burgundy-950) shadow-md group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:border-l-0"
                          : isChildActive
                            ? "font-medium text-(--theme-burgundy-100) hover:bg-white/10 hover:text-white"
                            : "text-(--theme-burgundy-200) hover:bg-white/10 hover:text-white"
                      } `}
                    >
                      <Link
                        // If it has items, the main click goes to href (as requested)
                        href={item.href}
                        prefetch={false}
                        className="flex w-full items-center group-data-[collapsible=icon]:justify-center"
                      >
                        <item.icon
                          className={`${isActive ? "text-(--theme-burgundy-200)" : isChildActive ? "text-(--theme-taupe)" : "text-(--theme-burgundy-400) group-hover:text-(--theme-taupe)"} transition-colors`}
                        />
                        <span className="ml-3 group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                        {/* Active Indicator Arrow - ONLY if no sub-items */}
                        {isActive && !item.items && (
                          <ChevronRight className="ml-auto h-4 w-4 text-(--theme-burgundy-950) opacity-80 group-data-[collapsible=icon]:hidden" />
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
                        className={`absolute right-2 translate-y-1 cursor-pointer transition-transform duration-200 group-data-[collapsible=icon]:hidden hover:bg-(--theme-burgundy-800) hover:text-white ${isOpen ? "rotate-90 text-white" : "text-(--theme-burgundy-400)"}`}
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
                          <SidebarMenuSub className="ml-3.5 border-l border-(--theme-burgundy-800) py-1 pl-2">
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
                                          ? "bg-(--theme-taupe)/10 font-medium text-(--theme-taupe)"
                                          : "text-(--theme-burgundy-200) hover:bg-white/5 hover:text-white"
                                      }`}
                                    >
                                      <Link href={subItem.href} prefetch={false}>
                                        {/* Adjusted icon size/color */}
                                        {subItem.icon && (
                                          <subItem.icon
                                            className={`mr-2 h-4 w-4 ${isSubActive ? "text-(--theme-taupe)" : "text-(--theme-burgundy-500) group-hover:text-(--theme-taupe)"}`}
                                          />
                                        )}
                                        <span>{subItem.label}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                  {/* Add divider between items, but not after the last one */}
                                  {index < item.items!.length - 1 && (
                                    <div className="mx-2 my-1 border-b border-(--theme-burgundy-800)/40" />
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

      <SidebarFooter className="border-t border-(--theme-burgundy-800)/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full cursor-pointer transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2! hover:bg-white/10 data-[state=open]:bg-white/15"
                >
                  <Avatar className="size-9 shrink-0 rounded-lg ring-2 ring-(--theme-taupe)/40">
                    <AvatarFallback className="rounded-lg bg-(--theme-taupe) text-sm font-bold text-(--theme-burgundy-950)">
                      {getInitials(adminName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-white">{adminName}</span>
                    <span className="truncate text-xs text-(--theme-burgundy-400)">
                      {adminPhone}
                    </span>
                  </div>
                  <ChevronRight className="ml-auto size-4 text-(--theme-burgundy-400) transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]:rotate-90" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-[240px] overflow-hidden rounded-lg border border-(--theme-burgundy-700) bg-(--theme-burgundy-900) p-0 shadow-2xl"
                side="top"
                align="start"
                sideOffset={6}
              >
                {/* Profile Header */}
                <div className="border-b border-(--theme-burgundy-700)/60 bg-(--theme-burgundy-800)/40 px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0 rounded-lg ring-2 ring-(--theme-taupe)/50">
                      <AvatarFallback className="rounded-lg bg-(--theme-taupe) font-bold text-(--theme-burgundy-950)">
                        {getInitials(adminName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{adminName}</p>
                      <p className="truncate text-xs text-(--theme-burgundy-400)">{adminPhone}</p>

                      {/* Role Badge */}
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-(--theme-taupe)/30 bg-(--theme-taupe)/10 px-2 py-1">
                        <Shield className="size-3.5 text-(--theme-taupe)" />
                        <span className="text-xs font-medium text-(--theme-taupe)">
                          {formatRole(adminRole)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1">
                  {/* <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-(--theme-burgundy-200) transition-colors hover:bg-(--theme-burgundy-800) hover:text-white focus:bg-(--theme-burgundy-800) focus:text-white">
                    <Settings className="size-4 text-(--theme-burgundy-400)" />
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
      <SidebarRail className="hover:after:bg-(--theme-taupe)" />
    </ShadcnSidebar>
  );
}
