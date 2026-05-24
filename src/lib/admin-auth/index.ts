/**
 * Admin Auth Utilities - Index
 * Central export for all admin authentication utilities
 */

export {
  storeAdminAuthTokens,
  getAdminAccessToken,
  getAdminRefreshToken,
  clearAdminAuthTokens,
  storeAdminRole,
  getAdminRole,
  storeAdminName,
  getAdminName,
  storeAdminPhoneNumber,
  getAdminPhoneNumber,
  isAdminAuthenticated,
  refreshAdminAuthTokens,
  setupAdminAxiosInterceptors,
  adminLogout,
} from "./admin-token-manager";
