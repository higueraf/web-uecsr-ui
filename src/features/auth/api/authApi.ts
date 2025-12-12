import { apiClient } from "@/services/apiClient";
import type { LoginPayload } from "@/features/auth/types/auth.type";
import type { LoginResponse } from "@/features/auth/types/response.type";
import type { RegisterUsuarioPayload } from "../types/RegisterUsuarioPayload";

export const loginRequest = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
};

export const registerUsuarioRequest = async (
  payload: RegisterUsuarioPayload
): Promise<void> => {
  await apiClient.post("/auth/register", payload);
};


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    nombres: string;
    apellidos: string;
    rol: 'ADMIN' | 'STAFF' | 'PUBLICO';
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.post('/auth/profile');
  return response.data;
};

export const logout = async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};
