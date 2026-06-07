"use client";

import React from "react";
import Image from "next/image";
import { Image as ImageIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/dropzone";

export interface FormImage {
  id?: number;
  file?: File;
  previewUrl: string;
  is_primary: boolean;
}

interface ImageUploadSectionProps {
  images: FormImage[];
  onChange: (images: FormImage[]) => void;
  disabled?: boolean;
  showToast: (message: string, type: "success" | "error") => void;
  hasError?: boolean;
  errorMessage?: string;
  hidePreview?: boolean;
}

export function ImagePreviewGrid({
  images,
  onChange,
  disabled = false,
}: Omit<ImageUploadSectionProps, "showToast">) {
  if (images.length === 0) return null;

  return (
    <div className="grid w-full grid-cols-1 gap-4">
      {images.map((img, index) => (
        <div
          key={img.id || index}
          onClick={(e) => e.stopPropagation()} // Stop bubbling
          className={`relative flex w-full flex-col overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-200 hover:shadow-md ${
            img.is_primary
              ? "border-(--theme-taupe-500) ring-1 ring-(--theme-taupe-500)"
              : "border-(--theme-coffee-100)"
          }`}
        >
          {/* Image Container (Full Width aspect-video or set height) */}
          <div className="relative h-48 w-full overflow-hidden border-b border-(--theme-coffee-100) bg-(--theme-coffee-50)/30">
            <Image
              src={img.previewUrl}
              alt={`Product Preview ${index + 1}`}
              unoptimized
              fill
              className="h-full w-full object-cover object-center"
            />

            {/* Delete File Button (Floating Dark Circle) */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              className="absolute top-3 right-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/40 p-0 text-white transition-all hover:bg-black/65 hover:text-red-100"
              onClick={() => {
                const updated = images.filter((_, i) => i !== index);

                if (img.file) {
                  URL.revokeObjectURL(img.previewUrl);
                }

                if (img.is_primary && updated.length > 0) {
                  updated[0].is_primary = true;
                }

                onChange(updated);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Details & Controls below the image */}
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold tracking-wider text-(--theme-coffee-400) uppercase">
                Image #{index + 1}
              </span>
              <span className="max-w-[200px] truncate text-xs font-semibold text-(--theme-coffee-600)">
                {img.file ? img.file.name : `image-${index + 1}.jpg`}
              </span>
            </div>

            <div className="h-px w-full bg-(--theme-burgundy-100)/50" />

            {/* Set as Primary Switch */}
            <div className="flex items-center justify-between pt-1">
              <Label
                htmlFor={`primary-switch-${index}`}
                className="cursor-pointer text-xs font-semibold text-(--theme-burgundy-950) select-none"
              >
                Primary Image
              </Label>
              <Switch
                id={`primary-switch-${index}`}
                checked={img.is_primary}
                disabled={disabled}
                onCheckedChange={() => {
                  const updated = images.map((item, i) => ({
                    ...item,
                    is_primary: i === index,
                  }));
                  onChange(updated);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ImageUploadSection({
  images,
  onChange,
  disabled = false,
  showToast,
  hasError = false,
  errorMessage,
  hidePreview = false,
}: ImageUploadSectionProps) {
  const isLimitReached = images.length >= 10;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1 text-xs font-semibold text-(--theme-burgundy-950)">
        Upload Images <span className="text-red-500">*</span>
      </Label>

      {isLimitReached ? (
        <div className="flex flex-col items-center justify-center space-y-2.5 rounded-xl border-2 border-dotted border-(--theme-taupe-300) bg-(--theme-coffee-50)/10 p-3 text-center transition-all duration-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--theme-coffee-100) text-(--theme-coffee-700)">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-(--theme-burgundy-950)">
              Maximum upload limit reached (10/10)
            </p>
            <p className="mx-auto max-w-sm text-[11px] leading-relaxed text-(--theme-coffee-500)">
              You have uploaded the maximum allowance of 10 images. <br />
              Please remove one or more of your existing images to upload alternatives.
            </p>
          </div>
        </div>
      ) : (
        <Dropzone
          accept={{ "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] }}
          maxSize={5 * 1024 * 1024} // 5MB
          maxFiles={10}
          disabled={disabled}
          onDrop={(acceptedFiles) => {
            if (images.length + acceptedFiles.length > 10) {
              showToast("You can upload at most 10 images.", "error");
              return;
            }

            const newImages = acceptedFiles.map((file) => ({
              file,
              previewUrl: URL.createObjectURL(file),
              is_primary: false,
            }));

            const updatedImages = [...images, ...newImages];
            // Automatically set first image as primary if none is selected
            const hasPrimary = updatedImages.some((img) => img.is_primary);
            if (!hasPrimary && updatedImages.length > 0) {
              updatedImages[0].is_primary = true;
            }

            onChange(updatedImages);
          }}
          onError={(err) => {
            showToast(err.message, "error");
          }}
        >
          <DropzoneEmptyState>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--theme-coffee-50) text-(--theme-coffee-600)">
                <ImageIcon className="h-5 w-5 opacity-80" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-(--theme-burgundy-700)">
                  Click to upload or drag & drop images
                </p>
                <p className="text-[11px] text-(--theme-coffee-400)">
                  JPG, JPEG, or PNG up to 5MB (Max 10 images)
                </p>
              </div>
            </div>
          </DropzoneEmptyState>
          <DropzoneContent className="hidden" />
        </Dropzone>
      )}

      {/* Grid of uploaded images with Set as primary switches */}
      {!hidePreview && (
        <div className="mt-3">
          <ImagePreviewGrid images={images} onChange={onChange} disabled={disabled} />
        </div>
      )}

      {hasError && errorMessage && (
        <p className="text-xs font-medium text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
