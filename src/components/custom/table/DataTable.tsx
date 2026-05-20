"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
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
} from "@tanstack/react-table";

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
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableMobileGrid } from "./DataTableMobileGrid";

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
  /** Hide the column visibility toggler */
  hideViewOptions?: boolean;
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
  align = "center",
  onRefresh,
  isLoading = false,
  customLeftToolbar,
  searchLoadingContent,
  emptyStateContent,
  totalRows,
  hidePagination = false,
  hideViewOptions = false,
  meta,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
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
      columnVisibility,
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
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
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
              className="h-9 max-w-sm border-gray-300 bg-white shadow-sm"
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
              className="h-9 cursor-pointer gap-2 border-gray-300 bg-white px-3 shadow-sm transition-all hover:bg-gray-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
          {!hideViewOptions && <DataTableViewOptions table={table} />}
        </div>
      </div>

      {/* Desktop Table View - visible on lg screens and above */}
      <div className="relative hidden overflow-hidden rounded-xl border bg-white shadow-sm lg:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-[#8bcbdc] bg-[#a2d2df] hover:bg-[#a2d2df]"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="h-12 px-4 text-xs font-bold tracking-wider text-[#0f172a] uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative">
            {/* Search loading overlay - only covers table body */}
            {searchLoadingContent && (
              <TableRow className="hover:bg-transparent">
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
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-3">
                          <div
                            className={`flex ${align === "left" ? "justify-start" : "justify-center"}`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
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
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-[1px]">
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

      {!hidePagination && <DataTablePagination table={table} totalRows={totalRows} />}
    </div>
  );
}
