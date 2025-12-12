import { MapPin, Mail, Phone, Clock, MessageSquare } from "lucide-react";
import { useEffect } from "react";

const contactData = {
  direccion: "Urb. Zarabon av. 3 número 1-14, Punto Fijo 4102, Venezuela",
  email: "uecsimonrodriguez@gmail.com",
  telefono: "+58 412-5341234",
  horario: "Lunes a Viernes: 7:00 AM - 6:00 PM",
  contactoAdicional: "Para consultas específicas, recomendamos agendar una cita previa vía telefónica o correo electrónico."
};

export const ContactoPublicPage = () => {
  
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto max-w-5xl px-6">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-base md:text-lg">
            Información de Contacto
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-6">
            Contáctanos
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Estamos aquí para ayudarte. Encuentra toda la información necesaria para comunicarte con nuestra institución.
          </p>
        </div>
        
        {/* Tarjetas de información centradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Tarjeta Dirección */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-5 rounded-full mb-7">
                <MapPin className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-5">Dirección</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {contactData.direccion}
              </p>
            </div>
          </div>

          {/* Tarjeta Email */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-5 rounded-full mb-7">
                <Mail className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-5">Correo Electrónico</h3>
              <p className="text-gray-700 mb-3 text-lg">Contacto principal:</p>
              <a 
                href={`mailto:${contactData.email}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-md break-all leading-tight"
              >
                {contactData.email}
              </a>
            </div>
          </div>

          {/* Tarjeta Teléfono */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-5 rounded-full mb-7">
                <Phone className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-5">Teléfono</h3>
              <a 
                href={`tel:${contactData.telefono.replace(/[^\d+]/g, '')}`}
                className="text-gray-800 hover:text-blue-600 font-bold text-2xl mb-3"
              >
                {contactData.telefono}
              </a>
              <p className="text-gray-600 text-base">
                Llamadas y WhatsApp
              </p>
            </div>
          </div>
        </div>

        {/* Información adicional centrada */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {/* Horario de atención */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-9 border border-blue-200">
              <div className="flex items-start space-x-6">
                <div className="bg-blue-600 p-4 rounded-xl">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Horario de Atención</h3>
                  <p className="text-gray-800 font-semibold text-xl mb-3">{contactData.horario}</p>
                  <p className="text-gray-700 text-lg">{contactData.contactoAdicional}</p>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-9 border border-gray-200">
              <div className="flex items-start space-x-6">
                <div className="bg-gray-600 p-4 rounded-xl">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Canales de Contacto</h3>
                  <p className="text-gray-800 font-semibold text-xl mb-3">Prefiere el correo electrónico para:</p>
                  <ul className="text-gray-700 text-lg space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Solicitudes formales de información</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Documentación importante</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Consultas detalladas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>          
        </div>
      </div>
    </section>
  );
};