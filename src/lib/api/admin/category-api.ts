import adminAxiosInstance from "@/lib/admin-axios";
import { handleApiError } from "@/lib/api/error-handler";
import type {
  GetAllCategoriesResponse,
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types";

/**
 * Fetch all categories including soft-deleted ones (Admin permission required)
 */
export async function getAllCategories(): Promise<GetAllCategoriesResponse> {
  try {
    const response = await adminAxiosInstance.get<GetAllCategoriesResponse>(
      "/admin/category/get-all-categories"
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to view categories.",
      500: "Internal server error. Failed to retrieve categories.",
    });
  }
}

/**
 * Create a new category (Admin / SuperAdmin)
 */
export async function createCategory(
  payload: CreateCategoryPayload
): Promise<{ success: boolean; data?: Category; message: string }> {
  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("category_image", payload.categoryImage);

    const response = await adminAxiosInstance.post<{
      success: boolean;
      data?: Category;
      message: string;
    }>("/admin/category/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to create categories.",
      422: "Validation error. Please verify category name and image format.",
      500: "Failed to create category. Server error.",
    });
  }
}

/**
 * Update an existing category (Admin / SuperAdmin)
 * Only modified fields are sent in the payload.
 */
export async function updateCategory(
  id: number,
  payload: UpdateCategoryPayload
): Promise<{ success: boolean; data?: Category; message: string }> {
  try {
    const formData = new FormData();
    if (payload.name !== undefined) {
      formData.append("name", payload.name);
    }
    if (payload.categoryImage !== undefined) {
      formData.append("category_image", payload.categoryImage);
    }

    const response = await adminAxiosInstance.patch<{
      success: boolean;
      data?: Category;
      message: string;
    }>(`/admin/category/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to update categories.",
      404: "Category not found.",
      422: "Validation error. Please verify category name and image format.",
      500: "Failed to update category. Server error.",
    });
  }
}

/**
 * Soft-delete a category by id (Admin / SuperAdmin)
 */
export async function deleteCategory(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await adminAxiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/admin/category/delete/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to delete categories.",
      404: "Category not found.",
      500: "Failed to delete category. Server error.",
    });
  }
}
