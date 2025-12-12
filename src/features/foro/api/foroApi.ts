import { apiClient } from "@/services/apiClient";

export type ForoCategoria = "NOTICIA" | "EVENTO" | "ADMISION" | "INFORMACION" | "OTRO";
export type ForoEstadoAdmin = "NUEVA" | "APROBADA" | "RECHAZADA" | "OCULTA";

export interface ForoPreguntaPublic {
  id: string;
  titulo: string;
  contenido: string;
  categoria: ForoCategoria;
  autorNombre: string;
  createdAt: string;
  respuestasCount: number;
  respuestaAdmin?: string;
  referenciaId?: number;
}

export interface ForoPreguntaAdmin extends ForoPreguntaPublic {
  estado: ForoEstadoAdmin;
  autorEmail?: string;
}

export interface ForoPreguntaPayloadPublic {
  titulo: string;
  contenido: string;
  categoria: ForoCategoria;
  referenciaId?: number;
}

export interface ForoPreguntaPayloadAdmin extends ForoPreguntaPayloadPublic {
  estado?: ForoEstadoAdmin;
  respuestaAdmin?: string;
}

export const getForoPublic = async (page = 1, search = "", categoria?: ForoCategoria) => {
  const res = await apiClient.get("/preguntas-foro/public", {
    params: { page, limit: 20, search, categoria },
  });
  return res.data.data;
};

export const getForoAdmin = async (page = 1, search = "", categoria?: ForoCategoria, estado?: ForoEstadoAdmin) => {
  const res = await apiClient.get("/preguntas-foro/admin", {
    params: { page, limit: 20, search, categoria, estado },
  });
  return res.data.data;
};

export const getPreguntaByIdPublic = async (id: number) => {
  const res = await apiClient.get(`/preguntas-foro/${id}`);
  return res.data;
};

export const getPreguntaByIdAdmin = async (id: number) => {
  const res = await apiClient.get(`/preguntas-foro/${id}/admin`);
  return res.data;
};

export const createPreguntaPublic = async (payload: ForoPreguntaPayloadPublic) => {
  const res = await apiClient.post("/preguntas-foro/public", payload);
  return res.data;
};

export const createPreguntaAdmin = async (payload: ForoPreguntaPayloadAdmin) => {
  const res = await apiClient.post("/preguntas-foro/admin", payload);
  return res.data;
};

export const updatePreguntaAdmin = async (id: string, payload: Partial<ForoPreguntaPayloadAdmin>) => {
  const res = await apiClient.put(`/preguntas-foro/${id}`, payload);
  return res.data;
};

export const deletePregunta = async (id: string) => {
  return apiClient.delete(`/preguntas-foro/${id}`);
};

export const toggleOcultaPregunta = async (id: string) => {
  const res = await apiClient.put(`/preguntas-foro/${id}/toggle-oculta`);
  return res.data;
};
