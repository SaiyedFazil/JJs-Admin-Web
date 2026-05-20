/**
 * Admin Authentication Token Management
 * Handles admin access token, refresh token storage and automatic token refresh
 * Completely separate from user authentication to prevent conflicts
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { processQueue as processQueueItems, type QueueItem } from "@/lib/auth-shared/token-utils";

// Single localStorage key for all admin auth data (grouped storage)
const ADMIN_AUTH_DATA_KEY = "adminAuthData";

// Type definition for the admin auth data stored in localStorage
interface AdminAuthData {
  accessToken: string;
  refreshToken: string;
  role: "ADMIN" | "SUPER_ADMIN";
  email: string;
  name: string;
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
 * Get the complete admin auth data from localStorage
 */
function getAdminAuthData(): AdminAuthData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(ADMIN_AUTH_DATA_KEY);
    if (data) {
      try {
        return JSON.parse(data) as AdminAuthData;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Store admin auth data in localStorage as a single grouped object
 */
function setAdminAuthData(data: Partial<AdminAuthData>): void {
  if (typeof window !== "undefined") {
    const existingData = getAdminAuthData() || {
      accessToken: "",
      refreshToken: "",
      role: "ADMIN" as const,
      email: "",
      name: "",
    };
    const newData = { ...existingData, ...data };
    localStorage.setItem(ADMIN_AUTH_DATA_KEY, JSON.stringify(newData));
  }
}

/**
 * Store admin authentication tokens in localStorage
 */
export function storeAdminAuthTokens(accessToken: string, refreshToken: string): void {
  setAdminAuthData({ accessToken, refreshToken });
}

/**
 * Get admin access token from localStorage
 */
export function getAdminAccessToken(): string | null {
  const data = getAdminAuthData();
  return data?.accessToken || null;
}

/**
 * Get admin refresh token from localStorage
 */
export function getAdminRefreshToken(): string | null {
  const data = getAdminAuthData();
  return data?.refreshToken || null;
}

/**
 * Clear all admin authentication data from localStorage
 */
export function clearAdminAuthTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_AUTH_DATA_KEY);
  }
}

/**
 * Store admin role in localStorage
 */
export function storeAdminRole(role: "ADMIN" | "SUPER_ADMIN"): void {
  setAdminAuthData({ role });
}

/**
 * Get admin role from localStorage
 */
export function getAdminRole(): "ADMIN" | "SUPER_ADMIN" | null {
  const data = getAdminAuthData();
  if (data?.role === "ADMIN" || data?.role === "SUPER_ADMIN") {
    return data.role;
  }
  return null;
}

/**
 * Store admin email in localStorage
 */
export function storeAdminEmail(email: string): void {
  setAdminAuthData({ email });
}

/**
 * Get admin email from localStorage
 */
export function getAdminEmail(): string | null {
  const data = getAdminAuthData();
  return data?.email || null;
}

/**
 * Store admin name in localStorage
 */
export function storeAdminName(name: string): void {
  setAdminAuthData({ name });
}

/**
 * Get admin name from localStorage
 */
export function getAdminName(): string | null {
  const data = getAdminAuthData();
  return data?.name || null;
}

/**
 * Check if admin is authenticated (has tokens)
 */
export function isAdminAuthenticated(): boolean {
  return !!getAdminAccessToken() && !!getAdminRefreshToken();
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
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.tokens) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

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
  const PUBLIC_ENDPOINTS = ["/auth/admin/login"];

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
        if (originalRequest.url?.includes("/auth/refresh")) {
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
              window.location.href = "/admin/login";
            }

            return Promise.reject(error);
          }
        } catch (refreshError) {
          processAdminQueue(refreshError as Error, null);
          clearAdminAuthTokens();

          if (typeof window !== "undefined") {
            window.location.href = "/admin/login";
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
          window.location.href = "/admin/login";
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
    window.location.href = "/admin/login";
  }
}
