export const PublicFooter = () => (
  <footer className="bg-gray-900 text-gray-400 py-12">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="text-2xl font-bold text-white mb-6">
        Unidad Educativa Colegio Simón Rodríguez
      </div>
      <div className="flex justify-center space-x-6 mb-6 text-sm">
        <a 
          href="#" 
          onClick={(e) => e.preventDefault()}
          className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
        >
          Política de Privacidad
        </a>
        <a 
          href="#" 
          onClick={(e) => e.preventDefault()}
          className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
        >
          Mapa del Sitio
        </a>
        <a 
          href="#" 
          onClick={(e) => e.preventDefault()}
          className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
        >
          Trabaja con Nosotros
        </a>
      </div>
      <p className="text-gray-500 text-sm mt-6">
        &copy; {new Date().getFullYear()} Unidad Educativa Colegio Simón Rodríguez. Institución acreditada por MSA y CIS.
      </p>
    </div>
  </footer>
);