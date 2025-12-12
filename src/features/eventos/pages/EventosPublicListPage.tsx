// EventosPublicListPage.tsx (completo y corregido)
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Calendar, MapPin, Filter } from "lucide-react";
import { getEventosPublic, type Evento } from "@/features/eventos/api/eventosApi";

const CATEGORIAS = [
  "TODAS",
  "ACADÉMICO",
  "CULTURAL",
  "DEPORTES",
  "ADMISIONES",
  "AMBIENTAL",
  "GENERAL",
] as const;

type Categoria = typeof CATEGORIAS[number];

const resolveImage = (url?: string) =>
  url ? import.meta.env.VITE_API_URL + (url.startsWith("/") ? url : `/${url}`) : "";

export const EventosPublicListPage = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<Categoria>("TODAS");
  const [meta, setMeta] = useState<{
    page: number;
    totalPages: number;
    total: number;
  } | null>(null);

  const navigate = useNavigate();

  const loadEventos = async () => {
    setLoading(true);

    try {
      const response = await getEventosPublic(page, search, categoriaFilter);

      setEventos(response.data);
      setMeta({
        page: response.meta.page,
        totalPages: response.meta.totalPages,
        total: response.meta.total,
      });
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      setEventos([]);
      setMeta({ page: 1, totalPages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventos();
  }, [page, search, categoriaFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoriaFilter(e.target.value as Categoria);
    setPage(1);
  };

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <div className="animate-pulse text-gray-600">Cargando eventos...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-1 md:py-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar eventos por título o descripción..."
                  className="w-full px-6 py-4 pl-14 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  value={search}
                  onChange={handleSearchChange}
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="relative">
              <select
                className="w-full px-6 py-4 pl-14 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg appearance-none"
                value={categoriaFilter}
                onChange={handleCategoriaChange}
              >
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria === "TODAS" ? "Todas las categorías" : categoria}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="space-y-8 max-w-6xl mx-auto">
          {eventos.length > 0 ? (
            eventos.map((evento, index) => (
              <div
                key={evento.id}
                className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden 
                flex flex-col md:flex-row transform hover:shadow-2xl transition-all 
                duration-300 ease-in-out cursor-pointer
                ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="w-full md:w-2/5">
                  <img
                    src={
                      resolveImage(evento.imagenUrl) ||
                      "https://placehold.co/800x600/6B7280/FFFFFF?text=Evento"
                    }
                    alt={evento.titulo}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                <div className="p-8 flex flex-col justify-center flex-1">
                  <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-3 inline-block">
                    {(evento as any).categoria || evento.estado}
                  </span>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{evento.titulo}</h3>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">
                        {new Date(evento.fechaInicio).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <span>{evento.lugar}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed mb-6">{evento.resumen}</p>

                  <div className="mt-auto">
                    <Link
                      to={`/eventos/${evento.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-300 flex items-center space-x-2"
                    >
                      <span>Ver detalles del evento</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No se encontraron eventos</h3>
              <p className="text-gray-600 text-lg">
                {search || categoriaFilter !== "TODAS"
                  ? "No hay eventos que coincidan con los filtros seleccionados."
                  : "No hay eventos programados en este momento."}
              </p>
              {(search || categoriaFilter !== "TODAS") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategoriaFilter("TODAS");
                  }}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex flex-col items-center mt-16 space-y-4">
            <div className="text-gray-600 text-lg">
              Mostrando página {meta.page} de {meta.totalPages}
              {meta.total && ` (${meta.total} eventos en total)`}
            </div>

            <div className="flex items-center space-x-4">
              <button
                className={`px-6 py-3 rounded-lg font-medium text-lg transition-colors duration-300 ${
                  page <= 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                  let pageNum;
                  if (meta.totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= meta.totalPages - 2) pageNum = meta.totalPages - 4 + i;
                  else pageNum = page - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      className={`w-12 h-12 rounded-lg font-medium text-lg transition-colors duration-300 ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className={`px-6 py-3 rounded-lg font-medium text-lg transition-colors duration-300 ${
                  page >= meta.totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={page >= meta.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <a
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            href="#"
            className="text-blue-600 hover:text-blue-800"
          >
            <span>← Volver al inicio</span>
          </a>
        </div>
      </div>
    </section>
  );
};
