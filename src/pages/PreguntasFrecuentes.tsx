import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Clock, Shield, MessageSquare, FileText } from "lucide-react";

interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
  icono: string;
  color: string;
}

const PREGUNTAS_FRECUENTES: PreguntaFrecuente[] = [
  {
    id: 1,
    pregunta: "¿Cuál es el horario de atención administrativa?",
    respuesta: "Nuestra oficina administrativa atiende de lunes a viernes de 7:00 a.m. a 6:00 p.m. Para consultas específicas, recomendamos agendar una cita previa vía telefónica o correo electrónico.",
    icono: "clock",
    color: "blue"
  },
  {
    id: 2,
    pregunta: "¿Qué protocolos de seguridad tienen implementados?",
    respuesta: "Contamos con un plan integral de seguridad que incluye: cámaras de vigilancia en zonas comunes y un comité de convivencia escolar activo. La seguridad física y emocional de nuestros estudiantes es nuestra prioridad.",
    icono: "shield",
    color: "green"
  },
  {
    id: 3,
    pregunta: "¿Cómo se maneja la comunicación con los padres?",
    respuesta: "Realizamos reuniones trimestrales de padres y docentes, además de contar con un buzón de contacto en línea para consultas y sugerencias. También utilizamos una plataforma digital para enviar comunicados importantes y reportes de progreso académico.",
    icono: "message-square",
    color: "purple"
  },
  {
    id: 4,
    pregunta: "¿Cuál es la política sobre tareas y evaluación?",
    respuesta: "Promovemos un equilibrio entre el aprendizaje y el bienestar del estudiante. Las tareas buscan reforzar lo aprendido en clase, con tiempos razonables según el nivel. Nuestra evaluación es continua y formativa, considerando desempeños, proyectos y actitud frente al aprendizaje.",
    icono: "file-text",
    color: "orange"
  }
];

const getIcon = (iconName: string, color: string = "currentColor", size: string = "w-6 h-6") => {
  const iconProps = { className: `${size} text-${color}-600` };
  
  switch(iconName) {
    case 'help-circle':
      return <HelpCircle {...iconProps} />;
    case 'clock':
      return <Clock {...iconProps} />;
    case 'shield':
      return <Shield {...iconProps} />;
    case 'message-square':
      return <MessageSquare {...iconProps} />;
    case 'file-text':
      return <FileText {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
  }
};

export const PreguntasFrecuentesPage = () => {
  const [preguntaAbierta, setPreguntaAbierta] = useState<number | null>(null);
  const navigate = useNavigate();

  const togglePregunta = (id: number) => {
    if (preguntaAbierta === id) {
      setPreguntaAbierta(null);
    } else {
      setPreguntaAbierta(id);
    }
  };

  // Función para navegar a contacto y hacer scroll al principio
  const handleContactoClick = () => {
    navigate('/contacto');
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center space-x-3">
            <HelpCircle className="w-8 h-8 md:w-10 md:h-10" />
            <span>Preguntas Frecuentes</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100">
            Encuentra respuestas a las consultas más comunes sobre nuestro colegio
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="space-y-8">
          {/* Introducción */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información Importante</h2>
            <p className="text-gray-600 mb-4">
              Hemos recopilado las preguntas más frecuentes que recibimos de padres, estudiantes y visitantes. 
              Si no encuentras la respuesta que buscas, no dudes en contactarnos directamente.
            </p>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <MessageSquare className="w-4 h-4" />
              <span>
                ¿No encuentras tu respuesta? 
                <button 
                  onClick={handleContactoClick}
                  className="font-medium hover:underline ml-1 focus:outline-none cursor-pointer"
                >
                  Contáctanos aquí
                </button>
              </span>
            </div>
          </div>

          {/* Lista de preguntas frecuentes */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Preguntas Comunes</h2>
            
            <div className="space-y-4">
              {PREGUNTAS_FRECUENTES.map((pregunta) => (
                <div 
                  key={pregunta.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                >
                  <button
                    onClick={() => togglePregunta(pregunta.id)}
                    className="w-full flex items-center justify-between p-4 md:p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg bg-${pregunta.color}-100`}>
                        {getIcon(pregunta.icono, pregunta.color)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{pregunta.pregunta}</h3>
                      </div>
                    </div>
                    <div className={`transform transition-transform ${preguntaAbierta === pregunta.id ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {preguntaAbierta === pregunta.id && (
                    <div className="p-4 md:p-6 pt-0 bg-white">
                      <div className="pl-12 md:pl-16">
                        <p className="text-gray-700 leading-relaxed">
                          {pregunta.respuesta}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sección de contacto adicional */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-md p-6">
  <div className="grid md:grid-cols-2 gap-8">
    {/* Columna izquierda */}
    <div>
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <MessageSquare className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">¿Tienes otra pregunta?</h3>
      </div>
      <p className="text-gray-600">
        Si tu consulta no está en la lista, nuestro equipo administrativo está disponible para ayudarte.
      </p>
    </div>

    {/* Columna derecha */}
    <div>
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Clock className="w-6 h-6 text-gray-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">¿Necesitas atención personalizada?</h3>
      </div>
      <p className="text-gray-600">
        Para consultas específicas sobre admisiones, procesos académicos o situaciones particulares, 
        te invitamos a visitar nuestra sección de contacto para más información.
      </p>
    </div>
  </div>

  {/* Botón alineado a la derecha */}
  <div className="text-right mt-8">
    <button 
      onClick={handleContactoClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
    >
      Contáctanos
    </button>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};