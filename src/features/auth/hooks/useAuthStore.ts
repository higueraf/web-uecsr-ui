import { create } from "zustand";
import type { UsuarioAuth } from "@/features/auth/types/usuario.type";

interface AuthState {
  user: UsuarioAuth | null;
  token: string | null;
  isAuthenticated: boolean;
  initializing: boolean;
  setFromStorage: (user: UsuarioAuth | null, token: string | null) => void;
  setAuth: (user: UsuarioAuth, token: string) => void;
  clearAuth: () => void;
  setInitializing: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  initializing: true,
  setFromStorage: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: !!token,
    }),
  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),
  clearAuth: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
  setInitializing: (value) => set({ initializing: value }),
}));
