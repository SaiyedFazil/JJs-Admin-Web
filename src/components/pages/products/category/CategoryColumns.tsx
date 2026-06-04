"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderTree, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/custom/data-table/DataTableColumnHeader";
import type { Category } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

// Custom CategoryImage component with robust error fallback handling
function CategoryImage({ src, name }: { src?: string; name: string }) {
  const [hasError, setHasError] = useState(false);

  // Check if image is a valid URL or just a placeholder string
  const isValidUrl =
    src &&
    src.trim() !== "" &&
    (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/"));

  if (!isValidUrl || hasError) {
    const initials = name
      ? name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "CAT";

    return (
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-(--theme-taupe-200) bg-(--theme-taupe-100) text-(--theme-burgundy-900) shadow-inner">
        <FolderTree className="absolute h-10 w-10 opacity-10" />
        <span className="relative z-10 text-xl font-bold tracking-wider">{initials}</span>
      </div>
    );
  }

  return (
    <div className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-(--theme-burgundy-100) shadow-sm transition-transform duration-300 hover:scale-105">
      <Image
        src={src}
        alt={name}
        width={80}
        height={80}
        unoptimized
        className="h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-110"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

/**
 * Generates columns definition for the Category table
 *
 * @param onEdit - Callback trigger when Edit button is clicked
 * @param onDelete - Callback trigger when Delete button is clicked
 */
export function getColumns(
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => void
): ColumnDef<Category>[] {
  return [
    {
      id: "image",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" className="justify-start" />
      ),
      accessorKey: "image",
      enableSorting: false,
      cell: ({ row }) => {
        const category = row.original;
        return <CategoryImage src={category.image} name={category.name} />;
      },
    },
    {
      id: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" className="justify-start" />
      ),
      accessorKey: "id",
      cell: ({ row }) => {
        return (
          <span className="rounded-lg border border-(--theme-taupe-200)/60 bg-(--theme-taupe-100) px-2.5 py-1.5 font-mono text-xs font-semibold text-(--theme-coffee-600) shadow-xs">
            #{row.original.id}
          </span>
        );
      },
    },
    {
      id: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category Name" className="justify-start" />
      ),
      accessorKey: "name",
      cell: ({ row }) => {
        return (
          <span className="text-base font-bold tracking-tight text-(--theme-burgundy-950) transition-colors duration-200 hover:text-(--theme-burgundy-600)">
            {row.original.name}
          </span>
        );
      },
    },
    {
      id: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created Date" className="justify-start" />
      ),
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const dateStr = row.original.createdAt;
        if (!dateStr) return <span className="text-muted-foreground text-xs">-</span>;
        const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return (
          <span className="text-sm font-medium text-(--theme-coffee-500)">{formattedDate}</span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="w-full text-center font-semibold text-white!">Actions</div>,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 cursor-pointer rounded-lg border-(--theme-burgundy-100) transition-colors hover:border-(--theme-taupe-300) hover:bg-(--theme-taupe-50)/50 hover:text-(--theme-taupe-700)"
              onClick={() => onEdit(category)}
              title="Edit Category"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 cursor-pointer rounded-lg border-red-100 text-red-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => onDelete(category)}
              title="Delete Category"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
