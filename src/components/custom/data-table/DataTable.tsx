"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Updater,
  PaginationState,
  RowData,
} from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    minWidth?: string | number;
  }
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableMobileGrid } from "./DataTableMobileGrid";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  meta?: Record<string, unknown>; // For custom metadata if needed
  searchKey?: string;
  /** Alignment of cell content. 'left' for left-aligned, 'center' for centered (default) */
  align?: "left" | "center";
  /** Optional callback to refresh the table data */
  onRefresh?: () => void;
  /** Whether the table is currently loading/refreshing */
  isLoading?: boolean;
  /** Optional custom content to render on the left side of the toolbar (e.g. custom search) */
  customLeftToolbar?: React.ReactNode;
  /** Optional loading overlay content to render over the table body only (e.g. search loading) */
  searchLoadingContent?: React.ReactNode;
  /** Optional custom empty state content to render inside the table body when no rows exist */
  emptyStateContent?: React.ReactNode;
  /** Total number of rows across all pages (for server-side pagination) */
  totalRows?: number;
  /** Hide the bottom pagination component completely */
  hidePagination?: boolean;
  /** Hide the built-in refresh button on mobile screens */
  hideRefreshOnMobile?: boolean;
  /** Disable the row hover highlight effect */
  disableRowHover?: boolean;
  /** Custom page size options for the pagination dropdown. Defaults to [25, 50, 75, 100] */
  pageSizeOptions?: number[];
  /** Optional function to determine custom row class names based on row data */
  getRowClassName?: (data: TData) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = -1,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pagination: controlledPagination,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  searchKey,
  align = "left",
  onRefresh,
  isLoading = false,
  customLeftToolbar,
  searchLoadingContent,
  emptyStateContent,
  totalRows,
  hidePagination = false,
  hideRefreshOnMobile = false,
  disableRowHover = false,
  pageSizeOptions,
  meta,
  getRowClassName,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalPagination, setInternalPagination] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const pagination = controlledPagination ?? internalPagination;

  // Update internal states when props change for manual control or sync
  const handlePaginationChange = (updaterOrValue: Updater<PaginationState>) => {
    const newPagination =
      typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue;

    if (onPaginationChange) {
      onPaginationChange(newPagination);
    }
    setInternalPagination(newPagination);
  };

  const handleSortingChange = (updaterOrValue: Updater<SortingState>) => {
    const newSorting =
      typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
    setSorting(newSorting);
    if (onSortingChange) {
      onSortingChange(newSorting);
    }
  };

  const handleColumnFiltersChange = (updaterOrValue: Updater<ColumnFiltersState>) => {
    const newFilters =
      typeof updaterOrValue === "function" ? updaterOrValue(columnFilters) : updaterOrValue;
    setColumnFilters(newFilters);
    if (onColumnFiltersChange) {
      onColumnFiltersChange(newFilters);
    }
  };

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table's useReactTable returns functions that cannot be memoized safely
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      pagination,
    },
    meta,
    enableRowSelection: true,
    pageCount: manualPagination ? pageCount : undefined,
    manualPagination: manualPagination,
    manualSorting: manualSorting,
    manualFiltering: manualFiltering,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  const hasToolbarContent = customLeftToolbar || searchKey || onRefresh;

  return (
    <div className="space-y-4">
      {hasToolbarContent && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            {/* Custom left toolbar content */}
            {customLeftToolbar}
            {/* Search Input Place Holder - if searchKey is provided */}
            {searchKey && (
              <Input
                placeholder="Filter..."
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                className="h-9 max-w-sm bg-white! shadow-sm"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className={`hover:bg-muted/10! hover:text-foreground! h-9 cursor-pointer gap-2 px-3 shadow-sm transition-all ${hideRefreshOnMobile ? "hidden sm:flex" : "flex"}`}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Table View - visible on lg screens and above */}
      <div className="border-border relative hidden overflow-x-auto rounded-xl border lg:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} data-bone="true" className="border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`bg-primary! !hover:bg-accent h-12 px-4 text-sm! font-semibold! text-white! normal-case ${header.column.columnDef.meta?.headerClassName || ""} ${header.column.id === "actions" ? "text-center!" : align === "left" ? "text-left!" : "text-center!"}`}
                      style={{
                        width:
                          header.column.getSize() !== 150 ? header.column.getSize() : undefined,
                        minWidth: header.column.columnDef.meta?.minWidth,
                      }}
                    >
                      <div data-bone-ignore="true" className="contents">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative">
            {/* Search loading overlay - only covers table body */}
            {searchLoadingContent && (
              <TableRow className="bg-white! hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  <div className="flex items-center justify-center py-16">
                    {searchLoadingContent}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!searchLoadingContent && (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-bone="true"
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "border-b transition-colors duration-200",
                        disableRowHover ? "" : "hover:bg-[#e1e8ed]!",
                        getRowClassName ? getRowClassName(row.original) : "bg-white"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-3">
                          <div
                            data-bone-ignore="true"
                            className={`flex w-full ${
                              cell.column.id === "actions"
                                ? "justify-center"
                                : align === "left"
                                  ? "justify-start"
                                  : "justify-center"
                            }`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="bg-white! hover:bg-transparent">
                    <TableCell colSpan={columns.length} className="p-0">
                      {emptyStateContent ? (
                        <div className="flex items-center justify-center py-12">
                          {emptyStateContent}
                        </div>
                      ) : (
                        <div className="flex h-24 items-center justify-center text-center">
                          No results.
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Grid View - visible on screens below lg */}
      <div className="relative lg:hidden">
        {searchLoadingContent && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white!">
            {searchLoadingContent}
          </div>
        )}
        {table.getRowModel().rows?.length ? (
          <DataTableMobileGrid table={table} />
        ) : !searchLoadingContent && emptyStateContent ? (
          <div className="flex items-center justify-center py-12">{emptyStateContent}</div>
        ) : (
          <DataTableMobileGrid table={table} />
        )}
      </div>

      {!hidePagination && (
        <DataTablePagination
          table={table}
          totalRows={totalRows}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}
