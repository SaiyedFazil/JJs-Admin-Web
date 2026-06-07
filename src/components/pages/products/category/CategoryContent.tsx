"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Plus, AlertTriangle, Trash2, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/pages/layout/Breadcrumb";
import { Toast, useToast } from "@/components/common";
import { DataTable } from "@/components/custom/data-table";
import { getAllCategories } from "@/lib/api/admin/category-api";
import type { Category } from "@/types";
import { getColumns } from "./CategoryColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateUpdateCategoryDialog } from "./create-update-category-dialog/CreateUpdateCategoryDialog";
import { ConfirmationDialog } from "@/components/custom/ConfirmationDialog";
import { deleteCategory } from "@/lib/api/admin/category-api";

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
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border-muted/50 flex items-center gap-6 border-b py-3 last:border-0"
        >
          <Skeleton className="h-28 w-28 shrink-0 rounded-2xl" />
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

  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setBreadcrumbs([{ label: "Product Management", href: "/products" }, { label: "Categories" }]);
    fetchCategories();
  }, [setBreadcrumbs, fetchCategories]);

  const handleEditClick = useCallback((category: Category) => {
    setSelectedCategory(category);
    setDialogKey((k) => k + 1);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((category: Category) => {
    setCategoryToDelete(category);
    setIsConfirmDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteCategory(categoryToDelete.id);
      const isSuccess =
        response.success || (response as unknown as { status?: boolean }).status === true;
      if (isSuccess) {
        showToast(response.message || "Category deleted successfully.", "success");
        setIsConfirmDeleteOpen(false);
        setCategoryToDelete(null);
        fetchCategories(true);
      } else {
        showToast(response.message || "Failed to delete category.", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete category.";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  }, [categoryToDelete, fetchCategories, showToast]);

  // Instantiating columns with the local event handlers
  const columns = useMemo(
    () => getColumns(handleEditClick, handleDeleteClick),
    [handleEditClick, handleDeleteClick]
  );

  if (isLoading) {
    return (
      <div>
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
    <div className="space-y-6">
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
          onClick={() => {
            setSelectedCategory(null);
            setDialogKey((k) => k + 1);
            setIsFormOpen(true);
          }}
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
        searchPlaceholder="Search by name..."
        onRefresh={() => fetchCategories(true)}
        isLoading={isRefreshing}
        align="left"
        hidePagination
        manualPagination
        emptyStateContent={
          <div className="mx-auto flex max-w-sm flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-(--theme-coffee-150) bg-(--theme-coffee-50) text-(--theme-coffee-500) shadow-sm">
              <FolderTree className="h-7 w-7 opacity-85" />
            </div>
            <h3 className="text-base font-bold tracking-tight text-(--theme-burgundy-950)">
              No Categories Yet
            </h3>
            <p className="mt-1.5 mb-5 text-xs leading-relaxed text-(--theme-coffee-500)">
              Start organizing your digital menu board. Add your first category for meals,
              appetizers, or drinks.
            </p>
            <Button
              variant="premium"
              onClick={() => {
                setSelectedCategory(null);
                setIsFormOpen(true);
              }}
              className="flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create First Category</span>
            </Button>
          </div>
        }
      />

      {/* Create / Update Category Dialog */}
      <CreateUpdateCategoryDialog
        key={dialogKey}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSuccess={() => fetchCategories(true)}
        showToast={showToast}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmDeleteOpen}
        title="Delete Category"
        description={
          <span className="text-sm font-medium">
            Are you sure you want to delete category{" "}
            <span className="font-bold text-(--theme-burgundy-950)">{categoryToDelete?.name}</span>?
            This action will soft-delete the category.
          </span>
        }
        isLoading={isDeleting}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        confirmButtonText="Delete"
        variant="danger"
        icon={<Trash2 className="h-6 w-6 text-red-600" />}
      />
    </div>
  );
}
