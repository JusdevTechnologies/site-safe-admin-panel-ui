/**
 * Authentication Context
 * Manages auth state, integrates with tokenStorage and authService.
 *
 * Initialisation strategy:
 *  1. Immediately hydrate from localStorage so protected routes render without
 *     a loading flash (stored user is available synchronously).
 *  2. Silently call GET /admin/auth/me to validate the token and refresh the
 *     stored user profile. A 401 from getMe propagates through the axios
 *     interceptor which clears storage and redirects to /login automatically.
 */
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import authService from '../services/authentication';
import tokenStorage from '../services/tokenStorage';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload, isAuthenticated: false };

    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, error: null, isLoading: false };

    case 'INITIALIZE':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false,
      };

    case 'UPDATE_USER':
      return { ...state, user: action.payload };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ─── Initialise on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const storedUser = tokenStorage.getUser();
    const isAuthenticated = tokenStorage.isAuthenticated();

    // Immediately hydrate from cache so pages don't flash the loading screen.
    dispatch({ type: 'INITIALIZE', payload: { user: storedUser, isAuthenticated } });

    // Silently validate token and refresh user profile.
    if (isAuthenticated) {
      authService.getMe().then((freshUser) => {
        dispatch({ type: 'UPDATE_USER', payload: freshUser });
      }).catch(() => {
        // The axios interceptor handles 401 (clears tokens + redirects to /login).
      });
    }
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ username, password }) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user } = await authService.login({ username, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      return { success: true };
    } catch (error) {
      const message = error.message || 'Login failed';
      dispatch({ type: 'LOGIN_ERROR', payload: message });
      return { success: false, error: message };
    }
  }, []);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = { ...state, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default AuthContext;

