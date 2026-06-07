"use client";

import React, { useState, useCallback, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { productSchema } from "@/lib/validation";
import { createProduct, updateProduct } from "@/lib/api/admin/product-api";
import { getAllCategories } from "@/lib/api/admin/category-api";
import type { Product, Category, UpdateProductPayload } from "@/types";
import { FoodTypeSelector } from "./components/FoodTypeSelector";
import { CategorySelect } from "./components/CategorySelect";
import {
  ImageUploadSection,
  ImagePreviewGrid,
  type FormImage,
} from "./components/ImageUploadSection";

interface CreateUpdateItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export function CreateUpdateItemDialog({
  isOpen,
  onClose,
  product,
  onSuccess,
  showToast,
}: CreateUpdateItemDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!product;

  // Category selection list states
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Dynamic category fetch
  const fetchCategories = useCallback(async () => {
    if (categoriesLoaded) return;
    setIsLoadingCategories(true);
    try {
      const response = await getAllCategories();
      const isSuccess =
        response.success || (response as unknown as { status?: boolean }).status === true;
      if (isSuccess) {
        setCategories(response.data || []);
        setCategoriesLoaded(true);
      } else {
        showToast(response.message || "Failed to load categories for dropdown.", "error");
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [categoriesLoaded, showToast]);

  const handleDropdownOpenChange = (open: boolean) => {
    if (open) {
      fetchCategories();
    }
  };

  // Convert API image references to form compatible images list
  const initialImages: FormImage[] = useMemo(() => {
    if (product && product.images) {
      return product.images.map((img) => ({
        id: img.id,
        previewUrl: img.image,
        is_primary: img.is_primary,
      }));
    }
    return [];
  }, [product]);

  const formik = useFormik({
    initialValues: {
      name: product ? product.name : "",
      description: product ? product.description || "" : "",
      selling_price: product ? String(product.selling_price) : "",
      mrp: product ? String(product.mrp) : "",
      category_id: product && product.category ? String(product.category.id) : "",
      is_veg: product ? !!product.is_veg : false,
      images: initialImages,
    },
    validationSchema: productSchema(isEditMode),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (isEditMode && product) {
          // Prepare PATCH payload with changed values
          const payload: Partial<UpdateProductPayload> = {};
          let hasChanges = false;

          if (values.name.trim() !== product.name) {
            payload.name = values.name.trim();
            hasChanges = true;
          }
          if (values.description.trim() !== (product.description || "")) {
            payload.description = values.description.trim();
            hasChanges = true;
          }
          if (Number(values.selling_price) !== Number(product.selling_price)) {
            payload.selling_price = Number(values.selling_price);
            hasChanges = true;
          }
          if (Number(values.mrp) !== Number(product.mrp)) {
            payload.mrp = Number(values.mrp);
            hasChanges = true;
          }
          if (Number(values.category_id) !== (product.category?.id || 0)) {
            payload.category_id = Number(values.category_id);
            hasChanges = true;
          }
          if (values.is_veg !== (product.is_veg ?? true)) {
            payload.is_veg = values.is_veg;
            hasChanges = true;
          }

          // Extract files dropped in this edit session
          const newFormImages = values.images.filter((img) => img.file);
          const primaryFileObj = newFormImages.find((img) => img.is_primary);

          if (primaryFileObj && primaryFileObj.file) {
            payload.primary_image = primaryFileObj.file;
            hasChanges = true;
          }

          const additionalFiles = newFormImages
            .filter((img) => !img.is_primary)
            .map((img) => img.file as File);
          if (additionalFiles.length > 0) {
            payload.all_images = additionalFiles;
            hasChanges = true;
          }

          // If the list of images changed, consider it a change
          if (values.images.length !== initialImages.length) {
            hasChanges = true;
          }

          if (!hasChanges) {
            showToast("No changes detected.", "error");
            setIsSubmitting(false);
            return;
          }

          const response = await updateProduct(product.id, payload);
          const isSuccess =
            response.success || (response as unknown as { status?: boolean }).status === true;

          if (isSuccess) {
            showToast(response.message || "Product updated successfully.", "success");
            onSuccess();
            handleClose();
          } else {
            showToast(response.message || "Failed to update product.", "error");
          }
        } else {
          // Create Mode
          const primaryImgObj = values.images.find((img) => img.is_primary);
          if (!primaryImgObj || !primaryImgObj.file) {
            showToast("Primary image is required.", "error");
            setIsSubmitting(false);
            return;
          }

          const additionalImages = values.images
            .filter((img) => !img.is_primary)
            .map((img) => img.file as File);

          const response = await createProduct({
            name: values.name.trim(),
            description: values.description.trim(),
            selling_price: Number(values.selling_price),
            mrp: Number(values.mrp),
            category_id: Number(values.category_id),
            is_veg: values.is_veg,
            primary_image: primaryImgObj.file,
            all_images: additionalImages,
          });

          const isSuccess =
            response.success || (response as unknown as { status?: boolean }).status === true;

          if (isSuccess) {
            showToast(response.message || "Product created successfully.", "success");
            onSuccess();
            handleClose();
          } else {
            showToast(response.message || "Failed to create product.", "error");
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
    // Revoke any newly created local Object URLs
    formik.values.images.forEach((img) => {
      if (img.file) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });

    formik.resetForm();
    onClose();
  };

  // Determine if the action button should be enabled
  const isChanged =
    !isEditMode ||
    formik.values.name.trim() !== product.name ||
    formik.values.description.trim() !== (product.description || "") ||
    Number(formik.values.selling_price) !== Number(product.selling_price) ||
    Number(formik.values.mrp) !== Number(product.mrp) ||
    Number(formik.values.category_id) !== (product.category?.id || 0) ||
    formik.values.is_veg !== (product.is_veg ?? true) ||
    formik.values.images.length !== initialImages.length ||
    formik.values.images.some((img, i) => {
      const initImg = initialImages[i];
      return !initImg || img.is_primary !== initImg.is_primary;
    });

  const isValidAndChanged = formik.isValid && isChanged;

  const hasImages = formik.values.images.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className={`mx-auto flex max-h-[90vh] max-w-[calc(100vw-2.5rem)] flex-col gap-0 overflow-hidden rounded-[24px] border border-(--theme-burgundy-100) p-0 shadow-2xl transition-all duration-300 ease-in-out sm:rounded-[32px] ${
          hasImages ? "sm:max-w-5xl" : "sm:max-w-2xl"
        }`}
      >
        <DialogHeader className="shrink-0 border-b border-(--theme-burgundy-100)/50 bg-white p-6 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight text-(--theme-burgundy-950)">
            {isEditMode ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-(--theme-coffee-500)">
            {isEditMode
              ? "Modify the recipe pricing, details, and photos for this menu item."
              : "Register a new recipe, set price models, and upload media items for your list."}
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
            id="product-dialog-form"
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
              {/* Item Name (Full Width) */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-1 text-xs font-semibold text-(--theme-burgundy-950)"
                >
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Chicken Shawarma"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSubmitting}
                  className={`h-11 rounded-xl border-(--theme-burgundy-200) bg-white text-(--theme-burgundy-950) placeholder:text-(--theme-coffee-300) focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                    formik.touched.name && formik.errors.name ? "border-red-500" : ""
                  }`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-xs font-medium text-red-500">{formik.errors.name}</p>
                )}
              </div>

              {/* Category and Veg/Non-Veg Selection (1/2 width each) */}
              <div className="grid gap-4 sm:grid-cols-2">
                <CategorySelect
                  value={formik.values.category_id}
                  onChange={(val) => {
                    formik.setFieldValue("category_id", val);
                    formik.setFieldTouched("category_id", true, false);
                  }}
                  disabled={isSubmitting}
                  hasError={!!(formik.touched.category_id && formik.errors.category_id)}
                  errorMessage={formik.errors.category_id}
                  categories={categories}
                  isLoadingCategories={isLoadingCategories}
                  onOpenChange={handleDropdownOpenChange}
                  isEditMode={isEditMode}
                  productCategory={product && product.category ? product.category : undefined}
                />

                <FoodTypeSelector
                  value={formik.values.is_veg}
                  onChange={(val) => {
                    formik.setFieldValue("is_veg", val);
                    formik.setFieldTouched("is_veg", true, false);
                  }}
                  disabled={isSubmitting}
                  hasError={!!(formik.touched.is_veg && formik.errors.is_veg)}
                  errorMessage={formik.errors.is_veg}
                />
              </div>

              {/* MRP and Selling Price (1/2 width each) */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="mrp"
                    className="flex items-center gap-1 text-xs font-semibold text-(--theme-burgundy-950)"
                  >
                    MRP (Maximum Retail Price) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mrp"
                    name="mrp"
                    type="text"
                    placeholder="e.g. 300"
                    value={formik.values.mrp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSubmitting}
                    className={`h-11 rounded-xl border-(--theme-burgundy-200) bg-white text-(--theme-burgundy-950) placeholder:text-(--theme-coffee-300) focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                      formik.touched.mrp && formik.errors.mrp ? "border-red-500" : ""
                    }`}
                  />
                  {formik.touched.mrp && formik.errors.mrp && (
                    <p className="text-xs font-medium text-red-500">{formik.errors.mrp}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="selling_price"
                    className="flex items-center gap-1 text-xs font-semibold text-(--theme-burgundy-950)"
                  >
                    Selling Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="selling_price"
                    name="selling_price"
                    type="text"
                    placeholder="e.g. 250"
                    value={formik.values.selling_price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSubmitting}
                    className={`h-11 rounded-xl border-(--theme-burgundy-200) bg-white text-(--theme-burgundy-950) placeholder:text-(--theme-coffee-300) focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                      formik.touched.selling_price && formik.errors.selling_price
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.selling_price && formik.errors.selling_price && (
                    <p className="text-xs font-medium text-red-500">
                      {formik.errors.selling_price}
                    </p>
                  )}
                </div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-1 text-xs font-semibold text-(--theme-burgundy-950)"
                >
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the taste profile, ingredients, allergens, or serving suggestions..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSubmitting}
                  maxLength={500}
                  className={`min-h-[90px] rounded-xl border-(--theme-burgundy-200) bg-white text-(--theme-burgundy-950) placeholder:text-(--theme-coffee-300) focus:border-(--theme-taupe) focus:ring-1 focus:ring-(--theme-taupe) ${
                    formik.touched.description && formik.errors.description ? "border-red-500" : ""
                  }`}
                />
                <div className="text-muted-foreground flex justify-between text-[10px]">
                  <span>Maximum 500 characters</span>
                  <span>{formik.values.description.length}/500</span>
                </div>
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs font-medium text-red-500">{formik.errors.description}</p>
                )}
              </div>

              {/* Image Upload Section */}
              <ImageUploadSection
                images={formik.values.images}
                onChange={(updatedImages) => {
                  formik.setFieldValue("images", updatedImages);
                  formik.setFieldTouched("images", true, false);
                }}
                disabled={isSubmitting}
                showToast={showToast}
                hasError={!!(formik.touched.images && formik.errors.images)}
                errorMessage={
                  typeof formik.errors.images === "string" ? formik.errors.images : undefined
                }
                hidePreview={hasImages}
              />
            </div>

            {/* Gallery Section (Right Column when images exist) */}
            {hasImages && (
              <div className="flex flex-col border-t border-(--theme-burgundy-100)/50 lg:col-span-5 lg:h-full lg:min-h-0 lg:border-t-0 lg:border-l">
                <div className="flex shrink-0 items-center justify-between border-b border-(--theme-burgundy-100)/50 px-6 pt-4 pb-4">
                  <h3 className="text-xs font-bold tracking-wider text-(--theme-burgundy-950) uppercase">
                    Uploaded Images
                  </h3>
                  <span className="rounded-full bg-(--theme-burgundy-50) px-2.5 py-0.5 text-xs font-semibold text-(--theme-burgundy-700)">
                    {formik.values.images.length} / 10
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
                  <ImagePreviewGrid
                    images={formik.values.images}
                    onChange={(updatedImages) => {
                      formik.setFieldValue("images", updatedImages);
                      formik.setFieldTouched("images", true, false);
                    }}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}
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
            form="product-dialog-form"
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
