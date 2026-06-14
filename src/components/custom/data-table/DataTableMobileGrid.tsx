"use client";

import * as React from "react";
import { Table, flexRender, Header } from "@tanstack/react-table";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

function formatColumnId(id: string): string {
  return id
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getHeaderLabel<TData, TValue>(
  header: Header<TData, TValue> | undefined,
  columnId: string
): string {
  if (!header) return formatColumnId(columnId);

  const headerDef = header.column.columnDef.header;
  if (typeof headerDef === "function") {
    try {
      const headerContext = header.getContext();
      const rendered = headerDef(headerContext);
      if (React.isValidElement(rendered)) {
        const props = rendered.props as Record<string, unknown>;
        if (props?.title && typeof props.title === "string") {
          return props.title;
        }
        if (props?.children && typeof props.children === "string") {
          return props.children;
        }
      }
    } catch {
      // ignore and fallback
    }
    return formatColumnId(columnId);
  }

  if (headerDef && typeof headerDef !== "function") {
    if (typeof headerDef === "string") return headerDef;
    const element = headerDef as unknown as React.ReactElement;
    if (React.isValidElement(element)) {
      const props = element.props as Record<string, unknown>;
      if (props?.title && typeof props.title === "string") {
        return props.title;
      }
      if (props?.children && typeof props.children === "string") {
        return props.children;
      }
    }
  }

  return formatColumnId(columnId);
}

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
      <div className="flex items-center justify-center rounded-xl border border-dashed border-(--theme-coffee-200) bg-(--theme-coffee-50)/10 p-12">
        <div className="max-w-xs text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-(--theme-coffee-100) bg-(--theme-coffee-50) text-(--theme-coffee-400)">
            <Inbox className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-(--theme-burgundy-950)">No results found</p>
          <p className="mt-1 text-xs leading-relaxed text-(--theme-coffee-500)">
            Try adjusting your filters or search criteria.
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
              "group bg-card relative flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-200",
              "border-border hover:border-primary/50",
              "shadow-sm hover:shadow-md"
            )}
          >
            {/* Card Header - Primary Column */}
            <div className="border-border bg-primary/70 flex min-h-[72px] items-start justify-between gap-3 border-b p-3.5">
              <div className="min-w-0 flex-1">
                {/* Primary Column Label */}
                {primaryHeader && (
                  <p className="text-secondary mb-1 text-[10px] font-bold tracking-wider uppercase">
                    {getHeaderLabel(primaryHeader, primaryHeader.id)}
                  </p>
                )}
                {/* Primary Column Value */}
                {primaryCell && (
                  <div className="text-secondary text-sm font-semibold">
                    {flexRender(primaryCell.column.columnDef.cell, primaryCell.getContext())}
                  </div>
                )}
              </div>
            </div>

            {/* Card Body - Other Columns */}
            <div className="flex-1 space-y-2.5 p-3.5">
              {remainingCells.map((cell) => {
                const header = headers.find((h) => h.id === cell.column.id);
                const headerLabel = getHeaderLabel(header, cell.column.id);

                return (
                  <div
                    key={cell.id}
                    className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1 py-1"
                  >
                    <span className="text-muted-foreground w-24 shrink-0 text-xs font-medium">
                      {headerLabel}
                    </span>
                    <div className="text-foreground flex max-w-full items-center justify-start text-sm wrap-break-word">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Footer */}
            {actionCell && (
              <div className="border-border bg-muted/20 flex items-center justify-center border-t p-3">
                <div className="contents">
                  {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
                </div>
              </div>
            )}

            {/* Selection indicator glow effect */}
            {row.getIsSelected() && (
              <div className="ring-primary pointer-events-none absolute inset-0 rounded-xl ring-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}
