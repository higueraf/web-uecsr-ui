import { apiClient } from "@/services/apiClient";
import type { LoginPayload } from "@/features/auth/types/auth.type";
import type { LoginResponse } from "@/features/auth/types/response.type";
import type { RegisterUsuarioPayload } from "../types/RegisterUsuarioPayload";

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    usuario: {
      id: number;
      nombres: string;
      apellidos: string;
      email: string;
      rol: "ADMIN" | "STAFF" | "PUBLICO";
    };
  };
}

export const loginRequest = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
};

export const registerUsuarioRequest = async (
  payload: RegisterUsuarioPayload
): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>("/auth/register", {
    nombres: payload.nombres,
    apellidos: payload.apellidos,
    email: payload.email,
    contrasena: payload.contrasena,
  });
  return data;
};
