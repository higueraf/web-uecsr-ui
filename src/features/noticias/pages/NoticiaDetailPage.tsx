// NoticiaDetailPage.tsx (completo y corregido)
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getNoticiaPublicById,
  type Noticia,
} from "@/features/noticias/api/noticiasApi";
import { ArrowLeft } from "lucide-react";
import { NoticiaComentarios } from "../components/NoticiaComentario";

const resolveImage = (url?: string) =>
  url ? import.meta.env.VITE_API_URL + url : undefined;

export const NoticiaDetailPage = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState<Noticia | null>(null);

  useEffect(() => {
    if (!id) return;
    getNoticiaPublicById(Number(id)).then(setNoticia);
  }, [id]);

  if (!noticia) {
    return (
      <div className="py-10 max-w-3xl mx-auto px-4">
        <p className="text-sm text-slate-500">Cargando noticia...</p>
      </div>
    );
  }

  const fecha = noticia.fechaPublicacion ?? noticia.createdAt;

  return (
    <article className="py-10 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        <Link
          to="/noticias"
          className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={14} />
          Volver a noticias
        </Link>

        <header className="space-y-2">
          <p className="text-xs text-slate-500">
            Publicado el {new Date(fecha).toLocaleDateString()}
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            {noticia.titulo}
          </h1>

          {noticia.resumen && (
            <p className="text-sm text-slate-600">{noticia.resumen}</p>
          )}
        </header>

        {noticia.imagenUrl && (
          <img
            src={resolveImage(noticia.imagenUrl)}
            alt={noticia.titulo}
            className="w-full rounded-xl shadow-sm max-h-[320px] object-cover"
          />
        )}

        <section className="prose prose-sm max-w-none text-slate-800">
          <p className="whitespace-pre-line">{noticia.contenido}</p>
        </section>

        {/* Sección de comentarios */}
        <NoticiaComentarios noticiaId={noticia.id} />
      </div>
    </article> // ← ¡ETIQUETA DE CIERRE AQUÍ!
  );
};