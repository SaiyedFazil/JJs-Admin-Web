import adminAxiosInstance from "@/lib/admin-axios";
import { handleApiError } from "@/lib/api/error-handler";
import type { GetAllCategoriesResponse } from "@/types";

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
