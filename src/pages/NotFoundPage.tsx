import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4 px-4">
        <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide">
          Error 404
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Página no encontrada
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-md mx-auto">
          La ruta que intentas acceder no existe o ha sido movida. Vuelve al inicio
          para seguir navegando en el sitio de la Unidad Educativa Colegio Simón Rodríguez.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-5 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
          >
            Ir al inicio
          </Link>
          <Link
            to="/contacto"
            className="px-5 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            Contactar al colegio
          </Link>
        </div>
      </div>
    </section>
  );
};
