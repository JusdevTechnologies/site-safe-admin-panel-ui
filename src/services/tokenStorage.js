/**
 * Token Storage — centralised localStorage management for auth state.
 * All keys are namespaced to avoid collisions with other app data.
 */

const KEYS = {
  ACCESS_TOKEN: 'sitesafe_access_token',
  REFRESH_TOKEN: 'sitesafe_refresh_token',
  USER: 'sitesafe_user',
  EXPIRES_AT: 'sitesafe_expires_at',
};

const tokenStorage = {
  /**
   * Persist a full auth session (called after login or token refresh).
   * Only non-null values overwrite existing storage entries.
   */
  setSession: ({ access_token, refresh_token, expires_in, user } = {}) => {
    if (access_token) localStorage.setItem(KEYS.ACCESS_TOKEN, access_token);
    if (refresh_token) localStorage.setItem(KEYS.REFRESH_TOKEN, refresh_token);
    if (expires_in) {
      localStorage.setItem(
        KEYS.EXPIRES_AT,
        String(Date.now() + expires_in * 1_000)
      );
    }
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  /** Update only access token (e.g. after a silent refresh). */
  updateAccessToken: (access_token, expires_in) => {
    localStorage.setItem(KEYS.ACCESS_TOKEN, access_token);
    if (expires_in) {
      localStorage.setItem(
        KEYS.EXPIRES_AT,
        String(Date.now() + expires_in * 1_000)
      );
    }
  },

  getAccessToken: () => localStorage.getItem(KEYS.ACCESS_TOKEN),

  getRefreshToken: () => localStorage.getItem(KEYS.REFRESH_TOKEN),

  getUser: () => {
    const raw = localStorage.getItem(KEYS.USER);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /** Returns true when the stored access token is within 60 s of expiry. */
  isTokenExpired: () => {
    const expiresAt = localStorage.getItem(KEYS.EXPIRES_AT);
    if (!expiresAt) return false;
    return Date.now() > parseInt(expiresAt, 10) - 60_000;
  },

  isAuthenticated: () => !!localStorage.getItem(KEYS.ACCESS_TOKEN),

  /** Remove all auth-related keys from localStorage. */
  clear: () => Object.values(KEYS).forEach((k) => localStorage.removeItem(k)),
};

export default tokenStorage;
