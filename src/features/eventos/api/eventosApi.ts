import { apiClient } from "@/services/apiClient";

export type EstadoEvento = "PROGRAMADO" | "EN_CURSO" | "FINALIZADO" | "CANCELADO";
export type CategoriaEvento =
  | "ACADÉMICO"
  | "CULTURAL"
  | "DEPORTES"
  | "ADMISIONES"
  | "AMBIENTAL"
  | "GENERAL";

export interface Evento {
  id: number;
  titulo: string;
  resumen: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string | null;
  lugar: string;
  estado: EstadoEvento;
  categoria: CategoriaEvento;
  imagenUrl?: string;
  orden: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface EventoPayload {
  titulo: string;
  resumen: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string;
  lugar: string;
  estado: EstadoEvento;
  categoria: CategoriaEvento;
  orden: number;
  imagen?: File | null;
}

export interface EventosListResponse {
  data: Evento[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const adaptListResponse = (raw: any, page: number = 1): EventosListResponse => {
  const backend = raw?.data ?? {};
  const items = Array.isArray(backend.items) ? backend.items : [];
  const metaRaw = backend.meta ?? {};
  const meta = {
    page: metaRaw.currentPage ?? page,
    limit: metaRaw.itemsPerPage ?? metaRaw.limit ?? 10,
    total: metaRaw.totalItems ?? metaRaw.total ?? 0,
    totalPages: metaRaw.totalPages ?? 1,
  };
  return { data: items, meta };
};

export const getEventosAdmin = async (
  page = 1,
  search = ""
): Promise<EventosListResponse> => {
  const res = await apiClient.get("/eventos/admin", { params: { page, search } });
  return adaptListResponse(res.data, page);
};

export const getEventosPublic = async (
  page = 1,
  search = "",
  categoria = "",
  limit = 10
): Promise<EventosListResponse> => {
  const params: any = { page, search, limit };
  if (categoria && categoria !== "TODAS") params.categoria = categoria;
  const res = await apiClient.get("/eventos/publico", { params });
  return adaptListResponse(res.data, page);
};

export const getEventoById = async (id: number): Promise<Evento> => {
  const res = await apiClient.get(`/eventos/${id}`);
  return res.data.data ?? res.data;
};

export const getEventoPublicById = async (id: number): Promise<Evento> => {
  return getEventoById(id);
};

export const createEvento = async (data: EventoPayload) => {
  const form = new FormData();
  form.append("titulo", data.titulo);
  form.append("resumen", data.resumen);
  if (data.descripcion) form.append("descripcion", data.descripcion);
  form.append("fechaInicio", data.fechaInicio);
  if (data.fechaFin) form.append("fechaFin", data.fechaFin);
  form.append("lugar", data.lugar);
  form.append("estado", data.estado);
  form.append("categoria", data.categoria);
  form.append("orden", String(data.orden));
  if (data.imagen) form.append("imagen", data.imagen);

  const res = await apiClient.post("/eventos", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data ?? res.data;
};

export const updateEvento = async (id: number, data: EventoPayload) => {
  const form = new FormData();
  form.append("titulo", data.titulo);
  form.append("resumen", data.resumen);
  if (data.descripcion) form.append("descripcion", data.descripcion);
  form.append("fechaInicio", data.fechaInicio);
  if (data.fechaFin) form.append("fechaFin", data.fechaFin);
  form.append("lugar", data.lugar);
  form.append("estado", data.estado);
  form.append("categoria", data.categoria);
  form.append("orden", String(data.orden));
  if (data.imagen) form.append("imagen", data.imagen);

  const res = await apiClient.put(`/eventos/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data ?? res.data;
};

export const deleteEvento = async (id: number) => {
  return apiClient.delete(`/eventos/${id}`);
};

export interface EventoComentario {
  id: number;
  contenido: string;
  aprobado: boolean;
  creadoEn: string;
  actualizadoEn: string;
  usuario: {
    id: number;
    nombre: string;
  };
}

export interface EventoComentarioPayload {
  contenido: string;
}

export const getEventoComentarios = async (
  eventoId: number,
  soloAprobados: boolean = true
): Promise<EventoComentario[]> => {
  const res = await apiClient.get(`/eventos-comentarios/${eventoId}`, {
    params: { soloAprobados },
  });

  const data = res.data?.data ?? res.data;
  return Array.isArray(data) ? data : [];
};

export const createEventoComentario = async (
  eventoId: number,
  payload: EventoComentarioPayload
): Promise<EventoComentario> => {
  const res = await apiClient.post(`/eventos-comentarios/${eventoId}`, payload);
  return res.data?.data ?? res.data;
};

export const deleteEventoComentario = async (
  eventoId: number,
  comentarioId: number
): Promise<void> => {
  await apiClient.delete(`/eventos-comentarios/${eventoId}/${comentarioId}`);
};

export const toggleAprobarEventoComentario = async (
  eventoId: number,
  comentarioId: number
): Promise<EventoComentario> => {
  const res = await apiClient.put(`/eventos-comentarios/${eventoId}/${comentarioId}/aprobar`);
  return res.data?.data ?? res.data;
};
