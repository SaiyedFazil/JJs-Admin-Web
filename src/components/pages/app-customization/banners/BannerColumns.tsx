"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImagePlay, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/custom/data-table/DataTableColumnHeader";
import type { Banner } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

// Custom image component with aspect-ratio formatting and fallback
function BannerImagePreview({
  src,
  alt,
  isMobile = false,
}: {
  src?: string;
  alt: string;
  isMobile?: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  const isValidUrl =
    src &&
    src.trim() !== "" &&
    (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/"));

  if (!isValidUrl || hasError) {
    return (
      <div
        className={`relative flex items-center justify-center rounded-xl border border-(--theme-taupe-200) bg-(--theme-taupe-100) text-(--theme-burgundy-900) shadow-inner ${
          isMobile ? "h-24 w-14" : "h-24 w-48"
        }`}
      >
        <ImagePlay className="absolute h-6 w-6 opacity-15" />
        <span className="relative z-10 text-[9px] font-bold text-(--theme-coffee-400)">
          {isMobile ? "MOB" : "DSK"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-(--theme-burgundy-100) shadow-sm ${
        isMobile ? "h-32 w-26" : "h-32 w-64"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        width={isMobile ? 72 : 224}
        height={112}
        unoptimized
        className="h-full w-full object-cover object-center transition-transform duration-300"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

/**
 * Generates columns definition for the Banners table
 */
export function getColumns(
  onInfo: (banner: Banner) => void,
  onEdit: (banner: Banner) => void,
  onDelete: (banner: Banner) => void
): ColumnDef<Banner>[] {
  return [
    {
      id: "banner",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Desktop Banner" className="justify-start" />
      ),
      accessorKey: "banner",
      enableSorting: false,
      size: 220,
      cell: ({ row }) => {
        const banner = row.original;
        return <BannerImagePreview src={banner.banner} alt={banner.title} />;
      },
    },
    {
      id: "mobile_banner",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mobile Banner" className="justify-start" />
      ),
      accessorKey: "mobile_banner",
      enableSorting: false,
      size: 140,
      cell: ({ row }) => {
        const banner = row.original;
        return <BannerImagePreview src={banner.mobile_banner} alt={banner.title} isMobile />;
      },
    },
    // {
    //   id: "id",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="ID" className="justify-start" />
    //   ),
    //   accessorKey: "id",
    //   size: 100,
    //   cell: ({ row }) => {
    //     return (
    //       <span className="rounded-lg border border-(--theme-taupe-200)/60 bg-(--theme-taupe-100) px-2 py-1.5 font-mono text-xs font-semibold text-(--theme-coffee-600) shadow-xs">
    //         {row.original.id}
    //       </span>
    //     );
    //   },
    // },
    {
      id: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" className="justify-start" />
      ),
      accessorKey: "title",
      cell: ({ row }) => {
        return (
          <span className="text-base font-bold tracking-tight text-(--theme-burgundy-950) transition-colors duration-200 hover:text-(--theme-burgundy-600)">
            {row.original.title}
          </span>
        );
      },
    },
    {
      id: "is_active",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" className="justify-start" />
      ),
      accessorKey: "is_active",
      size: 120,
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-xs ${
              isActive
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "animate-pulse bg-green-600" : "bg-amber-600"
              }`}
            />
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="w-full text-center font-semibold text-white!">Actions</div>,
      size: 200,
      cell: ({ row }) => {
        const banner = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 cursor-pointer rounded-lg border-(--theme-burgundy-100) transition-colors hover:border-(--theme-taupe-300) hover:bg-(--theme-taupe-50)/50 hover:text-(--theme-taupe-700)"
              onClick={() => onInfo(banner)}
              title="View Banner Details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 cursor-pointer rounded-lg border-(--theme-burgundy-100) transition-colors hover:border-(--theme-taupe-300) hover:bg-(--theme-taupe-50)/50 hover:text-(--theme-taupe-700)"
              onClick={() => onEdit(banner)}
              title="Edit Banner"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="h-8 w-8 cursor-pointer rounded-lg border-red-100 text-red-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => onDelete(banner)}
              title="Delete Banner"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
