"use client";

import React, { useEffect, useMemo } from "react";
import { AlertTriangle, ChefHat, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useBreadcrumb } from "@/components/pages/layout/Breadcrumb";
import { Toast } from "@/components/common";
import { DataTable } from "@/components/custom/data-table";
import { getColumns } from "./StockColumns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/loader";
import { useStock } from "./hooks/useStock";
import { StockSkeleton } from "./components/StockSkeleton";
import { StockStatsCards } from "./components/StockStatsCards";

export function StockClient() {
  const { setBreadcrumbs } = useBreadcrumb();
  const {
    stockItems,
    isEditing,
    editingRowId,
    savingRowId,
    isLoading,
    isRefreshing,
    isTableLoading,
    error,
    toast,
    searchVal,
    searchQuery,
    selectedCategoryId,
    categories,
    isLoadingCategories,
    isChanged,
    stats,
    errorsRef,
    formik,
    setSearchVal,
    setSelectedCategoryId,
    fetchStock,
    handleStartEditing,
    handleCancelEditing,
    handleCellChange,
    handleStartRowEditing,
    handleCancelRowEditing,
    handleSaveRowEditing,
    handleSaveChanges,
    handleSearchSubmit,
    handleClearSearch,
    handleDropdownOpenChange,
    hideToast,
  } = useStock();

  // Sync breadcrumbs on mount
  useEffect(() => {
    setBreadcrumbs([
      { label: "Product Management", href: "/products" },
      { label: "Stock Management" },
    ]);
  }, [setBreadcrumbs]);

  const columns = useMemo(
    () =>
      getColumns(
        isEditing,
        handleCellChange,
        errorsRef, // passed as ref — errors display stays live without being a dep
        editingRowId,
        handleStartRowEditing,
        handleSaveRowEditing,
        handleCancelRowEditing,
        savingRowId,
        stockItems
      ),
    [
      // Only rebuild columns when edit mode or the row being edited/saved changes.
      // All callbacks below are permanently stable (empty useCallback deps) so
      // including them here satisfies the linter with zero rebuild cost.
      isEditing,
      editingRowId,
      savingRowId,
      stockItems,
      handleCellChange,
      handleStartRowEditing,
      handleSaveRowEditing,
      handleCancelRowEditing,
      errorsRef,
    ]
  );

  // Custom Left Toolbar with search functionality
  const customLeftToolbar = useMemo(() => {
    return (
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-auto">
          <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
          <Input
            disabled={isEditing || editingRowId !== null}
            placeholder="Search stocks..."
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
            disabled={isEditing || editingRowId !== null}
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
            disabled={isEditing || editingRowId !== null}
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
  }, [
    isEditing,
    editingRowId,
    searchVal,
    searchQuery,
    handleSearchSubmit,
    handleClearSearch,
    setSearchVal,
  ]);

  // Custom Right Toolbar with Category Filter Dropdown
  const customRightToolbar = useMemo(() => {
    return (
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <Select
          disabled={isEditing || editingRowId !== null}
          value={selectedCategoryId ? String(selectedCategoryId) : "all"}
          onValueChange={(val) => {
            setSelectedCategoryId(val === "all" ? null : Number(val));
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
      </div>
    );
  }, [
    isEditing,
    editingRowId,
    selectedCategoryId,
    categories,
    isLoadingCategories,
    handleDropdownOpenChange,
    setSelectedCategoryId,
  ]);

  if (isLoading) {
    return <StockSkeleton />;
  }

  if (!isLoading && stockItems.length === 0 && error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={5000} />
        )}
        <div className="mb-4 rounded-full bg-red-50 p-4 text-red-600">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-(--theme-burgundy-950)">Failed to Load Stock Data</h3>
        <p className="mt-1 mb-6 max-w-md text-sm text-(--theme-coffee-500)">{error}</p>
        <Button onClick={() => fetchStock()} variant="premium">
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={5000} />
      )}

      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-(--theme-burgundy-950)">
            Stock Management
          </h1>
          <p className="text-sm text-(--theme-coffee-500)">
            Monitor warehouse quantities, track low items, and view minimum ordering constraints.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          {!isEditing ? (
            <Button
              variant="premium"
              size="lg"
              disabled={editingRowId !== null}
              onClick={handleStartEditing}
              className="text-md w-full cursor-pointer font-semibold hover:bg-(--theme-burgundy-700) disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Update Stock
            </Button>
          ) : (
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Button
                variant="premium"
                size="lg"
                onClick={handleSaveChanges}
                disabled={!isChanged || !formik.isValid || isTableLoading}
                className="text-md w-full cursor-pointer font-semibold hover:bg-(--theme-burgundy-800) sm:w-auto"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleCancelEditing}
                className="text-md w-full cursor-pointer font-semibold hover:bg-(--theme-burgundy-50) sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stock Status Cards */}
      <StockStatsCards stats={stats} />

      {/* Stock table */}
      <DataTable
        columns={columns}
        data={isEditing || editingRowId !== null ? formik.values.products : stockItems}
        customLeftToolbar={customLeftToolbar}
        customRightToolbar={customRightToolbar}
        onRefresh={isEditing || editingRowId !== null ? undefined : () => fetchStock(true)}
        isLoading={isTableLoading || isRefreshing}
        disableRowHover={isEditing || editingRowId !== null}
        searchLoadingContent={
          isTableLoading || isRefreshing ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Spinner variant="circle-filled" className="h-8 w-8 text-(--theme-burgundy-950)" />
              <span className="text-xs font-semibold text-(--theme-coffee-500)">
                Updating stock view...
              </span>
            </div>
          ) : undefined
        }
        align="left"
        // Controlled single page to display all rows without pagination controls
        pagination={{ pageIndex: 0, pageSize: 9999 }}
        hidePagination={true}
        emptyStateContent={
          <div className="mx-auto flex max-w-sm flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-(--theme-coffee-150) bg-(--theme-coffee-50) text-(--theme-coffee-500) shadow-sm">
              <ChefHat className="h-7 w-7 opacity-85" />
            </div>
            <h3 className="text-base font-bold tracking-tight text-(--theme-burgundy-950)">
              No Item Stocks Found
            </h3>
            <p className="mt-1.5 mb-5 text-xs leading-relaxed text-(--theme-coffee-500)">
              There are no product stock logs matching the current search or category criteria.
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
    </div>
  );
}
