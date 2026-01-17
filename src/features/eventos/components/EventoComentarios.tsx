import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createEventoComentario,
  getEventoComentarios,
  type EventoComentario,
} from "@/features/eventos/api/eventosApi";

interface Props {
  eventoId: number;
}

export const EventoComentarios = ({ eventoId }: Props) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [comentarios, setComentarios] = useState<EventoComentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarComentarios();
  }, [eventoId]);

  const cargarComentarios = async () => {
    try {
      const data = await getEventoComentarios(eventoId, true);
      setComentarios(data);
    } finally {
      setLoading(false);
    }
  };

  const redirectLogin = () => {
    navigate("/login", {
      state: {
        from: `/eventos/${eventoId}`,
        message: "Debes iniciar sesión para comentar",
      },
    });
  };

  const handleMostrarFormulario = () => {
    if (!isAuthenticated) return redirectLogin();
    setMostrarFormulario(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return redirectLogin();

    await createEventoComentario(eventoId, { contenido: nuevoComentario });
    setNuevoComentario("");
    setMostrarFormulario(false);
    await cargarComentarios();
  };

  if (loading) {
    return <div className="py-4 text-center text-gray-500">Cargando comentarios...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Comentarios ({comentarios.length})</h3>

        <button
          onClick={handleMostrarFormulario}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Agregar comentario
        </button>
      </div>

      {mostrarFormulario && isAuthenticated && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full border rounded-lg p-3"
              rows={4}
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              required
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancelar
              </button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                Publicar
              </button>
            </div>
          </form>
        </div>
      )}

      {comentarios.length === 0 ? (
        <p className="text-gray-500 text-center">No hay comentarios aún.</p>
      ) : (
        <div className="space-y-6">
          {comentarios.map((c) => (
            <div
              key={c.id}
              className="border-l-4 border-green-500 pl-4 py-3 bg-white rounded-r-lg shadow-sm"
            >
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{c.usuario?.nombre}</span>
                <span className="text-sm text-gray-500">
                  {new Date(c.creadoEn).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{c.contenido}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
