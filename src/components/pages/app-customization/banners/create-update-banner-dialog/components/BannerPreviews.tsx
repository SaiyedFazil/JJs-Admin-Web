"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Banner } from "@/types";

interface BannerPreviewsProps {
  hasImages: boolean;
  hasDesktopImage: boolean;
  desktopPreview: string | null;
  setDesktopPreview: (val: string | null) => void;
  banner: Banner | null;
  bannerValue: File | null;
  setBannerValue: (file: File | null) => void;
  hasMobileImage: boolean;
  mobilePreview: string | null;
  setMobilePreview: (val: string | null) => void;
  mobileBannerValue: File | null;
  setMobileBannerValue: (file: File | null) => void;
  isSubmitting: boolean;
  setFieldTouched: (field: string, isTouched: boolean, shouldValidate?: boolean) => void;
}

export function BannerPreviews({
  hasImages,
  hasDesktopImage,
  desktopPreview,
  setDesktopPreview,
  banner,
  bannerValue,
  setBannerValue,
  hasMobileImage,
  mobilePreview,
  setMobilePreview,
  mobileBannerValue,
  setMobileBannerValue,
  isSubmitting,
  setFieldTouched,
}: BannerPreviewsProps) {
  if (!hasImages) return null;

  return (
    <div className="flex flex-col border-t border-(--theme-burgundy-100)/50 bg-(--theme-coffee-50)/10 lg:col-span-5 lg:h-full lg:min-h-0 lg:border-t-0 lg:border-l">
      <div className="flex shrink-0 items-center justify-between border-b border-(--theme-burgundy-100)/50 bg-white px-6 pt-4 pb-4">
        <h3 className="text-xs font-bold tracking-wider text-(--theme-burgundy-950) uppercase">
          Banner Previews
        </h3>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto px-6 pt-6 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {/* Desktop Preview Card */}
        {hasDesktopImage && (
          <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-(--theme-coffee-100) bg-white shadow-xs transition-all duration-200 hover:shadow-md">
            <div className="relative h-48 w-full overflow-hidden border-b border-(--theme-coffee-100) bg-(--theme-coffee-50)/30">
              <Image
                src={desktopPreview || banner?.banner || ""}
                alt="Desktop Banner Preview"
                unoptimized
                fill
                className="h-full w-full object-cover object-center"
              />
              {/* Remove button if new file is selected */}
              {bannerValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                  className="absolute top-3 right-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/40 p-0 text-white transition-all hover:bg-black/65 hover:text-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBannerValue(null);
                    setFieldTouched("banner", true, false);
                    if (desktopPreview) {
                      URL.revokeObjectURL(desktopPreview);
                      setDesktopPreview(null);
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-1 bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold tracking-wider text-(--theme-coffee-400) uppercase">
                  Desktop (16:8)
                </span>
                <span className="max-w-[150px] truncate text-xs font-semibold text-(--theme-coffee-600)">
                  {bannerValue ? bannerValue.name : "Saved Database Asset"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Preview Card */}
        {hasMobileImage && (
          <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-(--theme-coffee-100) bg-white shadow-xs transition-all duration-200 hover:shadow-md">
            {/* Grey background container with centered mobile mockup */}
            <div className="relative flex h-64 w-full items-center justify-center border-b border-(--theme-coffee-100) bg-(--theme-coffee-50)/40 p-4">
              {/* Centered Mobile Frame (9:16 aspect ratio: e.g. w-32 h-56) */}
              <div className="relative h-56 w-[152px] overflow-hidden rounded-xl border border-(--theme-coffee-200) bg-white shadow-md">
                <Image
                  src={mobilePreview || banner?.mobile_banner || ""}
                  alt="Mobile Banner Preview"
                  unoptimized
                  fill
                  className="h-full w-full object-cover object-center"
                />
              </div>
              {/* Remove button if new file is selected */}
              {mobileBannerValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                  className="absolute top-3 right-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/40 p-0 text-white transition-all hover:bg-black/65 hover:text-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileBannerValue(null);
                    setFieldTouched("mobile_banner", true, false);
                    if (mobilePreview) {
                      URL.revokeObjectURL(mobilePreview);
                      setMobilePreview(null);
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-1 bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold tracking-wider text-(--theme-coffee-400) uppercase">
                  Mobile (9:16)
                </span>
                <span className="max-w-[150px] truncate text-xs font-semibold text-(--theme-coffee-600)">
                  {mobileBannerValue ? mobileBannerValue.name : "Saved Database Asset"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
