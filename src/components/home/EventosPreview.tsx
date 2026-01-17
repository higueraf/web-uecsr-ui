import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Calendar, MapPin } from "lucide-react";
import { getEventosPublic, type Evento } from "@/features/eventos/api/eventosApi";
import { useEffect, useState } from "react";

interface EventosPreviewProps {
  isAdmin?: boolean;
  onEditEvent?: (index: number) => void;
  onAddEvent?: () => void;
}

export const EventosPreview = ({
  isAdmin = false,
  onEditEvent,
  onAddEvent
}: EventosPreviewProps) => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEventos = async () => {
      setLoading(true);
      try {
        // CORRECTO: página 1, sin búsqueda, sin categoría, límite 3
        const response = await getEventosPublic(1, "", "", 3);
        setEventos(response.data);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        setEventos([]);
      } finally {
        setLoading(false);
      }
    };

    loadEventos();
  }, []);

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-blue-500 pb-2">
            Próximos Eventos
          </h2>
          <div className="text-center py-10">
            <div className="animate-pulse">Cargando eventos...</div>
          </div>
        </div>
      </section>
    );
  }

  if (eventos.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-16 bg-white editable relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-blue-500 pb-2">
          Próximos Eventos
        </h2>

        <div className="space-y-12 max-w-5xl mx-auto py-10">
          {eventos.map((evento: Evento, index: number) => (
            <div
              key={evento.id}
              className={`
                bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden 
                flex flex-col md:flex-row transform hover:shadow-2xl transition-all 
                duration-300 ease-in-out cursor-pointer relative
                ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}
              `}
              onClick={() => navigate(`/eventos/${evento.id}`)}
            >
              <img
                src={evento.imagenUrl || "https://placehold.co/800x600/6B7280/FFFFFF?text=Evento"}
                alt={evento.titulo}
                className="w-full md:w-1/2 h-64 md:h-80 object-cover"
              />

              <div className="p-6 flex flex-col justify-center md:w-1/2">
                <span className="text-yellow-600 font-semibold uppercase tracking-wider text-xs mb-2">
                  {evento.categoria}
                </span>

                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {evento.titulo}
                </h3>

                <div className="flex items-center space-x-4 text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{evento.lugar}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  {evento.resumen}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    evento.estado === 'PROGRAMADO' 
                      ? 'bg-blue-100 text-blue-800'
                      : evento.estado === 'EN_CURSO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {evento.estado}
                  </span>

                  <div className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                    Más información →
                  </div>
                </div>
              </div>

              {isAdmin && onEditEvent && (
                <button
                  className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditEvent(index);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && onAddEvent && (
          <div className="text-center mb-6">
            <button
              onClick={onAddEvent}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Evento</span>
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          <button 
            onClick={() => {
              navigate('/noticias-eventos?tab=eventos');
              window.scrollTo(0, 0);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Ver todos los eventos</span>
          </button>
        </div>
      </div>
    </section>
  );
};