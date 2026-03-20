import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authLogin, authRegister, getCurrentUser } from "../api/apiService.js";
import { clearToken, getToken, isTokenExpired, setToken } from "./token.js";

const AuthContext = createContext(null);

const normalizeAuthResponse = (data) => {
  if (!data) return { token: null, user: null, mustChangePassword: false };
  const token = data.token || data.accessToken || data.jwt || data?.data?.token;
  const user = data.user || data.profile || data?.data?.user || null;
  const mustChangePassword = data.mustChangePassword ?? data?.data?.mustChangePassword ?? false;
  return { token, user, mustChangePassword };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  const loadMe = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      const me = response?.data?.user || response?.data || null;
      setUser(me);
      return me;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  const login = useCallback(
    async (payload) => {
      const response = await authLogin(payload);
      const { token, user: authUser, mustChangePassword } = normalizeAuthResponse(response?.data);
      if (token) {
        setToken(token);
      }
      if (authUser) {
        setUser(authUser);
        return { user: authUser, mustChangePassword };
      }
      const me = await loadMe();
      return { user: me, mustChangePassword };
    },
    [loadMe]
  );

  const register = useCallback(
    async (payload) => {
      const response = await authRegister(payload);
      const { token, user: authUser } = normalizeAuthResponse(response?.data);
      if (token) {
        setToken(token);
      }
      if (authUser) {
        setUser(authUser);
        return authUser;
      }
      return await loadMe();
    },
    [loadMe]
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setBooting(false);
      return;
    }
    if (isTokenExpired(token)) {
      clearToken();
      setBooting(false);
      return;
    }
    loadMe().finally(() => setBooting(false));
  }, [loadMe]);

  const value = useMemo(
    () => ({
      user,
      booting,
      login,
      register,
      logout,
      reloadUser: loadMe
    }),
    [user, booting, login, register, logout, loadMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
