"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { AlertTriangle, Trash2, ImagePlay, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBreadcrumb } from "@/components/pages/layout/Breadcrumb";
import { Toast, useToast } from "@/components/common";
import { DataTable } from "@/components/custom/data-table";
import { getAllBanners, deleteBanner } from "@/lib/api/admin/banner-api";
import type { Banner } from "@/types";
import { getColumns } from "./BannerColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/custom/ConfirmationDialog";
import { BannerDetailDialog } from "./banner-details-dialog/BannerDetailDialog";
import { CreateUpdateBannerDialog } from "./create-update-banner-dialog/CreateUpdateBannerDialog";
import { Spinner } from "@/components/ui/loader";

// Skeleton view for banner grid/table loading
const BannerSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
    </div>
    <div className="border-muted space-y-4 rounded-xl border p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border-muted/50 flex items-center gap-6 border-b py-4 last:border-0"
        >
          <Skeleton className="h-14 w-28 shrink-0 rounded-xl" />
          <Skeleton className="h-20 w-12 shrink-0 rounded-xl" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 max-w-sm flex-1" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="ml-auto h-8 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export function BannersClient() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { toast, showToast, hideToast } = useToast();

  const [banners, setBanners] = useState<Banner[]>([]);
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

  // Dialog State
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBanners = useCallback(
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
        const params: { page: number; limit: number; search?: string } = {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        };

        if (searchQuery.trim() !== "") {
          params.search = searchQuery;
        }

        const response = await getAllBanners(params);
        const isSuccess =
          response.success || (response as unknown as { status?: boolean }).status === true;

        if (isSuccess) {
          // Filter out is_deleted = true banners from view
          const activeBanners = (response.data || []).filter((b) => !b.is_deleted);
          setBanners(activeBanners);
          setTotalRows(response.pagination?.total || activeBanners.length);
          setTotalPages(response.pagination?.totalPages || 1);
        } else {
          const msg = response.message || "Failed to load banners";
          setError(msg);
          showToast(msg, "error");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load banners";
        setError(msg);
        showToast(msg, "error");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsTableLoading(false);
        isInitialMount.current = false;
      }
    },
    [pagination.pageIndex, pagination.pageSize, searchQuery, showToast]
  );

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "App Customization", href: "/app-customization" },
      { label: "Banners" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

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

  const handleInfoClick = useCallback((banner: Banner) => {
    setSelectedBanner(banner);
    setIsDetailOpen(true);
  }, []);

  const handleEditClick = useCallback((banner: Banner) => {
    setSelectedBanner(banner);
    setDialogKey((k) => k + 1);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((banner: Banner) => {
    setBannerToDelete(banner);
    setIsConfirmDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!bannerToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteBanner(bannerToDelete.id);
      const isSuccess =
        response.success !== false &&
        (response as unknown as { status?: boolean }).status !== false;
      if (isSuccess) {
        showToast(response.message || "Banner deleted successfully.", "success");
        setIsConfirmDeleteOpen(false);
        setBannerToDelete(null);
        fetchBanners(true);
      } else {
        showToast(response.message || "Failed to delete banner.", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete banner.";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  }, [bannerToDelete, fetchBanners, showToast]);

  // Table columns mapping
  const columns = useMemo(
    () => getColumns(handleInfoClick, handleEditClick, handleDeleteClick),
    [handleInfoClick, handleEditClick, handleDeleteClick]
  );

  // Search left toolbar container
  const customLeftToolbar = useMemo(() => {
    return (
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-auto">
          <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
          <Input
            placeholder="Search banners by title..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
            className="h-9 w-full bg-white! pl-9 shadow-sm sm:w-[240px] md:w-[320px]"
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

  if (isLoading) {
    return (
      <div className="py-4">
        <BannerSkeleton />
      </div>
    );
  }

  if (!isLoading && banners.length === 0 && error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={5000} />
        )}
        <div className="mb-4 rounded-full bg-red-50 p-4 text-red-600">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-bold text-(--theme-burgundy-950)">Failed to Load Banners</h3>
        <p className="mt-1 mb-6 max-w-md text-sm text-(--theme-coffee-500)">{error}</p>
        <Button onClick={() => fetchBanners()} variant="premium">
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

      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-(--theme-burgundy-950)">
            Banners Management
          </h1>
          <p className="text-sm text-(--theme-coffee-500)">
            Monitor, view, or organize visual promotional assets running on the mobile and desktop
            user interfaces.
          </p>
        </div>
        <Button
          variant="premium"
          className="flex cursor-pointer items-center gap-2 self-start sm:self-auto"
          onClick={() => {
            setSelectedBanner(null);
            setDialogKey((k) => k + 1);
            setIsFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Add Banner</span>
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={banners}
        customLeftToolbar={customLeftToolbar}
        onRefresh={() => fetchBanners(true)}
        isLoading={isTableLoading || isRefreshing}
        searchLoadingContent={
          isTableLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Spinner variant="circle-filled" className="h-8 w-8 text-(--theme-burgundy-950)" />
              <span className="text-xs font-semibold text-(--theme-coffee-500)">
                Loading banners...
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
        pageSizeOptions={[10, 25, 50]}
        emptyStateContent={
          <div className="mx-auto flex max-w-sm flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-(--theme-coffee-150) bg-(--theme-coffee-50) text-(--theme-coffee-500) shadow-sm">
              <ImagePlay className="h-7 w-7 opacity-85" />
            </div>
            <h3 className="text-base font-bold tracking-tight text-(--theme-burgundy-950)">
              No Active Banners Found
            </h3>
            <p className="mt-1.5 mb-5 text-xs leading-relaxed text-(--theme-coffee-500)">
              There are no advertising banners registered or matching your active search criteria.
            </p>
            {searchQuery ? (
              <Button
                variant="premium"
                onClick={handleClearSearch}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4 text-xs"
              >
                <span>Clear Filters</span>
              </Button>
            ) : (
              <Button
                variant="premium"
                onClick={() => {
                  setSelectedBanner(null);
                  setDialogKey((k) => k + 1);
                  setIsFormOpen(true);
                }}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4 text-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add Banner</span>
              </Button>
            )}
          </div>
        }
      />

      {/* Banner Detail Dialog */}
      <BannerDetailDialog
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBanner(null);
        }}
        banner={selectedBanner}
      />

      {/* Create/Update Banner Form Dialog */}
      <CreateUpdateBannerDialog
        key={dialogKey}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBanner(null);
        }}
        banner={selectedBanner}
        onSuccess={() => fetchBanners(true)}
        showToast={showToast}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmDeleteOpen}
        title="Delete Banner"
        description={
          <span className="text-sm font-medium">
            Are you sure you want to delete banner{" "}
            <span className="font-bold text-(--theme-burgundy-950)">{bannerToDelete?.title}</span>?
            This action will soft-delete the banner.
          </span>
        }
        isLoading={isDeleting}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setBannerToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        confirmButtonText="Delete"
        variant="danger"
        icon={<Trash2 className="h-6 w-6 text-red-600" />}
      />
    </div>
  );
}
