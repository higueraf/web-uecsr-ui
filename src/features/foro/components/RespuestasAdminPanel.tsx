import { useEffect, useState } from "react";
import { deleteRespuesta, getRespuestasAdminByPregunta, toggleOcultaRespuesta, updateRespuestaEstado } from "../api/respuestasApi";
import type { EstadoRespuestaAdmin } from "../api/respuestasApi";

export const RespuestasAdminPanel = ({ preguntaId }: { preguntaId: number }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getRespuestasAdminByPregunta(preguntaId, 1, 100);
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [preguntaId]);

  const setEstado = async (id: number, estado: EstadoRespuestaAdmin) => {
    await updateRespuestaEstado(id, estado);
    load();
  };

  const toggle = async (id: number) => {
    await toggleOcultaRespuesta(id);
    load();
  };

  const del = async (id: number) => {
    if (!confirm("¿Eliminar esta respuesta?")) return;
    await deleteRespuesta(id);
    load();
  };

  if (loading) return <div className="py-4 text-center">Cargando respuestas...</div>;

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

            <div className="flex gap-2">
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
