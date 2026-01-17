import { apiClient } from "@/services/apiClient";

export type EstadoRespuestaAdmin = "PENDIENTE" | "APROBADA" | "RECHAZADA" | "OCULTA";

export interface RespuestaForoPublic {
  id: number;
  contenido: string;
  estado: EstadoRespuestaAdmin;
  preguntaId: number;
  creadoEn: string;
  actualizadoEn: string;
  autorNombre: string;
}

export interface RespuestaForoAdmin extends RespuestaForoPublic {
  autorEmail?: string;
  usuarioId?: number;
}

export interface CreateRespuestaPayload {
  contenido: string;
  preguntaId: number;
}

export const getRespuestasByPregunta = async (preguntaId: number, page = 1, limit = 50) => {
  const res = await apiClient.get(`/respuestas-foro/pregunta/${preguntaId}`, { params: { page, limit } });
  return res.data.data;
};

export const getRespuestasAdminByPregunta = async (preguntaId: number, page = 1, limit = 50) => {
  const res = await apiClient.get(`/respuestas-foro/pregunta/${preguntaId}/admin`, { params: { page, limit } });
  return res.data.data;
};

export const createRespuesta = async (payload: CreateRespuestaPayload) => {
  const res = await apiClient.post("/respuestas-foro", payload);
  return res.data;
};

export const updateRespuestaEstado = async (id: number, estado: EstadoRespuestaAdmin) => {
  const res = await apiClient.put(`/respuestas-foro/${id}/estado`, { estado });
  return res.data;
};

export const toggleOcultaRespuesta = async (id: number) => {
  const res = await apiClient.put(`/respuestas-foro/${id}/toggle-oculta`);
  return res.data;
};

export const deleteRespuesta = async (id: number) => {
  return apiClient.delete(`/respuestas-foro/${id}`);
};
