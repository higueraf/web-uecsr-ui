import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import {
  getNoticiasPublic,
  type Noticia,
} from "@/features/noticias/api/noticiasApi";

interface PreviewNoticia {
  id: string;
  titulo: string;
  resumen?: string;
  imagen?: string;
  fecha?: string;
}

const FALLBACK: PreviewNoticia[] = [
  {
    id: "1",
    titulo: "El Club de Robótica Califica para el Torneo Mundial de Tecnología",
    resumen:
      "Tras meses de trabajo duro, el equipo 'Global Innovators' logró un puesto en la competencia internacional.",
    imagen: "https://placehold.co/800x600/34D399/FFFFFF?text=Robótica",
    fecha: "Oct 30, 2024",
  },
  {
    id: "2",
    titulo: "Festival Bicultural: Celebrando las Tradiciones",
    resumen:
      "Un evento que reunió a toda la comunidad, con música, danza y gastronomía.",
    imagen: "https://placehold.co/800x600/F59E0B/FFFFFF?text=Evento+Cultural",
    fecha: "Oct 28, 2024",
  },
  {
    id: "3",
    titulo: "Nuevo Laboratorio de Ciencias Equipado con Tecnología de Punta",
    resumen:
      "Inauguramos un moderno laboratorio para potenciar la investigación estudiantil.",
    imagen: "https://placehold.co/800x600/1E3A8A/FFFFFF?text=Laboratorio+Ciencias",
    fecha: "Oct 25, 2024",
  },
  {
    id: "4",
    titulo: "Estudiantes Ganadores en Olimpiada Matemática",
    resumen:
      "Nuestros estudiantes destacaron en la competencia regional de matemáticas.",
    imagen: "https://placehold.co/800x600/8B5CF6/FFFFFF?text=Matemáticas",
    fecha: "Oct 20, 2024",
  },
  {
    id: "5",
    titulo: "Día de la Familia: Un Éxito Total",
    resumen:
      "Más de 500 familias participaron en las actividades del Día de la Familia.",
    imagen: "https://placehold.co/800x600/EC4899/FFFFFF?text=Familia",
    fecha: "Oct 18, 2024",
  },
  {
    id: "6",
    titulo: "Programa de Intercambio Cultural con Canadá",
    resumen:
      "Iniciamos un programa de intercambio estudiantil con una escuela hermana en Toronto.",
    imagen: "https://placehold.co/800x600/0EA5E9/FFFFFF?text=Intercambio",
    fecha: "Oct 15, 2024",
  },
];

const resolveImage = (url?: string) =>
  url ? import.meta.env.VITE_API_URL + url : "";

export const NoticiasPublicListPage = () => {
  const [noticias, setNoticias] = useState<PreviewNoticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [search, setSearch] = useState("");

  const loadNoticias = async () => {
    setLoading(true);
    try {
      const res = await getNoticiasPublic(page, search);
      const apiData: Noticia[] = res.data ?? [];
      
      if (!apiData.length) {
        // Filtrar fallback si hay búsqueda
        const filteredFallback = FALLBACK.filter(noticia => 
          noticia.titulo.toLowerCase().includes(search.toLowerCase()) ||
          (noticia.resumen && noticia.resumen.toLowerCase().includes(search.toLowerCase()))
        );
        
        // Simular paginación con fallback
        const itemsPerPage = 6;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedFallback = filteredFallback.slice(startIndex, endIndex);
        
        setNoticias(paginatedFallback);
        setMeta({
          page: page,
          totalPages: Math.ceil(filteredFallback.length / itemsPerPage),
          total: filteredFallback.length
        });
      } else {
        // Usar datos reales de API
        const processedData = apiData.map((n) => {
          const fechaBase = n.fechaPublicacion ?? n.createdAt;
          const fecha = fechaBase
            ? new Date(fechaBase).toLocaleDateString()
            : undefined;
          return {
            id: String(n.id),
            titulo: n.titulo,
            resumen: n.resumen,
            imagen: resolveImage(n.imagenUrl),
            fecha,
          };
        });
        
        setNoticias(processedData);
        setMeta(res.meta || {
          page: page,
          totalPages: 1,
          total: apiData.length
        });
      }
    } catch {
      // Filtrar fallback si hay búsqueda
      const filteredFallback = FALLBACK.filter(noticia => 
        noticia.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (noticia.resumen && noticia.resumen.toLowerCase().includes(search.toLowerCase()))
      );
      
      // Simular paginación con fallback
      const itemsPerPage = 6;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedFallback = filteredFallback.slice(startIndex, endIndex);
      
      setNoticias(paginatedFallback);
      setMeta({
        page: page,
        totalPages: Math.ceil(filteredFallback.length / itemsPerPage),
        total: filteredFallback.length
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNoticias();
  }, [page, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <div className="animate-pulse text-gray-600">Cargando noticias...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-1 md:py-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Barra de búsqueda */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar noticias..."
              className="w-full px-6 py-4 pl-14 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              value={search}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Lista de noticias */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {noticias.length > 0 ? (
            noticias.map((noticia, index) => (
              <div
                key={noticia.id}
                className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden 
                flex flex-col md:flex-row transform hover:shadow-2xl transition-all 
                duration-300 ease-in-out cursor-pointer
                ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                {noticia.imagen && (
                  <div className="w-full md:w-1/3 lg:w-2/5">
                    <img
                      src={noticia.imagen}
                      alt={noticia.titulo}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-8 flex flex-col justify-center flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {noticia.titulo}
                  </h3>

                  {noticia.resumen && (
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {noticia.resumen}
                    </p>
                  )}

                  <div className="flex justify-between items-center mt-auto">
                    {noticia.fecha && (
                      <div className="text-gray-500 text-base">
                        Publicado el: {noticia.fecha}
                      </div>
                    )}

                    <Link
                      to={`/noticias/${noticia.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-300 flex items-center space-x-2"
                    >
                      <span>Leer más</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                No se encontraron noticias
              </h3>
              <p className="text-gray-600 text-lg">
                {search 
                  ? `No hay noticias que coincidan con "${search}"`
                  : "No hay noticias disponibles en este momento."}
              </p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {meta && meta.totalPages > 1 && (
          <div className="flex flex-col items-center mt-16 space-y-4">
            <div className="text-gray-600 text-lg">
              Mostrando página {meta.page} de {meta.totalPages} 
              {meta.total && ` (${meta.total} noticias en total)`}
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
                  // Mostrar números de página alrededor de la página actual
                  let pageNum;
                  if (meta.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= meta.totalPages - 2) {
                    pageNum = meta.totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

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

        {/* Enlace para volver */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-lg font-medium"
          >
            <span>← Volver al inicio</span>
          </Link>
        </div>
      </div>
    </section>
  );
};