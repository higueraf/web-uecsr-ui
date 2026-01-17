import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getEventoPublicById, type Evento } from "@/features/eventos/api/eventosApi";
import { EventoComentarios } from "../components/EventoComentarios";

const resolveImage = (url?: string) =>
  url
    ? import.meta.env.VITE_API_URL + (url.startsWith("/") ? url : `/${url}`)
    : undefined;

export const EventoDetailPage = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState<Evento | null>(null);

  useEffect(() => {
    if (!id) return;
    getEventoPublicById(Number(id)).then(setEvento);
  }, [id]);

  if (!evento) {
    return (
      <div className="py-10 max-w-3xl mx-auto px-4">
        <p className="text-sm text-slate-500">Cargando evento...</p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        <Link
          to="/eventos"
          className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={14} />
          Volver a eventos
        </Link>

        <header className="space-y-2">
          <p className="text-xs font-semibold text-brand-700">
            {new Date(evento.fechaInicio).toLocaleDateString()}
            {evento.fechaFin && ` - ${new Date(evento.fechaFin).toLocaleDateString()}`}
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{evento.titulo}</h1>
          <p className="text-xs text-slate-500">Lugar: {evento.lugar}</p>
        </header>

        {evento.imagenUrl && (
          <img
            src={resolveImage(evento.imagenUrl)}
            alt={evento.titulo}
            className="w-full rounded-xl shadow-sm max-h-[320px] object-cover"
          />
        )}

        {evento.descripcion && (
          <p className="text-sm text-slate-700 whitespace-pre-line">{evento.descripcion}</p>
        )}

        <section className="mt-12 pt-8 border-t">
          <EventoComentarios eventoId={evento.id} />
        </section>
      </div>
    </section>
  );
};
