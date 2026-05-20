/**
 * Centralized API Error Handler
 * Provides consistent error handling across all API calls
 */

import { AxiosError } from "axios";

/**
 * Custom error messages for specific HTTP status codes
 */
export interface ApiErrorMessages {
  400?: string;
  401?: string;
  403?: string;
  404?: string;
  409?: string;
  429?: string;
  500?: string;
  default?: string;
  network?: string;
}

/**
 * Handle API errors with custom messages per status code
 * @param error - The error object from axios
 * @param customMessages - Optional custom error messages for specific status codes
 * @throws Error with appropriate message
 */
export function handleApiError(error: unknown, customMessages: ApiErrorMessages = {}): never {
  const axiosError = error as AxiosError<{ message: string | string[] }>;

  if (axiosError.response) {
    const { status, data } = axiosError.response;
    let serverMessage = data?.message;

    // Handle array messages (common in some validation errors)
    if (Array.isArray(serverMessage)) {
      serverMessage = serverMessage.join(", ");
    }

    // Build status-specific error messages
    const statusMessages: Record<number, string> = {
      400: customMessages[400] || serverMessage || "Invalid request data",
      401: customMessages[401] || serverMessage || "Unauthorized",
      403: customMessages[403] || serverMessage || "Forbidden",
      404: customMessages[404] || serverMessage || "Resource not found",
      409: customMessages[409] || serverMessage || "Resource already exists",
      429: customMessages[429] || serverMessage || "Too many requests. Please try again later.",
      500: customMessages[500] || serverMessage || "Internal server error. Please try again later.",
    };

    // Get the appropriate error message
    const errorMessage =
      statusMessages[status] || serverMessage || customMessages.default || "Request failed";

    throw new Error(errorMessage);
  }

  // Network error or no response
  throw new Error(customMessages.network || "Network error. Please check your connection.");
}
