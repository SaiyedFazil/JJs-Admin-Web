"use client";

import React from "react";
import { DataTableColumnHeader } from "@/components/custom/data-table/DataTableColumnHeader";
import type { ItemStock } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import type { FormikErrors } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumericInputCell } from "./components/NumericInputCell";
import { RowActionsCell } from "./components/RowActionsCell";

/**
 * Helper to fetch specific cell field error safely without TypeScript compiler type errors.
 */
const getFieldError = (
  errors: string | string[] | FormikErrors<ItemStock>[] | undefined,
  index: number,
  field: keyof ItemStock
): string | undefined => {
  if (!errors || !Array.isArray(errors)) return undefined;
  const rowError = errors[index];
  if (!rowError || typeof rowError !== "object") return undefined;
  return (rowError as FormikErrors<ItemStock>)[field];
};

/**
 * Generates columns definition for the Product Stock table
 */
export function getColumns(
  isEditing?: boolean,
  onCellChange?: (rowId: number, field: keyof ItemStock, value: string | number | boolean) => void,
  errorsRef?: React.MutableRefObject<string | string[] | FormikErrors<ItemStock>[] | undefined>,
  editingRowId?: number | null,
  onStartRowEdit?: (rowId: number) => void,
  onSaveRowEdit?: (rowId: number) => void,
  onCancelRowEdit?: (rowId: number) => void,
  savingRowId?: number | null,
  stockItems?: ItemStock[]
): ColumnDef<ItemStock>[] {
  const columnsList: ColumnDef<ItemStock>[] = [
    {
      id: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Name" className="justify-start" />
      ),
      accessorKey: "name",
      size: 200,
      cell: ({ row }) => {
        return (
          <span className="text-sm font-bold tracking-tight text-(--theme-burgundy-950)">
            {row.original.name}
          </span>
        );
      },
    },
    {
      id: "available_stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Available Stock" className="justify-start" />
      ),
      accessorKey: "available_stock",
      size: 130,
      cell: ({ row }) => {
        if ((isEditing || editingRowId === row.original.id) && onCellChange) {
          const fieldError = getFieldError(errorsRef?.current, row.index, "available_stock");
          return (
            <NumericInputCell
              value={row.original.available_stock}
              onChange={(val) => onCellChange(row.original.id, "available_stock", val)}
              error={fieldError}
              widthClass="w-24"
            />
          );
        }

        const available = row.original.available_stock;

        if (available === 0) {
          return (
            <span className="inline-flex animate-pulse items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-sm font-semibold text-red-700 shadow-sm">
              Out of Stock (0)
            </span>
          );
        }

        if (available <= 10) {
          return (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700 shadow-sm">
              Low Stock ({available})
            </span>
          );
        }

        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
            In Stock ({available})
          </span>
        );
      },
    },
    {
      id: "total_stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Stock" className="justify-start" />
      ),
      accessorKey: "total_stock",
      size: 110,
      cell: ({ row }) => {
        if ((isEditing || editingRowId === row.original.id) && onCellChange) {
          const fieldError = getFieldError(errorsRef?.current, row.index, "total_stock");
          return (
            <NumericInputCell
              value={row.original.total_stock}
              onChange={(val) => onCellChange(row.original.id, "total_stock", val)}
              error={fieldError}
              widthClass="w-24"
            />
          );
        }

        return (
          <span className="text-sm font-semibold text-(--theme-burgundy-900)">
            {row.original.total_stock}
          </span>
        );
      },
    },
    {
      id: "min_order_qty",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Min Order Qty" className="justify-start" />
      ),
      accessorKey: "min_order_qty",
      size: 120,
      cell: ({ row }) => {
        if ((isEditing || editingRowId === row.original.id) && onCellChange) {
          const fieldError = getFieldError(errorsRef?.current, row.index, "min_order_qty");
          return (
            <NumericInputCell
              value={row.original.min_order_qty}
              onChange={(val) => onCellChange(row.original.id, "min_order_qty", val)}
              error={fieldError}
              widthClass="w-24"
            />
          );
        }

        return <span className="text-sm text-gray-700">{row.original.min_order_qty}</span>;
      },
    },
    {
      id: "max_order_qty",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Max Order Qty" className="justify-start" />
      ),
      accessorKey: "max_order_qty",
      size: 120,
      cell: ({ row }) => {
        if ((isEditing || editingRowId === row.original.id) && onCellChange) {
          const fieldError = getFieldError(errorsRef?.current, row.index, "max_order_qty");
          return (
            <NumericInputCell
              value={row.original.max_order_qty}
              onChange={(val) => onCellChange(row.original.id, "max_order_qty", val)}
              error={fieldError}
              widthClass="w-24"
            />
          );
        }

        return <span className="text-sm text-gray-700">{row.original.max_order_qty}</span>;
      },
    },
    {
      id: "lead_time",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lead Time" className="justify-start" />
      ),
      accessorKey: "lead_time",
      size: 110,
      cell: ({ row }) => {
        if ((isEditing || editingRowId === row.original.id) && onCellChange) {
          const fieldError = getFieldError(errorsRef?.current, row.index, "lead_time");
          return (
            <NumericInputCell
              value={row.original.lead_time}
              onChange={(val) => onCellChange(row.original.id, "lead_time", val)}
              error={fieldError}
              widthClass="w-28"
            />
          );
        }

        const minutes = row.original.lead_time;
        return (
          <span className="text-sm text-gray-700">
            {minutes} {minutes === 1 ? "minute" : "minutes"}
          </span>
        );
      },
    },
    {
      id: "is_not_returnable",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Return Policy" className="justify-center" />
      ),
      accessorKey: "is_not_returnable",
      size: 130,
      cell: ({ row }) => {
        if ((isEditing || editingRowId === row.original.id) && onCellChange) {
          return (
            <div className="flex w-full justify-center">
              <Select
                value={String(row.original.is_not_returnable)}
                onValueChange={(val) =>
                  onCellChange(row.original.id, "is_not_returnable", val === "true")
                }
              >
                <SelectTrigger className="h-9 border-gray-200 bg-white! text-sm font-semibold text-(--theme-burgundy-950) shadow-xs focus:ring-1 focus:ring-(--theme-burgundy)">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white!">
                  <SelectItem
                    value="false"
                    className="cursor-pointer text-sm font-semibold text-(--theme-burgundy-950)"
                  >
                    False
                  </SelectItem>
                  <SelectItem
                    value="true"
                    className="cursor-pointer text-sm font-semibold text-(--theme-burgundy-950)"
                  >
                    True
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        }

        const isNotReturnable = row.original.is_not_returnable;
        return (
          <div className="flex w-full justify-center">
            {isNotReturnable ? (
              <span className="inline-flex items-center rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1 text-sm font-semibold text-orange-700 shadow-sm">
                True
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-sm font-semibold text-teal-700 shadow-sm">
                False
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" className="justify-center" />
      ),
      accessorKey: "status",
      size: 110,
      cell: ({ row }) => {
        if ((isEditing || editingRowId === row.original.id) && onCellChange) {
          return (
            <div className="flex w-full justify-center">
              <Select
                value={row.original.status || "inactive"}
                onValueChange={(val) => onCellChange(row.original.id, "status", val)}
              >
                <SelectTrigger className="h-9 border-gray-200 bg-white! text-sm font-semibold text-(--theme-burgundy-950) shadow-xs focus:ring-1 focus:ring-(--theme-burgundy)">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white!">
                  <SelectItem
                    value="active"
                    className="cursor-pointer text-sm font-semibold text-(--theme-burgundy-950)"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    value="inactive"
                    className="cursor-pointer text-sm font-semibold text-(--theme-burgundy-950)"
                  >
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        }

        const status = row.original.status || "inactive";
        const isActive = status.toLowerCase() === "active";

        return (
          <div className="flex w-full justify-center">
            {isActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                Inactive
              </span>
            )}
          </div>
        );
      },
    },
  ];

  if (!isEditing) {
    columnsList.push({
      id: "row_actions",
      header: () => (
        <div className="flex h-[38px] w-full items-center justify-center text-sm font-semibold text-white select-none">
          Actions
        </div>
      ),
      size: 110,
      cell: ({ row }) => (
        <RowActionsCell
          row={row}
          isEditing={isEditing}
          editingRowId={editingRowId}
          savingRowId={savingRowId}
          stockItems={stockItems}
          errorsRef={errorsRef}
          onStartRowEdit={onStartRowEdit}
          onSaveRowEdit={onSaveRowEdit}
          onCancelRowEdit={onCancelRowEdit}
        />
      ),
    });
  }

  return columnsList;
}
