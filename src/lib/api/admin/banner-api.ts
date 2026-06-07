import adminAxiosInstance from "@/lib/admin-axios";
import { handleApiError } from "@/lib/api/error-handler";
import type {
  GetAllBannersResponse,
  CreateBannerPayload,
  UpdateBannerPayload,
  Banner,
} from "@/types";

/**
 * Fetch all banners for admin including pagination and search filtering
 */
export async function getAllBanners(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetAllBannersResponse> {
  try {
    const response = await adminAxiosInstance.get<GetAllBannersResponse>(
      "/admin/banner/all-banners",
      { params }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to view banners.",
      500: "Internal server error. Failed to retrieve banners.",
    });
  }
}

/**
 * Create a new banner (Admin / SuperAdmin)
 */
export async function createBanner(
  payload: CreateBannerPayload
): Promise<{ success: boolean; data?: Banner; message: string }> {
  try {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("banner", payload.banner);
    formData.append("mobile_banner", payload.mobileBanner);
    formData.append("text_color", payload.textColor);
    formData.append("is_active", String(payload.isActive));

    const response = await adminAxiosInstance.post<{
      success: boolean;
      data?: Banner;
      message: string;
    }>("/admin/banner/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to create banners.",
      422: "Validation error. Please verify banner data and image format.",
      500: "Failed to create banner. Server error.",
    });
  }
}

/**
 * Update an existing banner (Admin / SuperAdmin)
 * Only modified fields are sent in the payload.
 */
export async function updateBanner(
  id: number,
  payload: UpdateBannerPayload
): Promise<{ success: boolean; data?: Banner; message: string }> {
  try {
    const formData = new FormData();
    if (payload.title !== undefined) {
      formData.append("title", payload.title);
    }
    if (payload.description !== undefined) {
      formData.append("description", payload.description);
    }
    if (payload.banner !== undefined) {
      formData.append("banner", payload.banner);
    }
    if (payload.mobileBanner !== undefined) {
      formData.append("mobile_banner", payload.mobileBanner);
    }
    if (payload.textColor !== undefined) {
      formData.append("text_color", payload.textColor);
    }
    if (payload.isActive !== undefined) {
      formData.append("is_active", String(payload.isActive));
    }

    const response = await adminAxiosInstance.patch<{
      success: boolean;
      data?: Banner;
      message: string;
    }>(`/admin/banner/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to update banners.",
      404: "Banner not found.",
      422: "Validation error. Please verify banner data.",
      500: "Failed to update banner. Server error.",
    });
  }
}

/**
 * Delete a banner by id (Admin / SuperAdmin)
 */
export async function deleteBanner(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await adminAxiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/admin/banner/delete/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to delete banners.",
      404: "Banner not found.",
      500: "Failed to delete banner. Server error.",
    });
  }
}
