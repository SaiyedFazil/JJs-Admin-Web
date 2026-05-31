/**
 * Admin Authentication Token Management
 * Handles admin access token, refresh token storage and automatic token refresh
 * Completely separate from user authentication to prevent conflicts
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { processQueue as processQueueItems, type QueueItem } from "@/lib/auth-shared/token-utils";
import { EnumRole } from "@/components/common/constants";

// Cookie helper: Set a cookie
function setAdminCookie(name: string, value: string, days = 30): void {
  if (typeof document === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  const isSecure = window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax${secureFlag}`;
}

// Cookie helper: Get a cookie
function getAdminCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
}

// Cookie helper: Delete a cookie
function deleteAdminCookie(name: string): void {
  if (typeof document === "undefined") return;
  const isSecure = window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${secureFlag}`;
}

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Flag to prevent multiple refresh attempts
let isAdminRefreshing = false;
let adminFailedQueue: QueueItem[] = [];

/**
 * Process the queue of failed admin requests after token refresh
 */
const processAdminQueue = (error: Error | null, token: string | null = null) => {
  adminFailedQueue = processQueueItems(adminFailedQueue, error, token);
};

/**
 * Store admin authentication tokens in cookies (1 month expiration)
 */
export function storeAdminAuthTokens(accessToken: string, refreshToken: string): void {
  setAdminCookie("admin_access_token", accessToken, 30);
  setAdminCookie("admin_refresh_token", refreshToken, 30);
}

/**
 * Get admin access token from cookies
 */
export function getAdminAccessToken(): string | null {
  return getAdminCookie("admin_access_token");
}

/**
 * Get admin refresh token from cookies
 */
export function getAdminRefreshToken(): string | null {
  return getAdminCookie("admin_refresh_token");
}

/**
 * Clear all admin authentication cookies
 */
export function clearAdminAuthTokens(): void {
  deleteAdminCookie("admin_access_token");
  deleteAdminCookie("admin_refresh_token");
  deleteAdminCookie("admin_role");
  deleteAdminCookie("admin_name");
  deleteAdminCookie("admin_phone_number");
}

/**
 * Store admin role in cookies (1 month expiration)
 */
export function storeAdminRole(role: string): void {
  setAdminCookie("admin_role", role.toLowerCase(), 30);
}

/**
 * Get admin role from cookies
 */
export function getAdminRole(): EnumRole | null {
  const role = getAdminCookie("admin_role");
  if (role) {
    const lowerRole = role.toLowerCase();
    if (lowerRole === EnumRole.Admin || lowerRole === "admin") {
      return EnumRole.Admin;
    }
    if (
      lowerRole === EnumRole.SuperAdmin ||
      lowerRole === "superadmin" ||
      lowerRole === "super_admin"
    ) {
      return EnumRole.SuperAdmin;
    }
    if (lowerRole === EnumRole.User || lowerRole === "user") {
      return EnumRole.User;
    }
    if (lowerRole === EnumRole.Rider || lowerRole === "rider") {
      return EnumRole.Rider;
    }
    if (lowerRole === EnumRole.Guest || lowerRole === "guest") {
      return EnumRole.Guest;
    }
  }
  return null;
}

/**
 * Store admin name in cookies (1 month expiration)
 */
export function storeAdminName(name: string): void {
  setAdminCookie("admin_name", name, 30);
}

/**
 * Get admin name from cookies
 */
export function getAdminName(): string | null {
  return getAdminCookie("admin_name");
}

/**
 * Store admin phone number in cookies (1 month expiration)
 */
export function storeAdminPhoneNumber(phoneNumber: string): void {
  setAdminCookie("admin_phone_number", phoneNumber, 30);
}

/**
 * Get admin phone number from cookies
 */
export function getAdminPhoneNumber(): string | null {
  return getAdminCookie("admin_phone_number");
}

/**
 * Check if admin is authenticated (has tokens) and is authorized
 */
export function isAdminAuthenticated(): boolean {
  const hasTokens = !!getAdminAccessToken() && !!getAdminRefreshToken();
  if (!hasTokens) return false;

  const role = getAdminRole();
  return role === EnumRole.Admin || role === EnumRole.SuperAdmin;
}

/**
 * Refresh admin authentication tokens
 * Uses refresh token to get new access and refresh tokens
 */
export async function refreshAdminAuthTokens(): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  const refreshToken = getAdminRefreshToken();

  if (!refreshToken) {
    console.error("No admin refresh token available");
    return null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/auth/refresh-token`,
      {
        refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.status && response.data?.data) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      // Store new tokens
      storeAdminAuthTokens(accessToken, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    }

    return null;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      console.error("Admin refresh token expired or invalid");
      clearAdminAuthTokens();
    } else if (axiosError.response?.status === 403) {
      console.error("Security breach detected - all admin sessions terminated");
      clearAdminAuthTokens();
    }

    return null;
  }
}

/**
 * Setup axios interceptors for automatic admin token refresh
 * Call this function once when creating admin axios instance
 */
export function setupAdminAxiosInterceptors(axiosInstance: ReturnType<typeof axios.create>): void {
  // List of public endpoints that don't require authentication
  const PUBLIC_ENDPOINTS = ["/auth/admin/login", "/admin/login", "/user/auth/refresh-token"];

  /**
   * Check if the request URL is a public endpoint
   */
  const isPublicEndpoint = (url: string | undefined): boolean => {
    if (!url) return false;
    return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
  };

  // Request interceptor - Add admin access token to requests (except public endpoints)
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Skip adding token for public endpoints
      if (isPublicEndpoint(config.url)) {
        return config;
      }

      const token = getAdminAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle 401 errors and refresh admin token
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Skip token refresh logic for public endpoints - just pass through errors
      if (isPublicEndpoint(originalRequest.url)) {
        return Promise.reject(error);
      }

      // If error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Check if this is a refresh token request itself (avoid infinite loop)
        if (originalRequest.url?.includes("/user/auth/refresh-token")) {
          clearAdminAuthTokens();
          return Promise.reject(error);
        }

        if (isAdminRefreshing) {
          // If already refreshing, queue this request
          return new Promise<string>((resolve, reject) => {
            adminFailedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isAdminRefreshing = true;

        try {
          const tokens = await refreshAdminAuthTokens();

          if (tokens) {
            processAdminQueue(null, tokens.accessToken);

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            }
            return axiosInstance(originalRequest);
          } else {
            // Refresh failed, redirect to admin login
            processAdminQueue(new Error("Admin token refresh failed"), null);
            clearAdminAuthTokens();

            // Redirect to admin login if in browser
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }

            return Promise.reject(error);
          }
        } catch (refreshError) {
          processAdminQueue(refreshError as Error, null);
          clearAdminAuthTokens();

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        } finally {
          isAdminRefreshing = false;
        }
      }

      // Handle 403 - redirect to admin login
      if (error.response?.status === 403) {
        clearAdminAuthTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );
}

/**
 * Logout admin - Clear tokens and redirect to admin login
 */
export function adminLogout(): void {
  clearAdminAuthTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
