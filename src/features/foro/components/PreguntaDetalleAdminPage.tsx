import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPreguntaByIdAdmin, updatePreguntaAdmin } from "../api/foroApi";
import { ForoCategoryBadge } from "../components/ForoCategoryBadge";
import { RespuestasAdminPanel } from "../components/RespuestasAdminPanel";

export const PreguntaDetalleAdminPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pregunta, setPregunta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [respuestaAdmin, setRespuestaAdmin] = useState("");

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getPreguntaByIdAdmin(parseInt(id));
      setPregunta(data);
      setTitulo(data.titulo);
      setContenido(data.contenido);
      setRespuestaAdmin(data.respuestaAdmin || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    await updatePreguntaAdmin(id, {
      titulo,
      contenido,
      respuestaAdmin: respuestaAdmin || undefined,
    });

    setEditMode(false);
    load();
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!pregunta) {
    return <div className="p-6">Pregunta no encontrada</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalle de Pregunta</h1>
        <button
          onClick={() => navigate("/admin/foro")}
          className="text-sm text-blue-600 hover:underline"
        >
          Volver
        </button>
      </div>

      {editMode ? (
        <form onSubmit={save} className="bg-white rounded-lg shadow p-6 space-y-4">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="w-full border rounded p-2 min-h-[120px]"
            required
          />

          <textarea
            value={respuestaAdmin}
            onChange={(e) => setRespuestaAdmin(e.target.value)}
            className="w-full border rounded p-2 min-h-[100px]"
            placeholder="Respuesta oficial (opcional)"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 space-y-3">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-semibold">{pregunta.titulo}</h2>
              <ForoCategoryBadge categoria={pregunta.categoria} />
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Editar
            </button>
          </div>

          <p className="text-gray-700">{pregunta.contenido}</p>

          {pregunta.respuestaAdmin && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <div className="font-semibold mb-1">Respuesta oficial</div>
              <p>{pregunta.respuestaAdmin}</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Respuestas</h3>
        <RespuestasAdminPanel preguntaId={parseInt(id!)} />
      </div>
    </div>
  );
};
