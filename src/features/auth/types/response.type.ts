// src/features/auth/types/response.type.ts
import type { UsuarioAuth } from "./usuario.type";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    usuario: UsuarioAuth;
  };
}
