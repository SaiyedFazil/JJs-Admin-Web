"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dropzone, DropzoneEmptyState, DropzoneContent } from "@/components/ui/dropzone";
import { Monitor, Smartphone } from "lucide-react";

interface BannerDropzonesProps {
  bannerValue: File | null;
  setBannerValue: (file: File | null) => void;
  bannerError?: string;
  bannerTouched?: boolean;
  mobileBannerValue: File | null;
  setMobileBannerValue: (file: File | null) => void;
  mobileBannerError?: string;
  mobileBannerTouched?: boolean;
  desktopPreview: string | null;
  setDesktopPreview: (val: string | null) => void;
  mobilePreview: string | null;
  setMobilePreview: (val: string | null) => void;
  isSubmitting: boolean;
  hasDesktopImage: boolean;
  hasMobileImage: boolean;
  setFieldError: (field: string, message: string | undefined) => void;
  setFieldTouched: (field: string, isTouched: boolean, shouldValidate?: boolean) => void;
}

export function BannerDropzones({
  bannerValue,
  setBannerValue,
  bannerError,
  bannerTouched,
  mobileBannerValue,
  setMobileBannerValue,
  mobileBannerError,
  mobileBannerTouched,
  desktopPreview,
  setDesktopPreview,
  mobilePreview,
  setMobilePreview,
  isSubmitting,
  hasDesktopImage,
  hasMobileImage,
  setFieldError,
  setFieldTouched,
}: BannerDropzonesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Desktop Banner Zone */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-(--theme-burgundy-950)">
          Desktop Banner (16:8) <span className="text-red-500">*</span>
        </Label>
        <Dropzone
          accept={{ "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] }}
          maxSize={5 * 1024 * 1024}
          multiple={false}
          src={[]}
          disabled={isSubmitting}
          onDrop={(acceptedFiles) => {
            if (acceptedFiles.length > 0) {
              const file = acceptedFiles[0];
              setBannerValue(file);
              // Pass false so Formik doesn't validate before setFieldValue resolves
              setFieldTouched("banner", true, false);
              setFieldError("banner", undefined);
              if (desktopPreview) {
                URL.revokeObjectURL(desktopPreview);
              }
              setDesktopPreview(URL.createObjectURL(file));
            }
          }}
          onRemove={() => {
            setBannerValue(null);
            setFieldTouched("banner", true, false);
            if (desktopPreview) {
              URL.revokeObjectURL(desktopPreview);
              setDesktopPreview(null);
            }
          }}
          onError={(err) => {
            setFieldError("banner", err.message);
            setFieldTouched("banner", true, false);
          }}
        >
          <DropzoneEmptyState>
            {hasDesktopImage ? (
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-xs">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-(--theme-burgundy-950)">
                    Desktop Banner Added
                  </p>
                  <p className="max-w-[180px] truncate text-[10px] text-(--theme-coffee-400)">
                    {bannerValue ? bannerValue.name : "Current saved asset"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 h-7 cursor-pointer rounded-lg border-(--theme-burgundy-200) px-2.5 text-[10px] font-semibold text-(--theme-burgundy-700) hover:bg-(--theme-burgundy-50)"
                >
                  Replace File
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 p-2 text-center">
                <Monitor className="h-6 w-6 text-(--theme-coffee-400)" />
                <div>
                  <p className="text-xs font-semibold text-(--theme-burgundy-700)">
                    Desktop Banner
                  </p>
                  <p className="text-[10px] text-(--theme-coffee-400)">
                    Drag & drop or Click to upload (max 5MB)
                  </p>
                </div>
              </div>
            )}
          </DropzoneEmptyState>
          <DropzoneContent className="hidden" />
        </Dropzone>
        {bannerTouched && bannerError && (
          <p className="text-xs font-medium text-red-500">{bannerError}</p>
        )}
      </div>

      {/* Mobile Banner Zone */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-(--theme-burgundy-950)">
          Mobile Banner (9:16) <span className="text-red-500">*</span>
        </Label>
        <Dropzone
          accept={{ "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] }}
          maxSize={5 * 1024 * 1024}
          multiple={false}
          src={[]}
          disabled={isSubmitting}
          onDrop={(acceptedFiles) => {
            if (acceptedFiles.length > 0) {
              const file = acceptedFiles[0];
              setMobileBannerValue(file);
              // Pass false so Formik doesn't validate before setFieldValue resolves
              setFieldTouched("mobile_banner", true, false);
              setFieldError("mobile_banner", undefined);
              if (mobilePreview) {
                URL.revokeObjectURL(mobilePreview);
              }
              setMobilePreview(URL.createObjectURL(file));
            }
          }}
          onRemove={() => {
            setMobileBannerValue(null);
            setFieldTouched("mobile_banner", true, false);
            if (mobilePreview) {
              URL.revokeObjectURL(mobilePreview);
              setMobilePreview(null);
            }
          }}
          onError={(err) => {
            setFieldError("mobile_banner", err.message);
            setFieldTouched("mobile_banner", true, false);
          }}
        >
          <DropzoneEmptyState>
            {hasMobileImage ? (
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-xs">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-(--theme-burgundy-950)">
                    Mobile Banner Added
                  </p>
                  <p className="max-w-[180px] truncate text-[10px] text-(--theme-coffee-400)">
                    {mobileBannerValue ? mobileBannerValue.name : "Current saved asset"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 h-7 cursor-pointer rounded-lg border-(--theme-burgundy-200) px-2.5 text-[10px] font-semibold text-(--theme-burgundy-700) hover:bg-(--theme-burgundy-50)"
                >
                  Replace File
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 p-2 text-center">
                <Smartphone className="h-6 w-6 text-(--theme-coffee-400)" />
                <div>
                  <p className="text-xs font-semibold text-(--theme-burgundy-700)">Mobile Banner</p>
                  <p className="text-[10px] text-(--theme-coffee-400)">
                    Drag & drop or Click to upload (max 5MB)
                  </p>
                </div>
              </div>
            )}
          </DropzoneEmptyState>
          <DropzoneContent className="hidden" />
        </Dropzone>
        {mobileBannerTouched && mobileBannerError && (
          <p className="text-xs font-medium text-red-500">{mobileBannerError}</p>
        )}
      </div>
    </div>
  );
}
