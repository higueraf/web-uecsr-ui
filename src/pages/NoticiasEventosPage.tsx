import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Newspaper, Calendar } from "lucide-react";
import { NoticiasPublicListPage }  from "../features/noticias/pages/NoticiasPublicListPage";
import { EventosPublicListPage } from "../features/eventos/pages/EventosPublicListPage";

export const NoticiasEventosPage = () => {
  const [currentTab, setCurrentTab] = useState<'noticias' | 'eventos'>('noticias');
  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    window.scrollTo(0, 0);
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (tab === 'eventos') {
      setCurrentTab('eventos');
    } else {
      setCurrentTab('noticias');
    }
  }, [location]);

  const handleTabClick = (tab: 'noticias' | 'eventos') => {
    setCurrentTab(tab);
    navigate(`/noticias-eventos?tab=${tab}`, { replace: true });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Noticias y Eventos</h1>
          <p className="text-lg md:text-xl text-blue-100">
            Mantente informado sobre las últimas novedades y actividades del colegio
          </p>
        </div>
      </div>

      {/* Pestañas de navegación */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-[102px] md:top-[128px] z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => handleTabClick('noticias')}
              className={`
                flex items-center space-x-2 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium
                border-b-2 transition-all duration-300
                ${currentTab === 'noticias'
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-600 border-transparent hover:text-blue-500 hover:bg-gray-50'
                }
              `}
            >
              <Newspaper className="w-4 h-4 md:w-5 md:h-5" />
              <span>Noticias</span>
            </button>

            <button
              onClick={() => handleTabClick('eventos')}
              className={`
                flex items-center space-x-2 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium
                border-b-2 transition-all duration-300
                ${currentTab === 'eventos'
                  ? 'text-purple-600 border-purple-600 bg-purple-50'
                  : 'text-gray-600 border-transparent hover:text-purple-500 hover:bg-gray-50'
                }
              `}
            >
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              <span>Eventos</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido de las pestañas */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {currentTab === 'noticias' ? (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Últimas Noticias</h2>
              <p className="text-gray-600 mb-6">
                Información actualizada sobre actividades, logros y novedades del Colegio Simón Rodríguez
              </p>
              <NoticiasPublicListPage />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Próximos Eventos</h2>
              <p className="text-gray-600 mb-6">
                Actividades programadas, fechas importantes y eventos especiales del colegio
              </p>
              <EventosPublicListPage />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};