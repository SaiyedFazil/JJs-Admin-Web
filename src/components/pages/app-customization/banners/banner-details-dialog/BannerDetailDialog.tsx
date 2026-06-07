"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, ImagePlay, Monitor, Smartphone, ExternalLink, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogClose,
} from "@/components/ui/dialog";
import type { Banner } from "@/types";

interface BannerDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  banner: Banner | null;
}

export function BannerDetailDialog({ isOpen, onClose, banner }: BannerDetailDialogProps) {
  const [desktopImageError, setDesktopImageError] = useState(false);
  const [mobileImageError, setMobileImageError] = useState(false);

  if (!banner) return null;

  // Formatting dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  // Check if color has '#' prefix, if not add it
  const formatHexColor = (colorStr: string) => {
    const trimmed = colorStr.trim();
    if (trimmed.startsWith("#")) return trimmed;
    if (/^[0-9A-F]{6}$/i.test(trimmed) || /^[0-9A-F]{3}$/i.test(trimmed)) {
      return `#${trimmed}`;
    }
    return trimmed; // fallback
  };

  const formattedTextColor = formatHexColor(banner.text_color);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="mx-auto flex max-h-[90vh] max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[24px] border border-(--theme-burgundy-100) p-0 shadow-2xl md:max-w-4xl md:rounded-[32px]"
        showCloseButton={false}
      >
        {/* Header - Static */}
        <DialogHeader className="relative shrink-0 border-b border-(--theme-burgundy-100)/40 bg-white px-6 py-5 md:px-8">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-(--theme-taupe-100) text-(--theme-taupe-700)">
              <Sparkles className="h-4 w-4" />
            </div>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-(--theme-burgundy-950)">
              <span>Banner Detail</span>
              <span className="font-mono font-semibold text-(--theme-taupe-600)">#{banner.id}</span>
            </DialogTitle>
          </div>
          <DialogDescription className="mt-1 text-sm text-(--theme-coffee-500)">
            Detailed configuration, run settings, and promotional assets for this banner.
          </DialogDescription>
          {/* Professional Close Button */}
          <DialogClose className="absolute top-5 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-xs transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:ring-2 focus:ring-gray-200 focus:outline-none md:right-5">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        {/* Body */}
        <DialogBody className="flex-1 overflow-y-auto px-6 py-2 pb-4 md:px-8">
          <div className="flex flex-col gap-6">
            {/* Title & Status Inline */}
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-bold tracking-wider text-(--theme-coffee-400) uppercase">
                Title
              </span>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-bold tracking-tight text-(--theme-burgundy-950)">
                  {banner.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold shadow-xs ${
                    banner.is_active
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "border border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      banner.is_active ? "animate-pulse bg-green-600" : "bg-amber-600"
                    }`}
                  />
                  {banner.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-bold tracking-wider text-(--theme-coffee-400) uppercase">
                Description
              </span>
              <p className="mt-1.5 text-sm leading-relaxed font-medium text-(--theme-coffee-600)">
                {banner.description || "No description provided for this banner."}
              </p>
            </div>

            {/* Asset Previews Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              {/* Desktop Preview Card (Left Side) */}
              <div className="flex flex-col gap-2 md:col-span-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-(--theme-burgundy-900) uppercase">
                    <Monitor className="h-4 w-4 text-(--theme-taupe-600)" />
                    <span>Desktop App Banner (16:8)</span>
                  </div>
                  {banner.banner && (
                    <a
                      href={banner.banner}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 inline-flex items-center gap-1 text-xs font-semibold text-(--theme-taupe-600) transition-colors hover:text-(--theme-burgundy-700) hover:underline"
                    >
                      <span>View</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {desktopImageError || !banner.banner ? (
                  <div className="flex h-[260px] w-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-400">
                    <ImagePlay className="mr-2 h-5 w-5 opacity-40" />
                    <span className="text-xs">No desktop banner asset loaded</span>
                  </div>
                ) : (
                  <div className="relative h-[260px] w-full overflow-hidden rounded-2xl border border-gray-100 shadow-inner">
                    <Image
                      src={banner.banner}
                      alt="Desktop Banner Preview"
                      fill
                      unoptimized
                      className="object-cover"
                      onError={() => setDesktopImageError(true)}
                    />
                  </div>
                )}
              </div>

              {/* Mobile Preview Card (Right Side) */}
              <div className="flex flex-col gap-2 md:col-span-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-(--theme-burgundy-900) uppercase">
                    <Smartphone className="h-4 w-4 text-(--theme-taupe-600)" />
                    <span>Mobile App Banner (9:16)</span>
                  </div>
                  {banner.mobile_banner && (
                    <a
                      href={banner.mobile_banner}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 inline-flex items-center gap-1 text-xs font-semibold text-(--theme-taupe-600) transition-colors hover:text-(--theme-burgundy-700) hover:underline"
                    >
                      <span>View</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {mobileImageError || !banner.mobile_banner ? (
                  <div className="flex h-[260px] w-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-400">
                    <ImagePlay className="mr-2 h-5 w-5 opacity-40" />
                    <span className="text-xs">No mobile banner asset loaded</span>
                  </div>
                ) : (
                  <div className="relative flex h-[260px] w-full items-center justify-center overflow-hidden">
                    <div className="relative aspect-9/16 h-full overflow-hidden rounded-2xl">
                      <Image
                        src={banner.mobile_banner}
                        alt="Mobile Banner Preview"
                        fill
                        unoptimized
                        className="object-cover"
                        onError={() => setMobileImageError(true)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Other Details Row (Below images) */}
            <div className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-4 sm:grid-cols-3">
              {/* Text Color Swatch */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wider text-(--theme-coffee-400) uppercase">
                  Text Color
                </span>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-(--theme-coffee-700)">
                    {formattedTextColor}
                  </span>
                  <div
                    className="h-4 w-4 shrink-0 rounded-full border border-gray-200 shadow-inner"
                    style={{ backgroundColor: formattedTextColor }}
                    title={`Hex Color Code: ${formattedTextColor}`}
                  />
                </div>
              </div>

              {/* Created Date */}
              <div className="flex flex-col gap-1 border-gray-100 pl-0 sm:border-l sm:pl-6">
                <span className="text-xs font-semibold tracking-wider text-(--theme-coffee-400) uppercase">
                  Created At
                </span>
                <span
                  className="mt-0.5 truncate text-xs font-semibold text-(--theme-coffee-700)"
                  title={formatDate(banner.createdAt)}
                >
                  {formatDate(banner.createdAt)}
                </span>
              </div>

              {/* Last Updated Date */}
              <div className="flex flex-col gap-1 border-gray-100 pl-0 sm:border-l sm:pl-6">
                <span className="text-xs font-semibold tracking-wider text-(--theme-coffee-400) uppercase">
                  Updated At
                </span>
                <span
                  className="mt-0.5 truncate text-xs font-semibold text-(--theme-coffee-700)"
                  title={formatDate(banner.updatedAt)}
                >
                  {formatDate(banner.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
