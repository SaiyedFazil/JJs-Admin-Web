import adminAxiosInstance from "@/lib/admin-axios";
import { handleApiError } from "@/lib/api/error-handler";
import type {
  GetAllProductsResponse,
  CreateProductPayload,
  UpdateProductPayload,
  Product,
} from "@/types";

export interface GetAllProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: number;
}

/**
 * Fetch all products (Admin / SuperAdmin permission required)
 */
export async function getAllProducts(
  params?: GetAllProductsParams
): Promise<GetAllProductsResponse> {
  try {
    const response = await adminAxiosInstance.get<GetAllProductsResponse>(
      "/admin/product/get-all-products",
      { params }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to view products.",
      500: "Internal server error. Failed to retrieve products.",
    }) as unknown as GetAllProductsResponse;
  }
}

/**
 * Create a new product (Admin / SuperAdmin)
 */
export async function createProduct(
  payload: CreateProductPayload
): Promise<{ success: boolean; data?: Product; message: string }> {
  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("selling_price", String(payload.selling_price));
    formData.append("mrp", String(payload.mrp));
    formData.append("category_id", String(payload.category_id));
    formData.append("is_veg", String(payload.is_veg));

    if (payload.primary_image) {
      formData.append("primary_image", payload.primary_image);
    }

    if (payload.all_images && payload.all_images.length > 0) {
      payload.all_images.forEach((img) => {
        formData.append("all_images", img);
      });
    }

    const response = await adminAxiosInstance.post<{
      success: boolean;
      data?: Product;
      message: string;
    }>("/admin/product/create-product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to create products.",
      422: "Validation error. Please verify product data and image format.",
      500: "Failed to create product. Server error.",
    });
  }
}

/**
 * Update an existing product (Admin / SuperAdmin)
 */
export async function updateProduct(
  id: number,
  payload: UpdateProductPayload
): Promise<{ success: boolean; data?: Product; message: string }> {
  try {
    const formData = new FormData();
    if (payload.name !== undefined) {
      formData.append("name", payload.name);
    }
    if (payload.description !== undefined) {
      formData.append("description", payload.description);
    }
    if (payload.selling_price !== undefined) {
      formData.append("selling_price", String(payload.selling_price));
    }
    if (payload.mrp !== undefined) {
      formData.append("mrp", String(payload.mrp));
    }
    if (payload.category_id !== undefined) {
      formData.append("category_id", String(payload.category_id));
    }
    if (payload.is_veg !== undefined) {
      formData.append("is_veg", String(payload.is_veg));
    }
    if (payload.primary_image !== undefined) {
      formData.append("primary_image", payload.primary_image);
    }

    if (payload.all_images && payload.all_images.length > 0) {
      payload.all_images.forEach((img) => {
        formData.append("all_images", img);
      });
    }

    const response = await adminAxiosInstance.patch<{
      success: boolean;
      data?: Product;
      message: string;
    }>(`/admin/product/update-product/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to update products.",
      404: "Product not found.",
      422: "Validation error. Please verify product data.",
      500: "Failed to update product. Server error.",
    });
  }
}

/**
 * Soft-delete a product by id (Admin / SuperAdmin)
 */
export async function deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await adminAxiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/admin/product/delete-product/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to delete products.",
      404: "Product not found.",
      500: "Failed to delete product. Server error.",
    });
  }
}
