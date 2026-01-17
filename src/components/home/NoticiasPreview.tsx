import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit2 } from "lucide-react";
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

interface NoticiasPreviewProps {
  isAdmin?: boolean;
  onEditNews?: (index: number) => void;
  onAddNews?: () => void;
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
];

const resolveImage = (url?: string) =>
  url ? import.meta.env.VITE_API_URL + url : "";

export const NoticiasPreview = ({
  isAdmin = false,
  onEditNews,
  onAddNews,
}: NoticiasPreviewProps) => {
  const [noticias, setNoticias] = useState<PreviewNoticia[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getNoticiasPublic(1);
        const apiData: Noticia[] = res.data ?? [];
        if (!apiData.length) {
          setNoticias(FALLBACK);
        } else {
          setNoticias(
            apiData.map((n) => {
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
            }),
          );
        }
      } catch {
        setNoticias(FALLBACK);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <section>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-blue-500 pb-2">
            Noticias y Actualidad
          </h2>
          <div className="text-center py-10">
            <div className="animate-pulse">Cargando noticias...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-blue-500 pb-2">
          Noticias y Actualidad
        </h2>

        <div className="space-y-8 max-w-5xl mx-auto">
          {noticias.map((noticia, index) => (
            <div
              key={noticia.id}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden 
              flex flex-col md:flex-row transform hover:shadow-2xl transition-all 
              duration-300 ease-in-out cursor-pointer relative
              ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
            >
              {noticia.imagen && (
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="w-full md:w-1/2 h-64 md:h-80 object-cover"
                />
              )}

              <div className="p-6 flex flex-col justify-center md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {noticia.titulo}
                </h3>

                {noticia.resumen && (
                  <p className="text-gray-600 text-base leading-relaxed mb-4">
                    {noticia.resumen}
                  </p>
                )}

                <div className="flex justify-between items-center mt-auto">
                  {noticia.fecha && (
                    <div className="text-gray-500 text-sm">
                      Publicado el: {noticia.fecha}
                    </div>
                  )}

                  <Link
                    to={`/noticias/${noticia.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                  >
                    Leer más →
                  </Link>
                </div>
              </div>

              {isAdmin && onEditNews && (
                <button
                  onClick={() => onEditNews(index)}
                  className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && onAddNews && (
          <div className="text-center mt-6">
            <button
              onClick={onAddNews}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Noticia</span>
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => {
              navigate('/noticias-eventos?tab=noticias');
              window.scrollTo(0, 0);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Ver todas las noticias</span>
          </button>
        </div>
      </div>
    </section>
  );
};