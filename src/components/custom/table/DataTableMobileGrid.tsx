"use client";

import * as React from "react";
import { Table, flexRender } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableMobileGridProps<TData> {
  table: Table<TData>;
}

export function DataTableMobileGrid<TData>({ table }: DataTableMobileGridProps<TData>) {
  const rows = table.getRowModel().rows;
  const headers = table.getFlatHeaders();

  // Get the primary column (first non-actions column) for the card header
  const getPrimaryHeader = () => {
    return headers.find((h) => h.id !== "actions" && h.id !== "select");
  };

  // Get action column if exists
  const getActionHeader = () => {
    return headers.find((h) => h.id === "actions");
  };

  if (!rows.length) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-(--theme-coffee-200) bg-white/50 p-12">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-(--theme-cream-100)">
            <MoreVertical className="h-6 w-6 text-(--theme-coffee-400)" />
          </div>
          <p className="text-sm font-medium text-(--theme-burgundy-700)">No results found</p>
          <p className="mt-1 text-xs text-(--theme-burgundy-400)">
            Try adjusting your filters or search criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => {
        const primaryHeader = getPrimaryHeader();
        const actionHeader = getActionHeader();

        // Get visible cells
        const visibleCells = row.getVisibleCells();
        const primaryCell = primaryHeader
          ? visibleCells.find((c) => c.column.id === primaryHeader.id)
          : null;
        const actionCell = actionHeader
          ? visibleCells.find((c) => c.column.id === actionHeader.id)
          : null;
        const remainingCells = visibleCells.filter(
          (c) =>
            c.column.id !== primaryHeader?.id &&
            c.column.id !== "actions" &&
            c.column.id !== "select"
        );

        return (
          <div
            key={row.id}
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-white transition-all duration-200",
              "border-(--theme-coffee-100) hover:border-(--theme-taupe-300)",
              "shadow-sm hover:shadow-md"
            )}
          >
            {/* Card Header - Primary Column */}
            <div className="flex items-start justify-between gap-3 border-b border-(--theme-coffee-50) bg-linear-to-r from-(--theme-cream-50) to-white p-3.5">
              <div className="min-w-0 flex-1">
                {/* Primary Column Label */}
                {primaryHeader && (
                  <p className="mb-1 text-[10px] font-semibold tracking-wider text-(--theme-coffee-400) uppercase">
                    {typeof primaryHeader.column.columnDef.header === "function"
                      ? (() => {
                          // Extract title from the header component if possible
                          const headerContext = primaryHeader.getContext();
                          const headerElement = flexRender(
                            primaryHeader.column.columnDef.header,
                            headerContext
                          );
                          // Try to get the title prop from DataTableColumnHeader
                          if (React.isValidElement(headerElement)) {
                            const props = headerElement.props as Record<string, unknown>;
                            if (props?.title && typeof props.title === "string") {
                              return props.title;
                            }
                          }
                          return primaryHeader.id
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase());
                        })()
                      : primaryHeader.column.columnDef.header || primaryHeader.id}
                  </p>
                )}
                {/* Primary Column Value */}
                {primaryCell && (
                  <div className="text-sm font-medium text-(--theme-burgundy-900)">
                    {flexRender(primaryCell.column.columnDef.cell, primaryCell.getContext())}
                  </div>
                )}
              </div>
            </div>

            {/* Card Body - Other Columns */}
            <div className="space-y-2.5 p-3.5">
              {remainingCells.map((cell) => {
                const header = headers.find((h) => h.id === cell.column.id);
                const headerLabel = (() => {
                  if (!header) return cell.column.id;
                  if (typeof header.column.columnDef.header === "function") {
                    const headerContext = header.getContext();
                    const headerElement = flexRender(header.column.columnDef.header, headerContext);
                    if (React.isValidElement(headerElement)) {
                      const props = headerElement.props as Record<string, unknown>;
                      if (props?.title && typeof props.title === "string") {
                        return props.title;
                      }
                    }
                    return cell.column.id
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());
                  }
                  return header.column.columnDef.header || cell.column.id;
                })();

                const alignMobile = (cell.column.columnDef.meta as Record<string, unknown>)
                  ?.alignMobile;

                return (
                  <div
                    key={cell.id}
                    className={cn(
                      "flex gap-2",
                      alignMobile === "center" || cell.column.id === "value"
                        ? "items-center"
                        : "items-start"
                    )}
                  >
                    <span className="shrink-0 text-xs font-medium text-(--theme-burgundy-400)">
                      {headerLabel}
                    </span>
                    <div className="min-w-0 text-sm text-(--theme-burgundy-700)">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Footer */}
            {actionCell && (
              <div className="flex items-center justify-center border-t border-(--theme-coffee-50) bg-slate-50/50 p-3">
                {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
              </div>
            )}

            {/* Selection indicator glow effect */}
            {row.getIsSelected() && (
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-(--theme-taupe-400)" />
            )}
          </div>
        );
      })}
    </div>
  );
}
