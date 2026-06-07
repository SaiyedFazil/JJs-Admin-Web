"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Plus, AlertTriangle, ChefHat, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBreadcrumb } from "@/components/pages/layout/Breadcrumb";
import { Toast, useToast } from "@/components/common";
import { DataTable } from "@/components/custom/data-table";
import { getAllProducts, deleteProduct, GetAllProductsParams } from "@/lib/api/admin/product-api";
import { getAllCategories } from "@/lib/api/admin/category-api";
import type { Product, Category } from "@/types";
import { getColumns } from "./ItemsColumns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUpdateItemDialog } from "./create-update-item-dialog/CreateUpdateItemDialog";
import { ConfirmationDialog } from "@/components/custom/ConfirmationDialog";
import { Spinner } from "@/components/ui/loader";

// Skeleton view for visual page loading state
const ProductSkeleton = () => (
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
          <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 max-w-sm flex-1" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="ml-auto h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export function ProductClient() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { toast, showToast, hideToast } = useToast();

  // Product List States
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  // Pagination States
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Search States
  const [searchVal, setSearchVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Category Filter States
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Dialog / Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all categories for filter dropdown on demand
  const fetchCategoriesForDropdown = useCallback(async () => {
    if (categoriesLoaded) return;
    setIsLoadingCategories(true);
    try {
      const response = await getAllCategories();
      const isSuccess =
        response.success || (response as unknown as { status?: boolean }).status === true;
      if (isSuccess) {
        setCategories(response.data || []);
        setCategoriesLoaded(true);
      } else {
        showToast(response.message || "Failed to load categories for filter.", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load categories.";
      showToast(msg, "error");
    } finally {
      setIsLoadingCategories(false);
    }
  }, [categoriesLoaded, showToast]);

  const handleDropdownOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        fetchCategoriesForDropdown();
      }
    },
    [fetchCategoriesForDropdown]
  );

  const fetchProducts = useCallback(
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
        const params: GetAllProductsParams = {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        };

        if (searchQuery.trim() !== "") {
          params.search = searchQuery;
        }

        if (selectedCategoryId !== null) {
          params.category = selectedCategoryId;
        }

        const response = await getAllProducts(params);
        const isSuccess =
          response.success || (response as unknown as { status?: boolean }).status === true;

        if (isSuccess) {
          setProducts(response.data || []);
          setTotalRows(response.pagination?.total || 0);
          setTotalPages(response.pagination?.totalPages || 1);
        } else {
          const msg = response.message || "Failed to load products";
          setError(msg);
          showToast(msg, "error");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load products";
        setError(msg);
        showToast(msg, "error");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsTableLoading(false);
        isInitialMount.current = false;
      }
    },
    [pagination.pageIndex, pagination.pageSize, searchQuery, selectedCategoryId, showToast]
  );

  // Sync breadcrumbs on mount
  useEffect(() => {
    setBreadcrumbs([{ label: "Product Management", href: "/products" }, { label: "Menu Items" }]);
  }, [setBreadcrumbs]);

  // Fetch products when pagination, search, or category filter changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset search filter immediately if input is cleared manually
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

  // Action Click Handlers
  const handleEditClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((product: Product) => {
    setProductToDelete(product);
    setIsConfirmDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteProduct(productToDelete.id);
      const isSuccess =
        response.success || (response as unknown as { status?: boolean }).status === true;
      if (isSuccess) {
        showToast(response.message || "Product deleted successfully.", "success");
        setIsConfirmDeleteOpen(false);
        setProductToDelete(null);
        fetchProducts(true);
      } else {
        showToast(response.message || "Failed to delete product.", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete product.";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  }, [productToDelete, fetchProducts, showToast]);

  // Instantiating columns with the local event handlers
  const columns = useMemo(
    () => getColumns(handleEditClick, handleDeleteClick),
    [handleEditClick, handleDeleteClick]
  );

  // Custom Left Toolbar with search functionality
  const customLeftToolbar = useMemo(() => {
    return (
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-auto">
          <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
            className="h-9 w-full bg-white! pl-9 shadow-sm sm:w-[200px] md:w-[300px]"
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

  // Custom Right Toolbar with Category Filter Dropdown next to Refresh button
  const customRightToolbar = useMemo(() => {
    return (
      <Select
        value={selectedCategoryId ? String(selectedCategoryId) : "all"}
        onValueChange={(val) => {
          setSelectedCategoryId(val === "all" ? null : Number(val));
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        onOpenChange={handleDropdownOpenChange}
      >
        <SelectTrigger className="h-9 w-full cursor-pointer bg-white! shadow-sm sm:w-fit sm:min-w-[160px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent position="popper" className="w-(--radix-select-trigger-width) bg-white!">
          <SelectItem value="all" className="cursor-pointer">
            All Categories
          </SelectItem>
          {isLoadingCategories ? (
            <div className="text-muted-foreground flex items-center justify-center p-2 text-xs">
              Loading categories...
            </div>
          ) : (
            categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)} className="cursor-pointer">
                {cat.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  }, [selectedCategoryId, categories, isLoadingCategories, handleDropdownOpenChange]);

  if (isLoading) {
    return (
      <div>
        <ProductSkeleton />
      </div>
    );
  }

  if (!isLoading && products.length === 0 && error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={5000} />
        )}
        <div className="mb-4 rounded-full bg-red-50 p-4 text-red-600">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-(--theme-burgundy-950)">Failed to Load Products</h3>
        <p className="mt-1 mb-6 max-w-md text-sm text-(--theme-coffee-500)">{error}</p>
        <Button onClick={() => fetchProducts()} variant="premium">
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
            Menu Items
          </h1>
          <p className="text-sm text-(--theme-coffee-500)">
            Supervise the master index of gourmet recipes, beverages, and pricing sets.
          </p>
        </div>
        <Button
          variant="premium"
          className="flex cursor-pointer items-center gap-2 self-start sm:self-auto"
          onClick={() => {
            setSelectedProduct(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </Button>
      </div>

      {/* Main Content Table */}
      <DataTable
        columns={columns}
        data={products}
        customLeftToolbar={customLeftToolbar}
        customRightToolbar={customRightToolbar}
        onRefresh={() => fetchProducts(true)}
        isLoading={isTableLoading || isRefreshing}
        searchLoadingContent={
          isTableLoading || isRefreshing ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Spinner variant="circle-filled" className="h-8 w-8 text-(--theme-burgundy-950)" />
              <span className="text-xs font-semibold text-(--theme-coffee-500)">
                Loading items...
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
              <ChefHat className="h-7 w-7 opacity-85" />
            </div>
            <h3 className="text-base font-bold tracking-tight text-(--theme-burgundy-950)">
              No Menu Items Found
            </h3>
            <p className="mt-1.5 mb-5 text-xs leading-relaxed text-(--theme-coffee-500)">
              There are no menu items matching the current search or category filters.
            </p>
            {(searchQuery || selectedCategoryId) && (
              <Button
                variant="premium"
                onClick={() => {
                  handleClearSearch();
                  setSelectedCategoryId(null);
                }}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4 text-xs"
              >
                <span>Clear Filters</span>
              </Button>
            )}
          </div>
        }
      />

      {/* Create / Update Item Dialog */}
      <CreateUpdateItemDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={() => fetchProducts(true)}
        showToast={showToast}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmDeleteOpen}
        title="Delete Item"
        description={
          <span className="text-sm font-medium">
            Are you sure you want to delete menu item{" "}
            <span className="font-bold text-(--theme-burgundy-950)">{productToDelete?.name}</span>?
            This action will soft-delete the item.
          </span>
        }
        isLoading={isDeleting}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        confirmButtonText="Delete"
        variant="danger"
        icon={<Trash2 className="h-6 w-6 text-red-600" />}
      />
    </div>
  );
}
