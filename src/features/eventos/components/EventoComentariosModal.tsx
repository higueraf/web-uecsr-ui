import { useEffect, useMemo, useState } from "react";
import {
  deleteEventoComentario,
  getEventoComentarios,
  toggleAprobarEventoComentario,
  type EventoComentario,
} from "@/features/eventos/api/eventosApi";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  eventoId: number;
  onChanged?: () => void;
};

export function EventoComentariosModal({ open, onOpenChange, eventoId, onChanged }: Props) {
  const [soloAprobados, setSoloAprobados] = useState(false);
  const [items, setItems] = useState<EventoComentario[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getEventoComentarios(eventoId, soloAprobados);
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    load();
  }, [open, eventoId, soloAprobados]);

  const pendientes = useMemo(() => items.filter((i) => !i.aprobado).length, [items]);

  const getAutor = (c: EventoComentario) => {
    if (c?.usuario) {
      const n = c.usuario.nombres ?? c.usuario.nombres ?? "";
      const a = c.usuario.apellidos ?? "";
      const full = `${n} ${a}`.trim();
      return full || "Anónimo";
    }
    return "Anónimo";
  };

  const getFecha = (c: EventoComentario) => {
    const raw = c.created_at ?? c.createdAt ?? c.creadoEn;
    return raw ? new Date(raw).toLocaleString() : "-";
  };

  const toggle = async (comentarioId: number) => {
    await toggleAprobarEventoComentario(eventoId, comentarioId);
    await load();
    onChanged?.();
  };

  const remove = async (comentarioId: number) => {
    if (!confirm("¿Eliminar comentario?")) return;
    await deleteEventoComentario(eventoId, comentarioId);
    await load();
    onChanged?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="absolute left-1/2 top-1/2 w-[min(900px,calc(100%-24px))] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Comentarios</h2>
            <p className="text-sm text-slate-500">Pendientes: {pendientes}</p>
          </div>
          <button
            className="px-3 py-1 border rounded-lg text-sm hover:bg-slate-50"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={soloAprobados}
              onChange={(e) => setSoloAprobados(e.target.checked)}
            />
            Mostrar solo aprobados
          </label>

          <button className="px-3 py-1 border rounded-lg text-sm hover:bg-slate-50" onClick={load}>
            Recargar
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-auto">
          {loading ? (
            <p className="text-sm text-slate-500">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-slate-500">No hay comentarios para mostrar.</p>
          ) : (
            <div className="space-y-3">
              {items.map((c) => (
                <div key={c.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-medium text-slate-900">{getAutor(c)}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{getFecha(c)}</span>
                        <span className="text-slate-400">·</span>
                        <span className={c.aprobado ? "text-emerald-700" : "text-amber-700"}>
                          {c.aprobado ? "Aprobado" : "Pendiente"}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-800 whitespace-pre-wrap">{c.contenido}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        className="px-3 py-1 border rounded-lg text-xs hover:bg-slate-50"
                        onClick={() => toggle(c.id)}
                      >
                        {c.aprobado ? "Desaprobar" : "Aprobar"}
                      </button>
                      <button
                        className="px-3 py-1 border rounded-lg text-xs hover:bg-slate-50"
                        onClick={() => remove(c.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg border text-sm hover:bg-white"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
