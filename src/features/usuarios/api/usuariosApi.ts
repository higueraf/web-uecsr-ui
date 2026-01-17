import { apiClient } from "@/services/apiClient";

export type RolUsuario = "ADMIN" | "STAFF" | "PUBLICO";

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface UsuarioAdminListResponse {
  items: Usuario[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links?: any;
}

export interface CreateUsuarioPayload {
  nombres: string;
  apellidos: string;
  email: string;
  contrasena: string;
  rol?: RolUsuario;
  activo?: boolean;
}

export interface UpdateUsuarioPayload {
  nombres?: string;
  apellidos?: string;
  email?: string;
  contrasena?: string;
  rol?: RolUsuario;
  activo?: boolean;
}

export const getUsuariosAdmin = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}) => {
  const res: any = await apiClient.get<UsuarioAdminListResponse>("/usuarios/admin", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      search: params.search ?? "",
      sort: params.sort,
      order: params.order,
    },
  });
  return res.data.data
};

export const getUsuarioById = async (id: number) => {
  const res: any = await apiClient.get<Usuario>(`/usuarios/${id}`);
  return res.data.data;
};

export const createUsuario = async (payload: CreateUsuarioPayload) => {
  const res: any = await apiClient.post<Usuario>("/usuarios", payload);
  return res.data.data
};

export const updateUsuario = async (id: number, payload: UpdateUsuarioPayload) => {
  const res: any = await apiClient.put<Usuario>(`/usuarios/${id}`, payload);
  return res.data.data
};

export const deleteUsuario = async (id: number) => {
  const res: any = await apiClient.delete<void>(`/usuarios/${id}`);
  return res.data.data
};
