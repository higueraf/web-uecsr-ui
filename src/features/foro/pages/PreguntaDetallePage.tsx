import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ForoCategoryBadge } from "../components/ForoCategoryBadge";
import {
  getPreguntaByIdPublic,
  getPreguntaByIdAdmin,
  updatePreguntaAdmin,
  type ForoPreguntaAdmin,
  type ForoPreguntaPublic,
} from "../api/foroApi";
import {
  getRespuestasByPregunta,
  createRespuesta,
  updateRespuestaEstado,
  toggleOcultaRespuesta,
  type RespuestaForoPublic,
  type EstadoRespuestaAdmin,
} from "../api/respuestasApi";
import {
  MessageCircle,
  Send,
  User,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";

type PreguntaUI = ForoPreguntaPublic | (ForoPreguntaAdmin & { estado?: any });

export const PreguntaDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, canModerate } = useAuth();

  const [pregunta, setPregunta] = useState<PreguntaUI | null>(null);
  const [respuestas, setRespuestas] = useState<RespuestaForoPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [nuevaRespuesta, setNuevaRespuesta] = useState("");
  const [editTitulo, setEditTitulo] = useState("");
  const [editContenido, setEditContenido] = useState("");
  const [editRespuestaAdmin, setEditRespuestaAdmin] = useState("");

  const cargarDatos = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const preguntaId = parseInt(id);

      const preguntaPromise = canModerate()
        ? getPreguntaByIdAdmin(preguntaId)
        : getPreguntaByIdPublic(preguntaId);

      const [preguntaData, respuestasData] = await Promise.all([
        preguntaPromise,
        getRespuestasByPregunta(preguntaId, 1, 50),
      ]);

      setPregunta(preguntaData);
      setRespuestas(respuestasData.items || []);

      setEditTitulo((preguntaData as any).titulo || "");
      setEditContenido((preguntaData as any).contenido || "");
      setEditRespuestaAdmin((preguntaData as any).respuestaAdmin || "");
    } catch (err) {
      setError("No se pudo cargar la pregunta");
      setPregunta(null);
      setRespuestas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const handleEnviarRespuesta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!nuevaRespuesta.trim()) return;

    if (!isAuthenticated) {
      navigate(`/auth/login?returnUrl=/foro/${id}`);
      return;
    }

    await createRespuesta({
      contenido: nuevaRespuesta,
      preguntaId: parseInt(id),
    });

    setNuevaRespuesta("");
    cargarDatos();
  };

  const handleUpdatePregunta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    await updatePreguntaAdmin(id, {
      titulo: editTitulo,
      contenido: editContenido,
      respuestaAdmin: editRespuestaAdmin || undefined,
    });

    setEditMode(false);
    cargarDatos();
  };

  const handleAprobarRespuesta = async (respuestaId: number) => {
    await updateRespuestaEstado(respuestaId, "APROBADA");
    cargarDatos();
  };

  const handleOcultarRespuesta = async (respuestaId: number) => {
    await toggleOcultaRespuesta(respuestaId);
    cargarDatos();
  };

  const getEstadoBadge = (estado: string) => {
    const map: Record<string, { color: string; icon: any; label: string }> = {
      PENDIENTE: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "PENDIENTE" },
      APROBADA: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "APROBADA" },
      RECHAZADA: { color: "bg-red-100 text-red-800", icon: XCircle, label: "RECHAZADA" },
      OCULTA: { color: "bg-slate-100 text-slate-700", icon: XCircle, label: "OCULTA" },
    };

    const cfg = map[estado] || { color: "bg-slate-100 text-slate-700", icon: AlertCircle, label: estado };
    const Icon = cfg.icon;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !pregunta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error || "Pregunta no encontrada"}</h2>
          <Link to="/foro" className="text-blue-600 hover:underline">
            ← Volver al foro
          </Link>
        </div>
      </div>
    );
  }

  const fecha = (pregunta as any).createdAt || (pregunta as any).creadoEn;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/foro" className="hover:text-blue-600">
                Foro
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-gray-800 truncate">{(pregunta as any).titulo}</li>
          </ol>
        </nav>

        {editMode ? (
          <form onSubmit={handleUpdatePregunta} className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Editar Pregunta</h2>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                <textarea
                  value={editContenido}
                  onChange={(e) => setEditContenido(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm min-h-[150px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Respuesta Oficial (Opcional)</label>
                <textarea
                  value={editRespuestaAdmin}
                  onChange={(e) => setEditRespuestaAdmin(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-3">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{(pregunta as any).titulo}</h1>
                <ForoCategoryBadge categoria={(pregunta as any).categoria} />
              </div>

              {canModerate() && (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {(pregunta as any).autorNombre || "Usuario"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {fecha ? new Date(fecha).toLocaleDateString() : ""}
              </span>
            </div>

            <div className="prose max-w-none text-gray-700 mb-6">{(pregunta as any).contenido}</div>

            {(pregunta as any).respuestaAdmin && (
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Respuesta oficial
                  </h3>
                  {canModerate() && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setEditRespuestaAdmin((pregunta as any).respuestaAdmin);
                      }}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Editar
                    </button>
                  )}
                </div>
                <p className="text-blue-700 whitespace-pre-line">{(pregunta as any).respuestaAdmin}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Respuestas ({respuestas.length})
            </h2>
          </div>

          {respuestas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aún no hay respuestas. ¡Sé el primero en responder!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {respuestas.map((r: any) => {
                const estado: EstadoRespuestaAdmin = r.estado;
                const autor = r.autorNombre || r.nombreAutor || "Usuario";

                return (
                  <div key={r.id} className="border-l-4 border-blue-500 pl-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800">{autor}</span>
                        {estado !== "APROBADA" && getEstadoBadge(estado)}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(r.creadoEn).toLocaleDateString()}
                        </span>

                        {canModerate() && (
                          <div className="flex gap-1">
                            {estado !== "APROBADA" && (
                              <button
                                onClick={() => handleAprobarRespuesta(r.id)}
                                className="text-green-600 hover:text-green-800"
                                title="Mostrar (Aprobar)"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleOcultarRespuesta(r.id)}
                              className="text-slate-700 hover:text-slate-900"
                              title={estado === "OCULTA" ? "Mostrar" : "Ocultar"}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 whitespace-pre-line">{r.contenido}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {isAuthenticated ? "Responder a esta pregunta" : "Inicia sesión para responder"}
          </h3>

          <form onSubmit={handleEnviarRespuesta}>
            <textarea
              value={nuevaRespuesta}
              onChange={(e) => setNuevaRespuesta(e.target.value)}
              placeholder={isAuthenticated ? "Escribe tu respuesta aquí..." : "Inicia sesión para poder responder"}
              className="w-full h-32 border rounded-lg p-4 mb-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isAuthenticated}
              required
            />

            <div className="flex justify-between items-center">
              {isAuthenticated ? (
                <button
                  type="submit"
                  disabled={!nuevaRespuesta.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Enviar respuesta
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(`/auth/login?returnUrl=/foro/${id}`)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                >
                  Iniciar sesión para responder
                </button>
              )}

              <p className="text-sm text-gray-500">Tu respuesta será revisada antes de publicarse</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
