"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/pages/layout/Breadcrumb";
import { Toast, useToast } from "@/components/common";
import { DataTable } from "@/components/custom/data-table";
import { getAllCategories } from "@/lib/api/admin/category-api";
import type { Category } from "@/types";
import { getColumns } from "./CategoryColumns";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton view for visual page loading state
const CategorySkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-10 w-32 rounded-lg" />
    </div>
    <div className="border-muted space-y-4 rounded-xl border p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="border-muted/50 flex items-center gap-6 border-b py-3 last:border-0"
        >
          <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 max-w-sm flex-1" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="ml-auto h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export function CategoryClient() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { toast, showToast, hideToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await getAllCategories();
        const isSuccess =
          response.success || (response as unknown as { status?: boolean }).status === true;
        if (isSuccess) {
          setCategories(response.data || []);
        } else {
          const msg = response.message || "Failed to load categories";
          setError(msg);
          showToast(msg, "error");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load categories";
        setError(msg);
        showToast(msg, "error");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Product Management", href: "/products" },
      { label: "Categories" },
    ]);
    fetchCategories();
  }, [setBreadcrumbs, fetchCategories]);

  const handleEditClick = useCallback(
    (category: Category) => {
      showToast(`Edit Category clicked for: ${category.name} (ID: ${category.id})`, "success");
    },
    [showToast]
  );

  const handleDeleteClick = useCallback(
    (category: Category) => {
      showToast(`Delete Category clicked for: ${category.name} (ID: ${category.id})`, "error");
    },
    [showToast]
  );

  // Instantiating columns with the local event handlers
  const columns = useMemo(
    () => getColumns(handleEditClick, handleDeleteClick),
    [handleEditClick, handleDeleteClick]
  );

  if (isLoading) {
    return (
      <div className="py-4">
        <CategorySkeleton />
      </div>
    );
  }

  if (!isLoading && categories.length === 0 && error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={5000} />
        )}
        <div className="mb-4 rounded-full bg-red-50 p-4 text-red-600">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-(--theme-burgundy-950)">Failed to Load Categories</h3>
        <p className="mt-1 mb-6 max-w-md text-sm text-(--theme-coffee-500)">{error}</p>
        <Button onClick={() => fetchCategories()} variant="premium">
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={5000} />
      )}

      {/* Title & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-(--theme-burgundy-950)">
            Category Management
          </h1>
          <p className="text-sm text-(--theme-coffee-500)">
            Manage your digital menu board folders. Organise, edit, or delete meal and beverage
            categories.
          </p>
        </div>
        <Button
          variant="premium"
          className="flex cursor-pointer items-center gap-2 self-start sm:self-auto"
          onClick={() => showToast("Add Category action is a placeholder", "success")}
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Main Content Table */}
      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        onRefresh={() => fetchCategories(true)}
        isLoading={isRefreshing}
        align="left"
        hidePagination
        manualPagination
      />
    </div>
  );
}
