"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChefHat, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/custom/data-table/DataTableColumnHeader";
import type { Product } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

// Custom ProductImage component with robust error fallback handling
function ProductImage({ images, name }: { images: Product["images"]; name: string }) {
  const [hasError, setHasError] = useState(false);

  // Find primary image, or fallback to the first image in list
  const primaryImageObj = images?.find((img) => img.is_primary) || images?.[0];
  const src = primaryImageObj?.image;

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
      : "PR";

    return (
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-(--theme-taupe-200) bg-(--theme-taupe-100) text-(--theme-burgundy-900) shadow-inner">
        <ChefHat className="absolute h-10 w-10 opacity-10" />
        <span className="relative z-10 text-xl font-bold tracking-wider">{initials}</span>
      </div>
    );
  }

  return (
    <div className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-(--theme-burgundy-100) shadow-sm">
      <Image
        src={src}
        alt={name}
        width={80}
        height={80}
        unoptimized
        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

// Helper to format prices in INR format
function formatPrice(amount: string | number) {
  const parsed = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(parsed)) return "₹0.00";
  return `₹${parsed.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Generates columns definition for the Product table
 *
 * @param onEdit - Callback trigger when Edit button is clicked
 * @param onDelete - Callback trigger when Delete button is clicked
 */
export function getColumns(
  onEdit?: (product: Product) => void,
  onDelete?: (product: Product) => void
): ColumnDef<Product>[] {
  return [
    {
      id: "image",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" className="justify-start" />
      ),
      accessorKey: "images",
      enableSorting: false,
      size: 110,
      cell: ({ row }) => {
        const product = row.original;
        return <ProductImage images={product.images} name={product.name} />;
      },
    },
    {
      id: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Name" className="justify-start" />
      ),
      accessorKey: "name",
      size: 150,
      cell: ({ row }) => {
        return (
          <span className="text-sm font-bold tracking-tight text-(--theme-burgundy-950) transition-colors duration-200 hover:text-(--theme-burgundy-600)">
            {row.original.name}
          </span>
        );
      },
    },
    {
      id: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" className="justify-start" />
      ),
      accessorKey: "category.name",
      size: 200,
      cell: ({ row }) => {
        const category = row.original.category;
        return category ? (
          <span className="inline-flex items-center rounded-md bg-(--theme-taupe-50) px-2 py-1 text-xs font-medium text-(--theme-taupe-800) ring-1 ring-(--theme-taupe-200)/50">
            {category.name}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        );
      },
    },
    {
      id: "mrp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="MRP" className="justify-start" />
      ),
      accessorKey: "mrp",
      size: 110,
      cell: ({ row }) => {
        return (
          <span className="text-muted-foreground text-xs font-medium line-through">
            {formatPrice(row.original.mrp)}
          </span>
        );
      },
    },
    {
      id: "selling_price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Selling Price" className="justify-start" />
      ),
      accessorKey: "selling_price",
      size: 120,
      cell: ({ row }) => {
        return (
          <span className="text-sm font-semibold text-(--theme-burgundy-900)">
            {formatPrice(row.original.selling_price)}
          </span>
        );
      },
    },
    {
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" className="justify-start" />
      ),
      accessorKey: "status",
      size: 110,
      cell: ({ row }) => {
        const status = row.original.status || "inactive";
        const isActive = status.toLowerCase() === "active";

        return isActive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="w-full text-center font-semibold text-white!">Actions</div>,
      size: 140,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 cursor-pointer rounded-lg border-(--theme-burgundy-100) transition-colors hover:border-(--theme-taupe-300) hover:bg-(--theme-taupe-50)/50 hover:text-(--theme-taupe-700)"
              onClick={() => onEdit?.(product)}
              title="Edit Product"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 cursor-pointer rounded-lg border-red-100 text-red-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => onDelete?.(product)}
              title="Delete Product"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
