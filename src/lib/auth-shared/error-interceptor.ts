/**
 * Shared Axios Error Interceptor
 * Factory function for the response error interceptor used by both
 * user and admin axios instances. The only differences are:
 *   - Which clearTokens() to call
 *   - Which clearNavbarUser() to call (user only)
 *   - Which login path to redirect to
 */

import { AxiosInstance, AxiosError } from "axios";

export interface ErrorInterceptorConfig {
  /** Function to clear authentication tokens */
  clearTokens: () => void;
  /** Function to clear cached navbar user data (optional, user-only) */
  clearNavbarUser?: () => void;
  /** Path to redirect to on 403 or "User not found" 404 */
  loginPath: string;
}

/**
 * Attach a shared response error interceptor to an axios instance.
 * Handles 403 (forbidden), 404 "User not found", 500, and network errors.
 *
 * NOTE: 401 handling is done separately by each token manager's own interceptor.
 * This interceptor explicitly skips 401 to avoid conflicts.
 */
export function attachErrorInterceptor(
  axiosInstance: AxiosInstance,
  config: ErrorInterceptorConfig
): void {
  const { clearTokens, clearNavbarUser, loginPath } = config;

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Only handle non-401 errors (401 is handled by each token manager)
      if (error.response && error.response.status !== 401) {
        switch (error.response.status) {
          case 403:
            // Clear authentication tokens
            clearTokens();
            clearNavbarUser?.();
            // Redirect to login page
            if (typeof window !== "undefined") {
              window.location.href = loginPath;
            }
            break;
          case 404:
            {
              const message = (error.response.data as { message?: string | string[] })?.message;
              const isUserNotFound = Array.isArray(message)
                ? message.includes("User not found")
                : message === "User not found";

              if (isUserNotFound) {
                clearTokens();
                clearNavbarUser?.();
                if (typeof window !== "undefined") {
                  window.location.href = loginPath;
                }
              }
            }
            break;
          case 500:
            console.error("Server error - Please try again later");
            break;
          default:
            console.error(
              "An error occurred:",
              (error.response.data as { message?: string })?.message
            );
        }
      } else if (error.request && !error.response) {
        console.error("Network error - Please check your connection");
      }
      return Promise.reject(error);
    }
  );
}
