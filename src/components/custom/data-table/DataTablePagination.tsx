import { useEffect, useRef } from "react";
import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalRows?: number;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  totalRows: manualTotalRows,
  pageSizeOptions = [25, 50, 75, 100],
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const filteredRowsCount = table.getFilteredRowModel().rows.length;
  // Use passed totalRows if available (manual pagination), otherwise use filtered rows count
  const totalRows = manualTotalRows !== undefined ? manualTotalRows : filteredRowsCount;

  const paginationRef = useRef<HTMLDivElement>(null);

  // Scroll to top when page changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (paginationRef.current) {
      // Find the nearest scrollable parent container
      let parent = paginationRef.current.parentElement;
      let scrollableElement: Element | Window = window;

      while (parent) {
        const style = window.getComputedStyle(parent);
        const overflowY = style.overflowY;
        const isScrollable = overflowY === "auto" || overflowY === "scroll";

        // Also ensure the element actually has scrollable content
        if (isScrollable && parent.scrollHeight > parent.clientHeight) {
          scrollableElement = parent;
          break;
        }
        parent = parent.parentElement;
      }

      scrollableElement.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pageIndex, pageSize]);

  // Calculate actual range based on current page visibility
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const currentRowsCount = table.getRowModel().rows.length;
  const endRow = totalRows === 0 ? 0 : Math.min(startRow + currentRowsCount - 1, totalRows);

  const showingText =
    startRow === endRow
      ? `Showing ${startRow} of ${totalRows} entries`
      : `Showing ${startRow} to ${endRow} of ${totalRows} entries`;

  return (
    <div ref={paginationRef} className="py-1">
      {/* Desktop Layout - Original layout for lg screens and above */}
      <div className="hidden items-center justify-between px-0 lg:flex">
        <div className="text-sm">{showingText}</div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-9 w-[75px] cursor-pointer bg-white! shadow-sm">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="top"
                className="border-border! min-w-auto bg-white!"
              >
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`} className="cursor-pointer">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-9 w-9 cursor-pointer bg-white! p-0 shadow-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-9 w-9 cursor-pointer bg-white! p-0 shadow-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pageIndex + 1} of {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              className="h-9 w-9 cursor-pointer bg-white! p-0 shadow-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-9 w-9 cursor-pointer bg-white! p-0 shadow-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Layout - For screens below lg */}
      <div className="flex flex-col gap-3 lg:hidden">
        {/* Row 1: Entries count on left, Rows per page on right */}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-xs">{showingText}</div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Rows</span>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[65px] bg-white! text-xs shadow-sm">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="top"
                className="border-border! min-w-auto bg-white!"
              >
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Pagination controls centered */}
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            className="h-8 w-8 cursor-pointer bg-white! p-0 shadow-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 cursor-pointer bg-white! p-0 shadow-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <div className="text-foreground flex min-w-[80px] items-center justify-center px-2 text-xs font-medium">
            Page {pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 cursor-pointer bg-white! p-0 shadow-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 cursor-pointer bg-white! p-0 shadow-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
