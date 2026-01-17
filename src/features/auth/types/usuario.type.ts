// src/features/auth/types/usuario.type.ts
export type RolUsuario = "ADMIN" | "PUBLICO";

export interface UsuarioAuth {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: RolUsuario;
}
