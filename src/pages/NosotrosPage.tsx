import { useEffect, useState } from "react";
import { Target, Award, Book, Cpu, Users } from "lucide-react";

interface Informacion {
  id: number;
  slug: string;
  titulo: string;
  contenido: string;
  resumen: string;
}

const INFORMACIONES: Informacion[] = [
  {
    id: 1,
    slug: "historia",
    titulo: "Historia",
    contenido: "La Unidad Educativa Colegio 'Simón Rodríguez', fue fundada en el año de 1.990, por su actual propietario Sr. Andrés Eloy Toledo Thompson, para impartir educación. Actualmente cumple 20 años de fundada, para el año de 1.990 empezó a funcionar como un Preescolar; luego se creó la I y II Etapa de Básica. Para el año escolar 2001-2002 se creó la III etapa de educación básica, para el año 2004 –2005 se creó 1º de Ciencias y para el año escolar 2005- 2006 se creó 2do. de Ciencias, culminando la etapa de Media Diversificada.",
    resumen: "Fundada en 1990, más de 20 años de trayectoria educativa"
  },
  {
    id: 2, 
    slug: "mision",
    titulo: "Misión",
    contenido: "La Unidad Educativa Colegio 'Simón Rodríguez' tiene como finalidad educar en forma integral a los niños, niñas y adolescentes capacitándolos para continuar su proceso de formación, que les permita formarse en hombres y mujeres útiles así mismo Funciones de los basamentos legales que avalan el sistema educativo de nuestra nación y otros países. Proyectar las labores educativas de la institución hacia la comunidad. Desarrollar actividades que propicien el aprendizaje significativo 'fomentar actividades que permitan enriquecer el perfil profesional del personal de nuestra institución', Incentivar a la participación en los intercambios Interinstitucionales. Realizar jornadas de arborización. Realizar actividades que permitan reforzar el buen clima organizacional dentro de la institución.",
    resumen: "Educación integral para formar hombres y mujeres útiles"
  },
  {
    id: 3,
    slug: "vision", 
    titulo: "Visión",
    contenido: "La Unidad Educativa Colegio 'Simón Rodríguez' sea una institución con estudiantes y docentes con valores bien arraigados, con óptima infraestructura, que conjuntamente con los padres, madres y representantes integrados y comprometidos en la formación de sus hijos (as), planifiquen, organicen y desarrollen actividades académicas, extra cátedras y de acción social durante todo el año, proyectando al colegio como agente acelerador de cambios, graduando jóvenes integralmente formados, capaces de insertarse positivamente en la comunidad y de proyectarse en el ámbito nacional e internacional como individuos altamente competitivos.",
    resumen: "Institución de excelencia formando jóvenes competitivos"
  },
  {
    id: 4,
    slug: "historia-simon-rodriguez",
    titulo: "Historia de Simón Rodríguez",
    contenido: "Su nombre se debe a Simón Rodríguez conocido bajo el seudónimo de Samuel Robinsón, maestro del Libertador Simón Bolívar, fue escritor con una obra literaria de tipo ensayista.",
    resumen: "Maestro del Libertador Simón Bolívar"
  }
];

interface Acreditacion {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
}

const ACREDITACIONES: Acreditacion[] = [
  {
    id: "1",
    titulo: "Calidad Educativa",
    descripcion: "Compromiso con estándares de calidad educativa",
    icono: "award",  // Usando Award que ya está disponible
    color: "blue"
  },
  {
    id: "2",
    titulo: "Tecnología y Transformación Digital", 
    descripcion: "Infraestructura digital para el aprendizaje",
    icono: "cpu",  // Usando Target como alternativa tecnológica
    color: "green"
  },
  {
    id: "3",
    titulo: "Valores, Inclusión y Convivencia Escolar",
    descripcion: "Escuela comprometida con la educación en valores", 
    icono: "users",
    color: "purple"
  }
];

const getIcon = (iconName: string, color: string = "currentColor", size: string = "w-6 h-6") => {
  const iconProps = { className: `${size} text-${color}-600` };
  
  switch(iconName) {
    case 'target':
      return <Target {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    case 'book':
      return <Book {...iconProps} />;
    case 'cpu':
      return <Cpu {...iconProps} />;
    case 'users':
      return <Users {...iconProps} />;
    default:
      return <Target {...iconProps} />;
  }
};

export const NosotrosPage = () => {
  const [currentSection, setCurrentSection] = useState('about-history');

  const historia = INFORMACIONES[0];
  const mision = INFORMACIONES[1];
  const vision = INFORMACIONES[2];
  const historiaSimon = INFORMACIONES[3];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
window.scrollTo(0, 0);
  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-gray-100 border-b border-gray-200 shadow-inner py-3 md:py-4 sticky top-[102px] md:top-[128px] z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 min-w-max">
            {[
              { id: 'about-history', label: 'Historia', icon: 'target' },
              { id: 'about-accreditations', label: 'Acreditaciones', icon: 'award' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`flex items-center space-x-2 text-sm md:text-base font-medium transition-all duration-300 py-2 px-3 md:px-5 rounded-lg border-b-2 ${
                  currentSection === item.id
                    ? 'bg-white text-blue-700 border-blue-700 shadow-md scale-105'
                    : 'text-gray-600 border-transparent hover:text-blue-500 hover:bg-gray-200'
                }`}
              >
                {getIcon(item.icon, "blue", "w-4 h-4 md:w-5 md:h-5")}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {currentSection === 'about-history' && (
        <section className="py-10 md:py-20 bg-gray-50 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Historia</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-6">
                  {historia.contenido}
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center space-x-2">
                      {getIcon('target', 'blue')}
                      <span>Misión</span>
                    </h3>
                    <p className="text-gray-700">
                      {mision.contenido}
                    </p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center space-x-2">
                      {getIcon('award', 'green')}
                      <span>Visión</span>
                    </h3>
                    <p className="text-gray-700">
                      {vision.contenido}
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center space-x-2">
                    {getIcon('book', 'purple')}
                    <span>Historia de Simón Rodríguez</span>
                  </h3>
                  <p className="text-gray-700">{historiaSimon.contenido}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {currentSection === 'about-accreditations' && (
        <section className="py-10 md:py-20 bg-gray-50 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Acreditaciones</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {ACREDITACIONES.map((acreditacion) => (
                  <div 
                    key={acreditacion.id}
                    className={`
                      p-6 rounded-xl transition-transform duration-300 hover:scale-105
                      ${acreditacion.color === 'blue' ? 'bg-blue-50' : ''}
                      ${acreditacion.color === 'green' ? 'bg-green-50' : ''}
                      ${acreditacion.color === 'purple' ? 'bg-purple-50' : ''}
                    `}
                  >
                    {getIcon(acreditacion.icono, acreditacion.color, "w-12 h-12")}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{acreditacion.titulo}</h3>
                    <p className="text-gray-600">{acreditacion.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};