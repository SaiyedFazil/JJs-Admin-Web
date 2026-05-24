import adminAxiosInstance from "@/lib/admin-axios";
import { handleApiError } from "@/lib/api/error-handler";
import {
  storeAdminAuthTokens,
  storeAdminRole,
  storeAdminName,
  storeAdminPhoneNumber,
} from "@/lib/admin-auth";
import type { AdminLoginPayload, AdminLoginResponse } from "@/types";

/**
 * Admin Login API call
 * Performs admin authentication, stores tokens on success, and handles API errors.
 */
export async function adminLogin(payload: AdminLoginPayload): Promise<AdminLoginResponse> {
  try {
    const response = await adminAxiosInstance.post<AdminLoginResponse>("/admin/login", payload);
    const responseData = response.data;

    if (responseData.status && responseData.data) {
      const data = responseData.data;

      const adminData = data as Record<string, unknown>;
      const legacyAdmin = adminData.admin as Record<string, unknown> | undefined;

      // Extract tokens defensively to handle both flat and nested responses
      const accessToken = (data.accessToken || legacyAdmin?.accessToken) as string | undefined;
      const refreshToken = (data.refreshToken || legacyAdmin?.refreshToken) as string | undefined;

      if (accessToken && refreshToken) {
        storeAdminAuthTokens(accessToken, refreshToken);
      }

      // Extract role
      const rawRole = (data.role || legacyAdmin?.role) as string | undefined;
      if (rawRole) {
        storeAdminRole(rawRole.toUpperCase());
      }

      // Extract name (combine firstName and lastName, or fallback to name/placeholder)
      let name = "";
      if (data.firstName || data.lastName) {
        name = [data.firstName, data.lastName].filter(Boolean).join(" ");
      } else if (legacyAdmin?.name) {
        name = legacyAdmin.name as string;
      }
      if (!name) {
        name = "System Admin";
      }
      storeAdminName(name);

      // Extract phone number (format with a space: e.g. "+91 1111111111")
      const phoneNumber = (data.phoneNumber || legacyAdmin?.phone_number || "") as string;
      const countryCode = data.countryCode || "";
      const fullPhone =
        countryCode && phoneNumber
          ? `${countryCode.trim()} ${phoneNumber.trim()}`
          : phoneNumber.trim();
      if (fullPhone) {
        storeAdminPhoneNumber(fullPhone);
      }
    }

    return responseData;
  } catch (error) {
    return handleApiError(error, {
      401: "Invalid mobile number or password.",
      403: "Your account is not authorized to access the admin portal.",
      422: "Validation error. Please verify your mobile number format.",
      429: "Too many login attempts. Please try again later.",
    });
  }
}
