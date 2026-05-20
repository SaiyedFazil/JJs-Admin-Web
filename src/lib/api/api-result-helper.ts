/**
 * API Error Result Helper
 * Utility function to convert handleApiError exceptions to result objects
 * Used for APIs that need to return success/failure instead of throwing
 */

import { handleApiError, ApiErrorMessages } from "./error-handler";

/**
 * Result type for successful API calls
 */
export interface ApiSuccessResult<T = undefined> {
  success: true;
  data?: T;
  message?: string;
}

/**
 * Result type for failed API calls
 */
export interface ApiErrorResult {
  success: false;
  message: string;
}

/**
 * Combined result type for API calls
 */
export type ApiResult<T = undefined> = ApiSuccessResult<T> | ApiErrorResult;

/**
 * Alias for ApiResult to maintain compatibility across the codebase
 */
export type APIResult<T = undefined> = ApiResult<T>;

/**
 * Handle API error and return as a result object instead of throwing
 * Use this when you need to return { success: false, message: "..." } pattern
 *
 * @param error - The error from axios
 * @param customMessages - Optional custom error messages per status code
 * @returns ApiErrorResult with success: false and error message
 */
export function handleApiErrorAsResult(
  error: unknown,
  customMessages: ApiErrorMessages = {}
): ApiErrorResult {
  try {
    handleApiError(error, customMessages);
    // This line is never reached since handleApiError always throws
    return { success: false, message: "An unexpected error occurred" };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "An unexpected error occurred",
    };
  }
}
