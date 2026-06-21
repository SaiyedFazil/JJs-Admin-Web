"use client";

import React from "react";
import { Mail, Phone } from "lucide-react";
import { DataTableColumnHeader } from "@/components/custom/data-table/DataTableColumnHeader";
import { EnumRoles } from "@/common/enum";
import type { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

/** Human-friendly label for a role value */
export function formatRoleLabel(role: string): string {
  switch (role) {
    case EnumRoles.SuperAdmin:
      return "Super Admin";
    case EnumRoles.Admin:
      return "Admin";
    case EnumRoles.Rider:
      return "Rider";
    case EnumRoles.User:
      return "User";
    default:
      return role ? role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "-";
  }
}

/** Tailwind classes for each role badge */
function getRoleBadgeClasses(role: string): string {
  switch (role) {
    case EnumRoles.SuperAdmin:
      return "border-purple-200 bg-purple-50 text-purple-700";
    case EnumRoles.Admin:
      return "border-blue-200 bg-blue-50 text-blue-700";
    case EnumRoles.Rider:
      return "border-amber-200 bg-amber-50 text-amber-700";
    case EnumRoles.User:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
}

function getFullName(user: User): string {
  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
}

function getInitials(user: User): string {
  const first = user.first_name?.trim()?.[0] ?? "";
  const last = user.last_name?.trim()?.[0] ?? "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "U";
}

function UserAvatar({ user }: { user: User }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--theme-taupe-200) bg-(--theme-taupe-100) text-sm font-bold tracking-wide text-(--theme-burgundy-900) shadow-inner">
      {getInitials(user)}
    </div>
  );
}

/**
 * Generates the column definitions for the Users table.
 *
 * @param showRole - When `true`, includes a Role badge column (for Admin & Rider users).
 *                   Application users are all role "user", so the column is hidden for them.
 */
export function getColumns(showRole = false): ColumnDef<User>[] {
  const columns: ColumnDef<User>[] = [
    {
      id: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" className="justify-start" />
      ),
      accessorKey: "first_name",
      enableSorting: false,
      size: 240,
      cell: ({ row }) => {
        const user = row.original;
        const fullName = getFullName(user);

        // When no name is set, show a plain dash without the avatar.
        if (!fullName) {
          return <span className="text-muted-foreground text-sm">—</span>;
        }

        return (
          <div className="flex items-center gap-3">
            <UserAvatar user={user} />
            <span className="truncate text-sm font-bold tracking-tight text-(--theme-burgundy-950)">
              {fullName}
            </span>
          </div>
        );
      },
    },
    {
      id: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" className="justify-start" />
      ),
      accessorKey: "email",
      enableSorting: false,
      size: 260,
      cell: ({ row }) => {
        const email = row.original.email;
        return email ? (
          <span className="flex items-center gap-2 text-sm text-(--theme-coffee-700)">
            <Mail className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{email}</span>
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border border-(--theme-coffee-150) bg-(--theme-coffee-50) px-2.5 py-1 text-xs font-medium text-(--theme-coffee-400) italic">
            Not added
          </span>
        );
      },
    },
    {
      id: "phone_number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone Number" className="justify-start" />
      ),
      accessorKey: "phone_number",
      enableSorting: false,
      size: 180,
      cell: ({ row }) => {
        const phone = row.original.phone_number;
        return phone ? (
          <span className="flex items-center gap-2 text-sm font-medium text-(--theme-coffee-700)">
            <Phone className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
            {phone}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        );
      },
    },
  ];

  if (showRole) {
    columns.push({
      id: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" className="justify-start" />
      ),
      accessorKey: "role",
      enableSorting: false,
      size: 140,
      cell: ({ row }) => {
        const role = String(row.original.role || "");
        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${getRoleBadgeClasses(
              role
            )}`}
          >
            {formatRoleLabel(role)}
          </span>
        );
      },
    });
  }

  return columns;
}
