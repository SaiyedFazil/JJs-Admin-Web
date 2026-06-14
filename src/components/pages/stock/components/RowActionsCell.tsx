"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Pencil } from "lucide-react";
import type { ItemStock } from "@/types";
import type { FormikErrors } from "formik";

interface RowActionsCellProps {
  row: {
    index: number;
    original: ItemStock;
  };
  isEditing?: boolean;
  editingRowId?: number | null;
  savingRowId?: number | null;
  stockItems?: ItemStock[];
  errorsRef?: React.MutableRefObject<string | string[] | FormikErrors<ItemStock>[] | undefined>;
  onStartRowEdit?: (rowId: number) => void;
  onSaveRowEdit?: (rowId: number) => void;
  onCancelRowEdit?: (rowId: number) => void;
}

export function RowActionsCell({
  row,
  isEditing,
  editingRowId,
  savingRowId,
  stockItems,
  errorsRef,
  onStartRowEdit,
  onSaveRowEdit,
  onCancelRowEdit,
}: RowActionsCellProps) {
  const isRowEditing = editingRowId === row.original.id;
  const isSaving = savingRowId === row.original.id;
  const isAnyEditing = isEditing || (editingRowId !== null && editingRowId !== row.original.id);

  if (isRowEditing) {
    const rowIndex = row.index;
    const rowErrorObj =
      errorsRef?.current && Array.isArray(errorsRef.current)
        ? errorsRef.current[rowIndex]
        : undefined;
    const hasRowErrors =
      rowErrorObj && typeof rowErrorObj === "object" && Object.keys(rowErrorObj).length > 0;

    const original = stockItems?.find((orig) => orig.id === row.original.id);
    const hasRowChanged = original
      ? row.original.total_stock !== original.total_stock ||
        row.original.available_stock !== original.available_stock ||
        row.original.status !== original.status ||
        row.original.is_not_returnable !== original.is_not_returnable ||
        row.original.min_order_qty !== original.min_order_qty ||
        row.original.max_order_qty !== original.max_order_qty ||
        row.original.lead_time !== original.lead_time
      : false;

    const isSaveDisabled = !hasRowChanged || hasRowErrors || isSaving;

    return (
      <div className="flex w-full items-center justify-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isSaveDisabled}
          onClick={() => onSaveRowEdit?.(row.original.id)}
          className="h-8 w-8 cursor-pointer text-emerald-600 hover:bg-emerald-50! hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          title="Save"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isSaving}
          onClick={() => onCancelRowEdit?.(row.original.id)}
          className="h-8 w-8 cursor-pointer text-red-600 hover:bg-red-50! hover:text-red-700 disabled:opacity-40"
          title="Cancel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isAnyEditing}
        onClick={() => onStartRowEdit?.(row.original.id)}
        className="h-8 w-8 cursor-pointer text-gray-500 hover:bg-gray-50! hover:text-(--theme-burgundy-700) disabled:cursor-not-allowed disabled:opacity-40"
        title="Edit Row"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
