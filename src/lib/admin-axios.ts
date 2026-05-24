/**
 * Admin Axios Instance
 * Separate axios instance for admin API calls with admin-specific token management
 * This ensures admin authentication is completely isolated from user authentication
 */

import axios from "axios";
import { setupAdminAxiosInterceptors, clearAdminAuthTokens } from "@/lib/admin-auth";
import { attachErrorInterceptor } from "@/lib/auth-shared/error-interceptor";

// Create a separate axios instance for admin requests
const adminAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Setup admin token management interceptors (handles auth tokens and auto-refresh)
if (typeof window !== "undefined") {
  setupAdminAxiosInterceptors(adminAxiosInstance);
}

// Attach shared error interceptor for 403, 404 "User not found", 500, and network errors
// (401 is handled by the admin token manager's own interceptor above)
attachErrorInterceptor(adminAxiosInstance, {
  clearTokens: clearAdminAuthTokens,
  loginPath: "/login",
});

export default adminAxiosInstance;
