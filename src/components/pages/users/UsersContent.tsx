"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { AlertTriangle, Search, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBreadcrumb } from "@/components/pages/layout/Breadcrumb";
import { Toast, useToast } from "@/components/common";
import { DataTable } from "@/components/custom/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllUsers, GetAllUsersParams } from "@/lib/api/admin/user-api";
import { EnumRoles } from "@/common/enum";
import type { User } from "@/types";
import { getColumns } from "./UsersColumns";

// Roles available in the "Admin & Rider Users" filter dropdown
const ROLE_FILTER_OPTIONS: { value: EnumRoles; label: string }[] = [
  { value: EnumRoles.Admin, label: "Admin" },
  { value: EnumRoles.Rider, label: "Rider" },
];

export interface UsersContentProps {
  /** Whether to list application users only (role = "user"). When false, lists admin/super_admin/rider staff. */
  usersOnly: boolean;
  /** Page heading */
  title: string;
  /** Page description shown under the heading */
  description: string;
  /** Breadcrumb label for the current page */
  breadcrumbLabel: string;
}

// Skeleton view for the initial page load
const UsersSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
    </div>
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-9 w-full sm:w-[300px]" />
      <Skeleton className="h-9 w-32" />
    </div>
    <div className="border-muted space-y-4 rounded-xl border p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="border-muted/50 flex items-center gap-6 border-b py-3 last:border-0"
        >
          <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 max-w-sm flex-1" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="ml-auto h-6 w-20" />
        </div>
      ))}
    </div>
  </div>
);

