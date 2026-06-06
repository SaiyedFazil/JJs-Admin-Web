"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import { Loader2, FolderTree } from "lucide-react";
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
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/dropzone";
import { categorySchema } from "@/lib/validation";
import { createCategory, updateCategory } from "@/lib/api/admin/category-api";
import type { Category } from "@/types";

interface CreateUpdateCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSuccess: () => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export function CreateUpdateCategoryDialog({
  isOpen,
  onClose,
  category,
  onSuccess,
  showToast,
}: CreateUpdateCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!category;

  const formik = useFormik({
    initialValues: {
      name: category ? category.name : "",
      category_image: null as File | null,
    },
    validationSchema: categorySchema(isEditMode),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (isEditMode && category) {
          // Prepare PATCH payload with only changed values
          const payload: { name?: string; categoryImage?: File } = {};
          let hasChanges = false;

          if (values.name.trim() !== category.name) {
            payload.name = values.name.trim();
            hasChanges = true;
          }
          if (values.category_image !== null) {
            payload.categoryImage = values.category_image;
            hasChanges = true;
          }

          if (!hasChanges) {
            showToast("No changes detected.", "error");
            setIsSubmitting(false);
            return;
          }

          const response = await updateCategory(category.id, payload);
          if (response.success || (response as unknown as { status?: boolean }).status === true) {
            showToast(response.message || "Category updated successfully.", "success");
            onSuccess();
            handleClose();
          } else {
            showToast(response.message || "Failed to update category.", "error");
          }
        } else {
          // Create Mode
          if (!values.category_image) {
            showToast("Category image is required.", "error");
            setIsSubmitting(false);
            return;
          }
          const response = await createCategory({
            name: values.name.trim(),
            categoryImage: values.category_image,
          });
          if (response.success || (response as unknown as { status?: boolean }).status === true) {
            showToast(response.message || "Category created successfully.", "success");
            onSuccess();
            handleClose();
          } else {
            showToast(response.message || "Failed to create category.", "error");
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
    formik.resetForm();
    onClose();
  };

  // Determine if the Update button should be enabled in edit mode
  // It is enabled when form is valid and either the name or image is changed
  const isChanged =
    !isEditMode ||
    formik.values.name.trim() !== (category?.name || "") ||
    formik.values.category_image !== null;

  const isValidAndChanged = formik.isValid && isChanged;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="mx-auto flex max-h-[85vh] max-w-[calc(100vw-2.5rem)] flex-col gap-0 overflow-hidden rounded-[24px] border border-(--theme-burgundy-100) p-0 shadow-2xl sm:max-w-lg sm:rounded-[32px]">
        <DialogHeader className="shrink-0 border-b border-(--theme-burgundy-100)/50 bg-white p-6 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight text-(--theme-burgundy-950)">
            {isEditMode ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-(--theme-coffee-500)">
            {isEditMode
              ? "Modify the details of your category. Make sure to click save to apply changes."
              : "Create a new category for organizing your meals and beverages."}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={formik.handleSubmit} className="space-y-6" id="category-dialog-form">
            {/* Category Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="flex items-center gap-1 text-sm font-semibold text-(--theme-burgundy-950)"
              >
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Sweets, Starters, Drinks"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSubmitting}
                className={`h-11 rounded-xl border-(--theme-burgundy-200) bg-white text-(--theme-burgundy-950) placeholder:text-(--theme-coffee-300) focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs font-medium text-red-500">{formik.errors.name}</p>
              )}
            </div>

            {/* Category Image */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-sm font-semibold text-(--theme-burgundy-950)">
                Category Image <span className="text-red-500">*</span>
              </Label>
              <Dropzone
                accept={{ "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] }}
                maxSize={5 * 1024 * 1024} // 5MB
                src={formik.values.category_image ? [formik.values.category_image] : []}
                disabled={isSubmitting}
                onDrop={(acceptedFiles) => {
                  if (acceptedFiles.length > 0) {
                    formik.setFieldValue("category_image", acceptedFiles[0]);
                    formik.setFieldTouched("category_image", true, false);
                  }
                }}
                onRemove={() => {
                  formik.setFieldValue("category_image", null);
                  formik.setFieldTouched("category_image", true, false);
                }}
                onError={(err) => {
                  formik.setFieldError("category_image", err.message);
                  formik.setFieldTouched("category_image", true, false);
                }}
              >
                <DropzoneEmptyState>
                  {isEditMode && category?.image && !formik.values.category_image ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-(--theme-burgundy-100) bg-white shadow-md">
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={112}
                          height={112}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium text-(--theme-coffee-500)">
                        Current image. Drag & drop or click to replace.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--theme-coffee-50) text-(--theme-coffee-600)">
                        <FolderTree className="h-6 w-6 opacity-80" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-(--theme-burgundy-700)">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-xs text-(--theme-coffee-400)">
                          JPG, JPEG, or PNG up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </DropzoneEmptyState>
                <DropzoneContent />
              </Dropzone>
              {formik.touched.category_image && formik.errors.category_image && (
                <p className="text-xs font-medium text-red-500">{formik.errors.category_image}</p>
              )}
            </div>
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
            form="category-dialog-form"
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
              <span>{isEditMode ? "Update" : "Add"}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
