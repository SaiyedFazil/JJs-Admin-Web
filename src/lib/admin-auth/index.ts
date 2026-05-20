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
  storeAdminEmail,
  getAdminEmail,
  storeAdminName,
  getAdminName,
  isAdminAuthenticated,
  refreshAdminAuthTokens,
  setupAdminAxiosInterceptors,
  adminLogout,
} from "./admin-token-manager";
