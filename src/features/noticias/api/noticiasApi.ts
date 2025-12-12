import { apiClient } from "@/services/apiClient";

export type EstadoNoticia = "BORRADOR" | "PUBLICADO" | "OCULTO";

export interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  resumen?: string;
  contenido: string;
  imagenUrl?: string;
  fechaPublicacion?: string | null;
  estado: EstadoNoticia;
  destacado: boolean;
  orden: number;
  createdAt: string;
}

export interface NoticiaPayload {
  titulo: string;
  slug: string;
  resumen?: string;
  contenido: string;
  imagen?: File | null;
  fechaPublicacion?: string;
  estado: EstadoNoticia;
  destacado: boolean;
  orden: number;
}

export interface NoticiasListResponse {
  data: Noticia[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Adaptador para backend → frontend
const adaptListResponse = (raw: any, page: number = 1): NoticiasListResponse => {
  const backend = raw?.data ?? {};

  const items = Array.isArray(backend.items) ? backend.items : [];
  const metaRaw = backend.meta ?? {};

  const meta = {
    page: metaRaw.currentPage ?? page,
    limit: metaRaw.itemsPerPage ?? metaRaw.limit ?? 10,
    total: metaRaw.totalItems ?? metaRaw.total ?? 0,
    totalPages: metaRaw.totalPages ?? 1,
  };

  return {
    data: items,
    meta,
  };
};

export const getNoticiasAdmin = async (
  page = 1,
  search = ""
): Promise<NoticiasListResponse> => {
  const res = await apiClient.get("/noticias/admin", {
    params: { page, search },
  });

  return adaptListResponse(res.data, page);
};

export const getNoticiasPublic = async (
  page = 1,
  search = ""
): Promise<NoticiasListResponse> => {
  const res = await apiClient.get("/noticias/publico", {
    params: { page, search },
  });

  return adaptListResponse(res.data, page);
};

export const getNoticiaById = async (id: number): Promise<Noticia> => {
  const res = await apiClient.get(`/noticias/${id}`);
  return res.data.data ?? res.data; 
};

export const getNoticiaPublicById = async (id: number): Promise<Noticia> => {
  return getNoticiaById(id);
};

export const createNoticia = async (data: NoticiaPayload) => {
  const form = new FormData();
  form.append("titulo", data.titulo);
  form.append("slug", data.slug);
  if (data.resumen) form.append("resumen", data.resumen);
  form.append("contenido", data.contenido);
  if (data.fechaPublicacion) form.append("fechaPublicacion", data.fechaPublicacion);
  form.append("estado", data.estado);
  form.append("destacado", String(data.destacado));
  form.append("orden", String(data.orden));
  if (data.imagen) form.append("imagen", data.imagen);

  const res = await apiClient.post("/noticias", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

export const updateNoticia = async (id: number, data: NoticiaPayload) => {
  const form = new FormData();
  form.append("titulo", data.titulo);
  form.append("slug", data.slug);
  if (data.resumen) form.append("resumen", data.resumen);
  form.append("contenido", data.contenido);
  if (data.fechaPublicacion) form.append("fechaPublicacion", data.fechaPublicacion);
  form.append("estado", data.estado);
  form.append("destacado", String(data.destacado));
  form.append("orden", String(data.orden));
  if (data.imagen) form.append("imagen", data.imagen);

  const res = await apiClient.put(`/noticias/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

export const deleteNoticia = async (id: number) => {
  return apiClient.delete(`/noticias/${id}`);
};

export const togglePublicarNoticia = async (id: number) => {
  return apiClient.patch(`/noticias/${id}/publicar`);
};


// En noticiasApi.ts (agregar al inicio)
export interface NoticiaComentario {
  id: number;
  contenido: string;
  nombreAutor?: string;
  emailAutor?: string;
  aprobado: boolean;
  creadoEn?: string;
  usuario?: {
    id: number;
    nombre: string;
  };
}

export interface NoticiaComentarioPayload {
  contenido: string;
  nombreAutor?: string;
  emailAutor?: string;
}

// Agregar estas funciones al final del archivo:
export const getNoticiaComentarios = async (
  noticiaId: number,
  soloAprobados: boolean = true
): Promise<NoticiaComentario[]> => {
  const res = await apiClient.get(`/noticias-comentarios/${noticiaId}`, {
    params: { soloAprobados }
  });
  return res.data.data;
};

export const createNoticiaComentario = async (
noticiaId: number, data: { contenido: string; }): Promise<NoticiaComentario> => {
  const res = await apiClient.post(`/noticias-comentarios/${noticiaId}`, data);
  return res.data.data;
};

export const deleteNoticiaComentario = async (
  noticiaId: number,
  comentarioId: number
): Promise<void> => {
  await apiClient.delete(`/noticias-comentarios/${noticiaId}/${comentarioId}`);
};