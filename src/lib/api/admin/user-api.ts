import adminAxiosInstance from "@/lib/admin-axios";
import { handleApiError } from "@/lib/api/error-handler";
import type { GetAllUsersResponse } from "@/types";

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  /** Search by name, email or phone number */
  search?: string;
  /** Filter by a specific role (e.g. "admin", "rider", "super_admin") */
  role?: string;
  /**
   * When `true`, returns only application users (role = "user").
   * When `false`, returns staff users (admin / super_admin / rider).
   */
  usersOnly?: boolean;
}

/**
 * Fetch a paginated list of users (SuperAdmin permission required).
 */
export async function getAllUsers(params?: GetAllUsersParams): Promise<GetAllUsersResponse> {
  try {
    const response = await adminAxiosInstance.get<GetAllUsersResponse>(
      "/super-admin/users/all-users",
      { params }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, {
      401: "Session expired. Please log in again.",
      403: "You are not authorized to view users.",
      500: "Internal server error. Failed to retrieve users.",
    }) as unknown as GetAllUsersResponse;
  }
}
