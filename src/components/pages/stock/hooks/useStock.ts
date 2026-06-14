"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useToast } from "@/components/common";
import {
  getItemStock,
  GetItemStockParams,
  updateMultiItemStock,
  updateSingleItemStock,
} from "@/lib/api/admin/product-api";
import { getAllCategories } from "@/lib/api/admin/category-api";
import type {
  ItemStock,
  Category,
  UpdateSingleItemStockPayload,
  BulkUpdateItemStockProduct,
} from "@/types";
import { useFormik, FormikErrors } from "formik";
import { bulkStockSchema } from "@/lib/validation";

export function useStock() {
  const { toast, showToast, hideToast } = useToast();

  // Stock List States
  const [stockItems, setStockItems] = useState<ItemStock[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [savingRowId, setSavingRowId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      products: [] as ItemStock[],
    },
    validationSchema: bulkStockSchema,
    validateOnMount: true,
    onSubmit: () => {},
  });

  // Stable refs — always hold latest values without causing callbacks to get new identities
  const formikRef = useRef(formik);
  formikRef.current = formik;

  const stockItemsRef = useRef(stockItems);
  stockItemsRef.current = stockItems;

  // Passed to getColumns so error display is live without errors being a columns dep
  const errorsRef = useRef(formik.errors.products);
  errorsRef.current = formik.errors.products;

  const isChanged = useMemo(() => {
    if (!isEditing) return false;
    return JSON.stringify(formik.values.products) !== JSON.stringify(stockItems);
  }, [isEditing, formik.values.products, stockItems]);

  const isInitialMount = useRef(true);

  // Search States
  const [searchVal, setSearchVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Category Filter States
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Fetch all categories for filter dropdown on demand
  const fetchCategoriesForDropdown = useCallback(async () => {
    if (categoriesLoaded) return;
    setIsLoadingCategories(true);
    try {
      const response = await getAllCategories();
      const isSuccess = !!(
        response.success || (response as unknown as { status?: boolean }).status === true
      );
      if (isSuccess) {
        setCategories(response.data || []);
        setCategoriesLoaded(true);
      } else {
        showToast(response.message || "Failed to load categories for filter.", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load categories.";
      showToast(msg, "error");
    } finally {
      setIsLoadingCategories(false);
    }
  }, [categoriesLoaded, showToast]);

  const handleDropdownOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        fetchCategoriesForDropdown();
      }
    },
    [fetchCategoriesForDropdown]
  );

  const fetchStock = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        if (isInitialMount.current) {
          setIsLoading(true);
        } else {
          setIsTableLoading(true);
        }
      }
      setError(null);

      try {
        const params: GetItemStockParams = {};

        if (searchQuery.trim() !== "") {
          params.search = searchQuery;
        }

        if (selectedCategoryId !== null) {
          params.category = selectedCategoryId;
        }

        const response = await getItemStock(params);
        const isSuccess = !!(
          response.success || (response as unknown as { status?: boolean }).status === true
        );

        if (isSuccess) {
          setStockItems(response.data?.rows || []);
        } else {
          const msg = response.message || "Failed to load stock details";
          setError(msg);
          showToast(msg, "error");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load stock details";
        setError(msg);
        showToast(msg, "error");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsTableLoading(false);
        isInitialMount.current = false;
      }
    },
    [searchQuery, selectedCategoryId, showToast]
  );

  // Fetch stock when search or category filter changes
  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const handleStartEditing = useCallback(() => {
    const cloned = JSON.parse(JSON.stringify(stockItemsRef.current));
    formikRef.current.setValues({ products: cloned });
    setIsEditing(true);
  }, []);

  const handleCancelEditing = useCallback(() => {
    setIsEditing(false);
    formikRef.current.resetForm();
  }, []);

  const handleCellChange = useCallback(
    (rowId: number, field: keyof ItemStock, value: string | number | boolean) => {
      const f = formikRef.current;
      const updated = f.values.products.map((item) => {
        if (item.id === rowId) {
          return { ...item, [field]: value };
        }
        return item;
      });
      f.setFieldValue("products", updated);
    },
    []
  );

  const handleStartRowEditing = useCallback((rowId: number) => {
    const cloned = JSON.parse(JSON.stringify(stockItemsRef.current));
    formikRef.current.setValues({ products: cloned });
    setEditingRowId(rowId);
  }, []);

  const handleCancelRowEditing = useCallback(() => {
    setEditingRowId(null);
    formikRef.current.resetForm();
  }, []);

  const handleSaveRowEditing = useCallback(
    async (rowId: number) => {
      const f = formikRef.current;
      const validationErrors = await f.validateForm();

      const rowIndex = f.values.products.findIndex((p) => p.id === rowId);
      if (rowIndex === -1) return;

      const productsErrors = validationErrors.products as FormikErrors<ItemStock>[] | undefined;
      const rowErrors = productsErrors?.[rowIndex];
      if (rowErrors && Object.keys(rowErrors).length > 0) {
        showToast("Please fix the validation errors before saving.", "error");
        return;
      }

      const updatedProduct = f.values.products[rowIndex];

      setSavingRowId(rowId);
      try {
        const original = stockItemsRef.current.find((o) => o.id === rowId);
        const payload: Partial<UpdateSingleItemStockPayload> = {};

        if (original) {
          if (updatedProduct.total_stock !== original.total_stock) {
            payload.total_stock = updatedProduct.total_stock;
          }
          if (updatedProduct.available_stock !== original.available_stock) {
            payload.available_stock = updatedProduct.available_stock;
          }
          if (updatedProduct.status !== original.status) {
            payload.status = updatedProduct.status;
          }
          if (updatedProduct.is_not_returnable !== original.is_not_returnable) {
            payload.is_not_returnable = updatedProduct.is_not_returnable;
          }
          if (updatedProduct.min_order_qty !== original.min_order_qty) {
            payload.min_order_qty = updatedProduct.min_order_qty;
          }
          if (updatedProduct.max_order_qty !== original.max_order_qty) {
            payload.max_order_qty = updatedProduct.max_order_qty;
          }
          if (updatedProduct.lead_time !== original.lead_time) {
            payload.lead_time = updatedProduct.lead_time;
          }
        } else {
          payload.total_stock = updatedProduct.total_stock;
          payload.available_stock = updatedProduct.available_stock;
          payload.status = updatedProduct.status;
          payload.is_not_returnable = updatedProduct.is_not_returnable;
          payload.min_order_qty = updatedProduct.min_order_qty;
          payload.max_order_qty = updatedProduct.max_order_qty;
          payload.lead_time = updatedProduct.lead_time;
        }

        if (Object.keys(payload).length === 0) {
          showToast("No changes detected in stock details.", "success");
          setEditingRowId(null);
          return;
        }

        const response = await updateSingleItemStock(rowId, payload);
        const isSuccess = !!(
          response.success || (response as unknown as { status?: boolean }).status === true
        );

        if (isSuccess) {
          showToast(response.message || "Item stock updated successfully.", "success");
          setEditingRowId(null);
          setStockItems((prev) =>
            prev.map((item) => (item.id === rowId ? { ...item, ...payload } : item))
          );
        } else {
          showToast(response.message || "Failed to update item stock.", "error");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
        showToast(msg, "error");
      } finally {
        setSavingRowId(null);
      }
    },
    [showToast]
  );

  const handleSaveChanges = useCallback(async () => {
    const f = formikRef.current;
    const errors = await f.validateForm();
    if (Object.keys(errors).length > 0) {
      showToast("Please fix the validation errors before saving.", "error");
      return;
    }

    // Determine modified records
    const modifiedProducts = f.values.products.filter((item) => {
      const original = stockItemsRef.current.find((orig) => orig.id === item.id);
      if (!original) return false;
      return (
        item.total_stock !== original.total_stock ||
        item.available_stock !== original.available_stock ||
        item.status !== original.status ||
        item.is_not_returnable !== original.is_not_returnable ||
        item.min_order_qty !== original.min_order_qty ||
        item.max_order_qty !== original.max_order_qty ||
        item.lead_time !== original.lead_time
      );
    });

    if (modifiedProducts.length === 0) {
      showToast("No changes detected in stock details.", "success");
      setIsEditing(false);
      return;
    }

    setIsTableLoading(true);
    try {
      const payload = {
        products: modifiedProducts.map((item) => {
          const original = stockItemsRef.current.find((orig) => orig.id === item.id);
          const productPayload: BulkUpdateItemStockProduct = { id: item.id };
          if (original) {
            if (item.total_stock !== original.total_stock) {
              productPayload.total_stock = item.total_stock;
            }
            if (item.available_stock !== original.available_stock) {
              productPayload.available_stock = item.available_stock;
            }
            if (item.status !== original.status) {
              productPayload.status = item.status;
            }
            if (item.is_not_returnable !== original.is_not_returnable) {
              productPayload.is_not_returnable = item.is_not_returnable;
            }
            if (item.min_order_qty !== original.min_order_qty) {
              productPayload.min_order_qty = item.min_order_qty;
            }
            if (item.max_order_qty !== original.max_order_qty) {
              productPayload.max_order_qty = item.max_order_qty;
            }
            if (item.lead_time !== original.lead_time) {
              productPayload.lead_time = item.lead_time;
            }
          } else {
            productPayload.total_stock = item.total_stock;
            productPayload.available_stock = item.available_stock;
            productPayload.status = item.status;
            productPayload.is_not_returnable = item.is_not_returnable;
            productPayload.min_order_qty = item.min_order_qty;
            productPayload.max_order_qty = item.max_order_qty;
            productPayload.lead_time = item.lead_time;
          }
          return productPayload;
        }),
      };

      const response = await updateMultiItemStock(payload);
      const isSuccess = !!(
        response.success || (response as unknown as { status?: boolean }).status === true
      );

      if (isSuccess) {
        showToast(response.message || "Multiple item stocks updated successfully.", "success");
        setIsEditing(false);
        f.resetForm();
        fetchStock(true);
      } else {
        showToast(response.message || "Failed to update item stocks.", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      showToast(msg, "error");
    } finally {
      setIsTableLoading(false);
    }
  }, [fetchStock, showToast]);

  // Reset search filter immediately if input is cleared manually
  useEffect(() => {
    if (searchVal === "" && searchQuery !== "") {
      setSearchQuery("");
    }
  }, [searchVal, searchQuery]);

  const handleSearchSubmit = useCallback(() => {
    setSearchQuery(searchVal);
  }, [searchVal]);

  const handleClearSearch = useCallback(() => {
    setSearchVal("");
    setSearchQuery("");
  }, []);

  // Compute stock statistics for premium summary cards
  const stats = useMemo(() => {
    const data = isEditing || editingRowId !== null ? formik.values.products : stockItems;
    const total = data.length;
    const outOfStock = data.filter((item) => item.available_stock === 0).length;
    const lowStock = data.filter(
      (item) => item.available_stock > 0 && item.available_stock <= 10
    ).length;
    return { total, outOfStock, lowStock };
  }, [isEditing, editingRowId, formik.values.products, stockItems]);

  return {
    // States
    stockItems,
    isEditing,
    editingRowId,
    savingRowId,
    isLoading,
    isRefreshing,
    isTableLoading,
    error,
    toast,
    searchVal,
    searchQuery,
    selectedCategoryId,
    categories,
    isLoadingCategories,
    isChanged,
    stats,
    errorsRef,
    formik,

    // State Setters
    setSearchVal,
    setSelectedCategoryId,

    // Actions
    fetchStock,
    handleStartEditing,
    handleCancelEditing,
    handleCellChange,
    handleStartRowEditing,
    handleCancelRowEditing,
    handleSaveRowEditing,
    handleSaveChanges,
    handleSearchSubmit,
    handleClearSearch,
    handleDropdownOpenChange,
    hideToast,
  };
}
