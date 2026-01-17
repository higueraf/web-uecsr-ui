import { useEffect, useState } from "react";
import {
  deleteRespuesta,
  getRespuestasAdminByPregunta,
  toggleOcultaRespuesta,
  updateRespuestaEstado,
  type EstadoRespuestaAdmin,
  type RespuestaForoAdmin,
} from "../api/respuestasApi";

export const RespuestasAdminPanel = ({ preguntaId }: { preguntaId: number }) => {
  const [items, setItems] = useState<RespuestaForoAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getRespuestasAdminByPregunta(preguntaId, 1, 100);
      setItems(Array.isArray(data?.items) ? data.items : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [preguntaId]);

  const setEstado = async (id: number, estado: EstadoRespuestaAdmin) => {
    await updateRespuestaEstado(id, estado);
    await load();
  };

  const toggle = async (id: number) => {
    await toggleOcultaRespuesta(id);
    await load();
  };

  const del = async (id: number) => {
    if (!confirm("¿Eliminar esta respuesta?")) return;
    await deleteRespuesta(id);
    await load();
  };

  if (loading) return <div className="py-4 text-center">Cargando respuestas...</div>;

  if (!items.length) return <div className="py-4 text-center text-slate-500">No hay respuestas para esta pregunta.</div>;

  return (
    <div className="space-y-4">
      {items.map((r) => (
        <div key={r.id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start gap-3">
            <div>
              <div className="font-medium">{r.autorNombre}</div>
              <div className="text-xs text-gray-500">{r.autorEmail}</div>
              <div className="text-xs text-gray-500">{new Date(r.creadoEn).toLocaleString()}</div>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <button className="px-3 py-1 border rounded text-sm" onClick={() => setEstado(r.id, "APROBADA")}>
                Aprobar
              </button>
              <button className="px-3 py-1 border rounded text-sm" onClick={() => setEstado(r.id, "RECHAZADA")}>
                Rechazar
              </button>
              <button className="px-3 py-1 border rounded text-sm" onClick={() => toggle(r.id)}>
                Mostrar/Ocultar
              </button>
              <button className="px-3 py-1 border rounded text-sm text-red-600" onClick={() => del(r.id)}>
                Eliminar
              </button>
            </div>
          </div>

          <div className="mt-3 whitespace-pre-line text-gray-700">{r.contenido}</div>
          <div className="mt-2 text-xs text-gray-600">Estado: {r.estado}</div>
        </div>
      ))}
    </div>
  );
};
