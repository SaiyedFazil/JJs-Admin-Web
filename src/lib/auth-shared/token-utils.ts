/**
 * Shared Token Utilities
 * Pure utility functions used by both user and admin token managers.
 * These contain no state — they are purely functional helpers.
 */

/**
 * Failed request queue item type
 * Used to queue requests while a token refresh is in progress
 */
export interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

/**
 * Decode JWT token to get payload (without verification)
 * Works for both user and admin tokens — JWT structure is the same.
 */
export function decodeJwt(token: string): { exp?: number; sub?: string; iat?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired or will expire within `bufferSeconds`.
 * @param token - The JWT access token
 * @param bufferSeconds - Pre-expiry buffer in seconds (default: 60)
 * @returns true if the token is expired or missing
 */
export function isTokenExpired(token: string | null, bufferSeconds = 60): boolean {
  if (!token) return true;

  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime + bufferSeconds;
}

/**
 * Process a queue of failed requests after a token refresh completes.
 * Resolves or rejects each queued promise based on the refresh result.
 *
 * @param queue - Array of queued promises (will be emptied)
 * @param error - Error if refresh failed, null if succeeded
 * @param token - New access token if refresh succeeded
 * @returns Empty array (to reassign the queue)
 */
export function processQueue(
  queue: QueueItem[],
  error: Error | null,
  token: string | null = null
): QueueItem[] {
  queue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  return []; // Return empty array for reassignment
}