export function UsersContent({
  usersOnly,
  title,
  description,
  breadcrumbLabel,
}: UsersContentProps) {
  const { setBreadcrumbs } = useBreadcrumb();
  const { toast, showToast, hideToast } = useToast();

  // Role filter is only relevant for the Admin & Rider users list
  const showRoleFilter = !usersOnly;

  // Users list states
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  // Pagination states
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Search states
  const [searchVal, setSearchVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Role filter state (only used when showRoleFilter is true)
  const [selectedRole, setSelectedRole] = useState<EnumRoles | null>(null);

  const fetchUsers = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        if (isInitialMount.current) {
          setIsLoading(true);
        } else {
          setIsTableLoading(true);
        }
      }
      setError(null);

      try {
        const params: GetAllUsersParams = {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          usersOnly,
        };

        if (searchQuery.trim() !== "") {
          params.search = searchQuery.trim();
        }

        if (showRoleFilter && selectedRole !== null) {
          params.role = selectedRole;
        }

        const response = await getAllUsers(params);
        const isSuccess =
          response.success || (response as unknown as { status?: boolean }).status === true;

        if (isSuccess) {
          setUsers(response.data || []);
          setTotalRows(response.pagination?.total || 0);
          setTotalPages(response.pagination?.totalPages || 1);
        } else {
          const msg = response.message || "Failed to load users";
          setError(msg);
          showToast(msg, "error");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load users";
        setError(msg);
        showToast(msg, "error");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsTableLoading(false);
        isInitialMount.current = false;
      }
    },
    [
      pagination.pageIndex,
      pagination.pageSize,
      searchQuery,
      selectedRole,
      showRoleFilter,
      usersOnly,
      showToast,
    ]
  );

  // Sync breadcrumbs on mount / when label changes
  useEffect(() => {
    setBreadcrumbs([{ label: "Users Management", href: "/users" }, { label: breadcrumbLabel }]);
  }, [setBreadcrumbs, breadcrumbLabel]);

  // Fetch users when pagination, search or role filter changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset search immediately if the input is cleared manually
  useEffect(() => {
    if (searchVal === "" && searchQuery !== "") {
      setSearchQuery("");
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [searchVal, searchQuery]);

  const handleSearchSubmit = useCallback(() => {
    setSearchQuery(searchVal);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchVal]);

  const handleClearSearch = useCallback(() => {
    setSearchVal("");
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const columns = useMemo(() => getColumns(showRoleFilter), [showRoleFilter]);

  // Custom left toolbar: search bar + search button
  const customLeftToolbar = useMemo(() => {
    return (
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-auto">
          <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
          <Input
            placeholder="Search by name, email or phone..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
            className="h-9 w-full bg-white! pl-9 shadow-sm sm:w-[260px] md:w-[320px]"
          />
        </div>
        {searchVal.trim() !== "" && (
          <Button
            variant="premium"
            size="sm"
            onClick={handleSearchSubmit}
            className="h-9 w-full cursor-pointer sm:w-auto"
          >
            Search
          </Button>
        )}
        {searchQuery && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearSearch}
            className="h-9 w-full cursor-pointer sm:w-auto"
          >
            Clear
          </Button>
        )}
      </div>
    );
  }, [searchVal, searchQuery, handleSearchSubmit, handleClearSearch]);

  // Custom right toolbar: role filter dropdown (only for Admin & Rider users)
  const customRightToolbar = useMemo(() => {
    if (!showRoleFilter) return undefined;
    return (
      <Select
        value={selectedRole ?? "all"}
        onValueChange={(val) => {
          setSelectedRole(val === "all" ? null : (val as EnumRoles));
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
      >
        <SelectTrigger className="h-9 w-full cursor-pointer bg-white! shadow-sm sm:w-fit sm:min-w-[160px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent position="popper" className="w-(--radix-select-trigger-width) bg-white!">
          <SelectItem value="all" className="cursor-pointer">
            All Roles
          </SelectItem>
          {ROLE_FILTER_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }, [showRoleFilter, selectedRole]);

  if (isLoading) {
    return <UsersSkeleton />;
  }

  if (!isLoading && users.length === 0 && error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={5000} />
        )}
        <div className="mb-4 rounded-full bg-red-50 p-4 text-red-600">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-(--theme-burgundy-950)">Failed to Load Users</h3>
        <p className="mt-1 mb-6 max-w-md text-sm text-(--theme-coffee-500)">{error}</p>
        <Button onClick={() => fetchUsers()} variant="premium">
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={5000} />
      )}

      {/* Title Bar */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-(--theme-burgundy-950)">{title}</h1>
        <p className="text-sm text-(--theme-coffee-500)">{description}</p>
      </div>

      {/* Main Content Table */}
      <DataTable
        columns={columns}
        data={users}
        customLeftToolbar={customLeftToolbar}
        customRightToolbar={customRightToolbar}
        onRefresh={() => fetchUsers(true)}
        isLoading={isTableLoading || isRefreshing}
        searchLoadingContent={
          isTableLoading || isRefreshing ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Spinner variant="circle-filled" className="h-8 w-8 text-(--theme-burgundy-950)" />
              <span className="text-xs font-semibold text-(--theme-coffee-500)">
                Loading users...
              </span>
            </div>
          ) : undefined
        }
        align="left"
        manualPagination
        pageCount={totalPages}
        totalRows={totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageSizeOptions={[10, 25, 50, 100]}
        emptyStateContent={
          <div className="mx-auto flex max-w-sm flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-(--theme-coffee-150) bg-(--theme-coffee-50) text-(--theme-coffee-500) shadow-sm">
              <UsersIcon className="h-7 w-7 opacity-85" />
            </div>
            <h3 className="text-base font-bold tracking-tight text-(--theme-burgundy-950)">
              No Users Found
            </h3>
            <p className="mt-1.5 mb-5 text-xs leading-relaxed text-(--theme-coffee-500)">
              There are no users matching the current search or filters.
            </p>
            {(searchQuery || selectedRole) && (
              <Button
                variant="premium"
                onClick={() => {
                  handleClearSearch();
                  setSelectedRole(null);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4 text-xs"
              >
                <span>Clear Filters</span>
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}
