import adminAxiosInstance from "@/lib/admin-axios";
import { handleApiError } from "@/lib/api/error-handler";
import axios from "axios";
import {
  storeAdminAuthTokens,
  storeAdminRole,
  storeAdminName,
  storeAdminPhoneNumber,
  clearAdminAuthTokens,
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

      // Extract role and validate authorization
      const rawRole = (data.role || legacyAdmin?.role) as string | undefined;
      const normalizedRole = rawRole?.toLowerCase();

      if (
        !normalizedRole ||
        (normalizedRole !== "admin" &&
          normalizedRole !== "super_admin" &&
          normalizedRole !== "superadmin")
      ) {
        clearAdminAuthTokens();
        throw new Error("Your account is not authorized to access the admin portal.");
      }

      if (accessToken && refreshToken) {
        storeAdminAuthTokens(accessToken, refreshToken);
      }

      storeAdminRole(normalizedRole === "superadmin" ? "super_admin" : normalizedRole);

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

/**
 * Change Admin/SuperAdmin Password API call
 * Determines the correct endpoint based on the role and performs password update.
 */
export async function changeAdminPassword(
  oldPassword: string,
  newPassword: string,
  role: string
): Promise<{ status: boolean; message: string }> {
  try {
    const endpoint =
      role.toLowerCase() === "super_admin"
        ? "/super-admin/change-password"
        : "/admin/change-password";

    const response = await adminAxiosInstance.post(endpoint, {
      old_password: oldPassword,
      new_password: newPassword,
    });

    return {
      status: response.data?.status ?? true,
      message: response.data?.message ?? "Password changed successfully.",
    };
  } catch (error) {
    let errorMsg = "Failed to update password.";
    if (axios.isAxiosError(error)) {
      errorMsg = error.response?.data?.message || error.message || errorMsg;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    return {
      status: false,
      message: errorMsg,
    };
  }
}

/**
 * Begin admin or super admin password reset by requesting OTP
 */
export async function forgotAdminPassword(
  phoneNumber: string,
  role: string
): Promise<{ status: boolean; message: string; authToken?: string }> {
  try {
    const endpoint =
      role.toLowerCase() === "super_admin"
        ? "/super-admin/forgot-password"
        : "/admin/forgot-password";

    // Clean phone number (remove spaces, prefix, and non-digit characters)
    let cleanPhone = phoneNumber.replace(/\s+/g, "");
    if (cleanPhone.startsWith("+91")) {
      cleanPhone = cleanPhone.slice(3);
    } else if (cleanPhone.startsWith("91") && cleanPhone.length > 10) {
      cleanPhone = cleanPhone.slice(2);
    }
    cleanPhone = cleanPhone.replace(/\D/g, "");

    const response = await adminAxiosInstance.post(endpoint, {
      phone_number: cleanPhone,
    });

    return {
      status: response.data?.status ?? true,
      message: response.data?.message ?? "OTP sent successfully.",
      authToken: response.data?.data?.authToken || response.data?.data?.token,
    };
  } catch (error) {
    let errorMsg = "Failed to send OTP.";
    if (axios.isAxiosError(error)) {
      errorMsg = error.response?.data?.message || error.message || errorMsg;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    return {
      status: false,
      message: errorMsg,
    };
  }
}

/**
 * Complete admin or super admin password reset using OTP and pre-verify token
 */
export async function resetAdminPassword(
  otp: string,
  newPassword: string,
  role: string,
  authToken: string
): Promise<{ status: boolean; message: string }> {
  try {
    const endpoint =
      role.toLowerCase() === "super_admin"
        ? "/super-admin/reset-password"
        : "/admin/reset-password";

    const response = await adminAxiosInstance.post(
      endpoint,
      {
        otp,
        new_password: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return {
      status: response.data?.status ?? true,
      message: response.data?.message ?? "Password reset successfully.",
    };
  } catch (error) {
    let errorMsg = "Failed to reset password.";
    if (axios.isAxiosError(error)) {
      errorMsg = error.response?.data?.message || error.message || errorMsg;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    return {
      status: false,
      message: errorMsg,
    };
  }
}
