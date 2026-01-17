import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MessageCircle, User, MessageSquare, Plus } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createPreguntaPublic,
  getForoPublic,
  type ForoCategoria,
  type ForoPreguntaPublic,
} from "../api/foroApi";
import { ForoCategoryBadge } from "../components/ForoCategoryBadge";
import { ForoPreguntaPublicForm } from "../components/ForoPreguntaPublicForm";

const categorias: { value: ForoCategoria | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "NOTICIA", label: "Noticias" },
  { value: "EVENTO", label: "Eventos" },
  { value: "ADMISION", label: "Admisión" },
  { value: "INFORMACION", label: "Información" },
  { value: "OTRO", label: "Otros" },
];

export const ForoPublicPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<{ items: ForoPreguntaPublic[]; meta?: any } | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState<ForoCategoria | "todas">("todas");
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  const openCreate = () => {
    if (!isAuthenticated) {
      const returnUrl = `/foro?create=1`;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }
    setShowCreate(true);
  };

  const closeCreate = () => {
    setShowCreate(false);
    const next = new URLSearchParams(searchParams);
    next.delete("create");
    setSearchParams(next, { replace: true });
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await getForoPublic(page, search, categoria === "todas" ? undefined : categoria);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    load();
  }, [page, search, categoria]);

  useEffect(() => {
    if (searchParams.get("create") === "1" && isAuthenticated) {
      setShowCreate(true);
    }
  }, [searchParams, isAuthenticated]);

  const items = useMemo(() => (Array.isArray(data?.items) ? data!.items : []), [data]);

  const onSubmitPregunta = async (payload: any) => {
    await createPreguntaPublic(payload);
    closeCreate();
    setPage(1);
    await load();
  };

  const goToDetalle = (id: string) => {
    navigate(`/foro/${id}`);
  };

  const responder = (id: string) => {
    if (!isAuthenticated) {
      navigate(`/login?returnUrl=${encodeURIComponent(`/foro/${id}?reply=1`)}`);
      return;
    }
    navigate(`/foro/${id}?reply=1`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="py-10 md:py-16 bg-gray-50 min-h-[60vh]">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-3">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <MessageCircle className="text-blue-600 w-8 h-8" />
                <span>Discusiones de la Comunidad</span>
              </h2>

              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Nueva pregunta
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
              <input
                type="text"
                placeholder="Buscar pregunta..."
                className="border rounded p-2 w-full md:w-72"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="border rounded p-2 w-full md:w-56"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
              >
                {categorias.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="py-10 text-center text-slate-500">Cargando...</div>
            ) : (
              <div className="space-y-6">
                {items.map((p: any) => (
                  <div
                    key={p.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2">
                      <button
                        onClick={() => goToDetalle(p.id)}
                        className="text-left"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                          {p.titulo}
                        </h3>
                      </button>

                      <ForoCategoryBadge categoria={p.categoria} />
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">{p.contenido}</p>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-500 gap-3">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{p.autorNombre || "Anónimo"}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{p.respuestasCount || 0} respuestas</span>
                        </span>
                        <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => goToDetalle(p.id)}
                          className="px-3 py-2 border rounded-lg text-sm hover:bg-slate-50"
                        >
                          Ver detalles
                        </button>
                        <button
                          onClick={() => responder(p.id)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          Responder
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <p className="text-center text-slate-500 py-8">
                    No se encontraron preguntas con los filtros seleccionados.
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-center gap-4 mt-8">
              <button
                className="px-4 py-2 border rounded disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </button>
              <button className="px-4 py-2 border rounded" onClick={() => setPage((p) => p + 1)}>
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </section>

      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold">Nueva pregunta</h3>
                <button onClick={closeCreate} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              <ForoPreguntaPublicForm onSubmit={onSubmitPregunta} onCancel={closeCreate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
