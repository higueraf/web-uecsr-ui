import { useEffect } from "react";
import {
  getToken,
  setToken as saveToken,
  clearToken,
  getUser,
  setUser as saveUser,
  clearUser,
} from "@/utils/storage";
import { loginRequest } from "../api/authApi";
import type { LoginPayload } from "@/features/auth/types/auth.type";
import type { UsuarioAuth } from "@/features/auth/types/usuario.type";
import { useLoadingStore } from "@/store/loadingStore";
import { useAuthStore } from "./useAuthStore";

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    initializing,
    setFromStorage,
    setAuth,
    clearAuth,
    setInitializing,
  } = useAuthStore();

  const startLoading = useLoadingStore((s) => s.startLoading);
  const stopLoading = useLoadingStore((s) => s.stopLoading);

  useEffect(() => {
    if (!initializing) return;
    const storedToken = getToken();
    const storedUser = getUser() as UsuarioAuth | null;
    setFromStorage(storedUser, storedToken);
    setInitializing(false);
  }, [initializing, setFromStorage, setInitializing]);

  const login = async (payload: LoginPayload): Promise<UsuarioAuth> => {
    startLoading();
    try {
      const res = await loginRequest(payload);

      if (res.success && res.data.accessToken) {
        saveToken(res.data.accessToken);
        saveUser(res.data.usuario);
        setAuth(res.data.usuario, res.data.accessToken);
        return res.data.usuario;
      }

      throw new Error("Respuesta de login inválida.");
    } finally {
      stopLoading();
    }
  };

  const logout = () => {
    clearToken();
    clearUser();
    clearAuth();
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    return user.rol === role;
  };

  const isAdmin = () => {
    return hasRole("ADMIN");
  };

  const isStaff = () => {
    return hasRole("STAFF") || isAdmin();
  };

  const canModerate = () => {
    return isAdmin() || isStaff();
  };

  return {
    initializing,
    isAuthenticated,
    user,
    token,
    login,
    logout,
    hasRole,
    isAdmin,
    isStaff,
    canModerate,
  };
};