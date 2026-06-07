"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bannerSchema } from "@/lib/validation";
import { createBanner, updateBanner } from "@/lib/api/admin/banner-api";
import type { Banner } from "@/types";
import { BannerDropzones } from "./components/BannerDropzones";
import { BannerColorAndStatus } from "./components/BannerColorAndStatus";
import { BannerPreviews } from "./components/BannerPreviews";

interface CreateUpdateBannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  banner: Banner | null;
  onSuccess: () => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export function CreateUpdateBannerDialog({
  isOpen,
  onClose,
  banner,
  onSuccess,
  showToast,
}: CreateUpdateBannerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!banner;

  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      title: banner ? banner.title : "",
      description: banner ? banner.description : "",
      banner: null as File | null,
      mobile_banner: null as File | null,
      text_color: banner ? banner.text_color : "#FFFFFF",
      is_active: banner ? banner.is_active : true,
    },
    validationSchema: bannerSchema(isEditMode),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (isEditMode && banner) {
          // Prepare PATCH payload with only changed values
          const payload: {
            title?: string;
            description?: string;
            banner?: File;
            mobileBanner?: File;
            textColor?: string;
            isActive?: boolean;
          } = {};
          let hasChanges = false;

          if (values.title.trim() !== banner.title) {
            payload.title = values.title.trim();
            hasChanges = true;
          }
          if (values.description.trim() !== banner.description) {
            payload.description = values.description.trim();
            hasChanges = true;
          }
          if (values.banner !== null) {
            payload.banner = values.banner;
            hasChanges = true;
          }
          if (values.mobile_banner !== null) {
            payload.mobileBanner = values.mobile_banner;
            hasChanges = true;
          }
          if (values.text_color.trim() !== banner.text_color) {
            payload.textColor = values.text_color.trim();
            hasChanges = true;
          }
          if (values.is_active !== banner.is_active) {
            payload.isActive = values.is_active;
            hasChanges = true;
          }

          if (!hasChanges) {
            showToast("No changes detected.", "error");
            setIsSubmitting(false);
            return;
          }

          const response = await updateBanner(banner.id, payload);
          const isSuccess =
            response.success !== false &&
            (response as unknown as { status?: boolean }).status !== false;
          if (isSuccess) {
            showToast(response.message || "Banner updated successfully.", "success");
            onSuccess();
            handleClose();
          } else {
            showToast(response.message || "Failed to update banner.", "error");
          }
        } else {
          // Create Mode
          if (!values.banner) {
            showToast("Desktop banner image is required.", "error");
            setIsSubmitting(false);
            return;
          }
          if (!values.mobile_banner) {
            showToast("Mobile banner image is required.", "error");
            setIsSubmitting(false);
            return;
          }

          const response = await createBanner({
            title: values.title.trim(),
            description: values.description.trim(),
            banner: values.banner,
            mobileBanner: values.mobile_banner,
            textColor: values.text_color.trim(),
            isActive: values.is_active,
          });

          const isSuccess =
            response.success !== false &&
            (response as unknown as { status?: boolean }).status !== false;
          if (isSuccess) {
            showToast(response.message || "Banner created successfully.", "success");
            onSuccess();
            handleClose();
          } else {
            showToast(response.message || "Failed to create banner.", "error");
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred.";
        showToast(errorMsg, "error");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    if (desktopPreview) {
      URL.revokeObjectURL(desktopPreview);
      setDesktopPreview(null);
    }
    if (mobilePreview) {
      URL.revokeObjectURL(mobilePreview);
      setMobilePreview(null);
    }
    formik.resetForm();
    onClose();
  };

  const hasDesktopImage = !!formik.values.banner || (isEditMode && !!banner?.banner);
  const hasMobileImage = !!formik.values.mobile_banner || (isEditMode && !!banner?.mobile_banner);
  const hasImages = hasDesktopImage || hasMobileImage;

  // Determine if the Update button should be enabled in edit mode
  // It is enabled when form is valid and any value is changed
  const isChanged =
    !isEditMode ||
    formik.values.title.trim() !== (banner?.title || "") ||
    formik.values.description.trim() !== (banner?.description || "") ||
    formik.values.banner !== null ||
    formik.values.mobile_banner !== null ||
    formik.values.text_color.trim() !== (banner?.text_color || "") ||
    formik.values.is_active !== (banner?.is_active ?? true);

  const isValidAndChanged = formik.isValid && isChanged;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className={`mx-auto flex max-h-[90vh] max-w-[calc(100vw-2.5rem)] flex-col gap-0 overflow-hidden rounded-[24px] border border-(--theme-burgundy-100) p-0 shadow-2xl transition-all duration-300 ease-in-out sm:rounded-[32px] ${
          hasImages ? "sm:max-w-5xl" : "sm:max-w-2xl"
        }`}
      >
        <DialogHeader className="shrink-0 border-b border-(--theme-burgundy-100)/50 bg-white p-6 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight text-(--theme-burgundy-950)">
            {isEditMode ? "Edit Banner" : "Add New Banner"}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-(--theme-coffee-500)">
            {isEditMode
              ? "Modify the visual promotion configurations. Click update to commit changes."
              : "Register a new visual advertising banner to display in the user interfaces."}
          </DialogDescription>
        </DialogHeader>

        <DialogBody
          className={`flex-1 ${
            hasImages
              ? "overflow-y-auto p-0 lg:flex lg:min-h-0 lg:flex-col lg:overflow-y-hidden"
              : "overflow-y-auto px-6 py-4"
          }`}
        >
          <form
            onSubmit={formik.handleSubmit}
            id="banner-dialog-form"
            className={
              hasImages
                ? "grid grid-cols-1 gap-6 lg:h-full lg:min-h-0 lg:flex-1 lg:grid-cols-12 lg:gap-0"
                : "space-y-5"
            }
          >
            {/* Main Form Fields (Left Column when images exist) */}
            <div
              className={
                hasImages
                  ? "space-y-5 px-6 py-4 lg:col-span-7 lg:h-full lg:overflow-y-auto lg:px-6 lg:py-4 lg:pr-6 lg:pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"
                  : "space-y-5"
              }
            >
              {/* Banner Title */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-(--theme-burgundy-950)"
                >
                  Banner Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Summer Special 20% Off"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSubmitting}
                  className={`h-11 rounded-xl border-(--theme-burgundy-200) bg-white text-(--theme-burgundy-950) placeholder:text-(--theme-coffee-300) focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                    formik.touched.title && formik.errors.title
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-xs font-medium text-red-500">{formik.errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-(--theme-burgundy-950)"
                >
                  Banner Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe details about the visual promotion..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSubmitting}
                  rows={3}
                  className={`resize-none rounded-xl border-(--theme-burgundy-200) bg-white text-(--theme-burgundy-950) placeholder:text-(--theme-coffee-300) focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                    formik.touched.description && formik.errors.description
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs font-medium text-red-500">{formik.errors.description}</p>
                )}
              </div>

              {/* Banner Upload Dropzones Component */}
              <BannerDropzones
                bannerValue={formik.values.banner}
                setBannerValue={(file) => formik.setFieldValue("banner", file)}
                bannerError={formik.errors.banner}
                bannerTouched={formik.touched.banner}
                mobileBannerValue={formik.values.mobile_banner}
                setMobileBannerValue={(file) => formik.setFieldValue("mobile_banner", file)}
                mobileBannerError={formik.errors.mobile_banner}
                mobileBannerTouched={formik.touched.mobile_banner}
                desktopPreview={desktopPreview}
                setDesktopPreview={setDesktopPreview}
                mobilePreview={mobilePreview}
                setMobilePreview={setMobilePreview}
                isSubmitting={isSubmitting}
                hasDesktopImage={hasDesktopImage}
                hasMobileImage={hasMobileImage}
                setFieldError={formik.setFieldError}
                setFieldTouched={formik.setFieldTouched}
              />

              {/* Accent Color Picker and Status Switch Component */}
              <BannerColorAndStatus
                textColorValue={formik.values.text_color}
                setTextColorValue={(hex) => formik.setFieldValue("text_color", hex)}
                textColorError={formik.errors.text_color}
                textColorTouched={formik.touched.text_color}
                setFieldTouched={formik.setFieldTouched}
                handleBlur={formik.handleBlur}
                isActiveValue={formik.values.is_active}
                setIsActiveValue={(active) => formik.setFieldValue("is_active", active)}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Banner Side Previews Component */}
            <BannerPreviews
              hasImages={hasImages}
              hasDesktopImage={hasDesktopImage}
              desktopPreview={desktopPreview}
              setDesktopPreview={setDesktopPreview}
              banner={banner}
              bannerValue={formik.values.banner}
              setBannerValue={(file) => formik.setFieldValue("banner", file)}
              hasMobileImage={hasMobileImage}
              mobilePreview={mobilePreview}
              setMobilePreview={setMobilePreview}
              mobileBannerValue={formik.values.mobile_banner}
              setMobileBannerValue={(file) => formik.setFieldValue("mobile_banner", file)}
              isSubmitting={isSubmitting}
              setFieldTouched={formik.setFieldTouched}
            />
          </form>
        </DialogBody>

        <DialogFooter className="flex shrink-0 items-center justify-end gap-3 border-t border-(--theme-burgundy-100)/50 bg-(--theme-coffee-50)/30 p-6">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleClose}
            className="h-10 cursor-pointer rounded-lg border-(--theme-burgundy-200) text-(--theme-burgundy-700) hover:bg-(--theme-burgundy-50)"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="banner-dialog-form"
            disabled={isSubmitting || !isValidAndChanged}
            variant="premium"
            className="flex h-10 items-center gap-2 rounded-lg px-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditMode ? "Update" : "Create"}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
