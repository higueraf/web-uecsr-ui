export const InfoInstitucional: React.FC = () => (
  <section className="py-8 md:py-6 bg-blue-50">
    <div className="container mx-auto max-w-7xl px-6">
      {/* Título de sección */}
      <div className="text-center mb-12">
        <span className="text-blue-600 font-semibold uppercase tracking-wider">
          Nuestros Pilares
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
          Valores de la Institución
        </h2>
      </div>

      {/* Grid de pilares */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-xl border-t-8 border-blue-700 flex flex-col items-center text-center transition duration-500 hover:shadow-2xl hover:scale-[1.01]">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Nuestra Historia</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Más de 20 años formando estudiantes con excelencia y valores
            institucionales.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-xl border-t-8 border-blue-700 flex flex-col items-center text-center transition duration-500 hover:shadow-2xl hover:scale-[1.01]">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Misión y Visión</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Impulsar el desarrollo integral mediante la innovación, ética y
            educación de calidad.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-xl border-t-8 border-blue-700 flex flex-col items-center text-center transition duration-500 hover:shadow-2xl hover:scale-[1.01]">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Programas STEAM</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Espacios modernos con laboratorios, robótica educativa y proyectos
            colaborativos.
          </p>
        </div>
      </div>
    </div>
  </section>
);
