// src/features/auth/hooks/useAuth.ts
import { useEffect } from "react";
import {
  getToken,
  setToken as saveToken,
  clearToken,
  getUser,
  setUser as saveUser,
  clearUser,
} from "@/utils/storage";
import { loginRequest, registerUsuarioRequest } from "../api/authApi";
import type { LoginPayload } from "@/features/auth/types/auth.type";
import type { UsuarioAuth } from "@/features/auth/types/usuario.type";
import type { RegisterUsuarioPayload } from "../types/RegisterUsuarioPayload";
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

  const applyAuth = (usuario: UsuarioAuth, accessToken: string) => {
    saveToken(accessToken);
    saveUser(usuario);
    setAuth(usuario, accessToken);
  };

  const login = async (payload: LoginPayload): Promise<UsuarioAuth> => {
    startLoading();
    try {
      const res = await loginRequest(payload);

      if (res.success && res.data.accessToken) {
        applyAuth(res.data.usuario, res.data.accessToken);
        return res.data.usuario;
      }

      throw new Error("Respuesta de login inválida.");
    } finally {
      stopLoading();
    }
  };

  const register = async (
    payload: RegisterUsuarioPayload
  ): Promise<UsuarioAuth> => {
    startLoading();
    try {
      const res = await registerUsuarioRequest(payload);

      if (res.success && res.data.accessToken) {
        applyAuth(res.data.usuario as UsuarioAuth, res.data.accessToken);
        return res.data.usuario as UsuarioAuth;
      }

      throw new Error("Respuesta de registro inválida.");
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

  const isAdmin = () => hasRole("ADMIN");
  const isStaff = () => hasRole("STAFF") || isAdmin();
  const canModerate = () => isAdmin() || isStaff();

  return {
    initializing,
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    isStaff,
    canModerate,
  };
};
