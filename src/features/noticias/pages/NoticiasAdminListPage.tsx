import { useEffect, useState } from "react";
import {
  getNoticiasAdmin,
  type Noticia,
  type EstadoNoticia,
} from "@/features/noticias/api/noticiasApi";
import { NoticiaRowActions } from "../components/NoticiaRowActions";
import { Link } from "react-router-dom";

const estados: (EstadoNoticia | "TODOS")[] = ["TODOS", "BORRADOR", "PUBLICADO", "OCULTO"];

export const NoticiasAdminListPage = () => {
  const [items, setItems] = useState<Noticia[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoNoticia | "TODOS">("TODOS");

  const load = () => {
    getNoticiasAdmin(page, search).then((res) => {
      let data = res.data;
      if (estadoFiltro !== "TODOS") {
        data = data.filter((n) => n.estado === estadoFiltro);
      }
      setItems(data);
      setMeta(res.meta);
    });
  };

  useEffect(() => {
    load();
  }, [page, search, estadoFiltro]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Noticias</h1>
          <p className="text-sm text-slate-500">
            Gestiona las noticias que se muestran en el sitio público.
          </p>
        </div>

        <Link
          to="/admin/noticias/crear"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          Nueva noticia
        </Link>

      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Buscar por título o resumen..."
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-56"
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value as EstadoNoticia | "TODOS")}
        >
          {estados.map((e) => (
            <option key={e} value={e}>
              {e === "TODOS" ? "Todos los estados" : e}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left hidden md:table-cell">Estado</th>
              <th className="p-3 text-left hidden md:table-cell">Destacado</th>
              <th className="p-3 text-left hidden lg:table-cell">Publicación</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {items.map((n) => {
              const fecha = n.fechaPublicacion ?? n.createdAt;

              return (
                <tr key={n.id} className="border-t">
                  <td className="p-3">
                    <div className="font-semibold text-slate-900 line-clamp-1">
                      {n.titulo}
                    </div>
                    {n.resumen && (
                      <div className="text-xs text-slate-500 line-clamp-2 md:hidden">
                        {n.resumen}
                      </div>
                    )}
                  </td>

                  <td className="p-3 text-xs hidden md:table-cell">
                    {n.estado === "PUBLICADO" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Publicado
                      </span>
                    )}
                    {n.estado === "BORRADOR" && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Borrador
                      </span>
                    )}
                    {n.estado === "OCULTO" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        Oculto
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-xs hidden md:table-cell">
                    {n.destacado ? "Sí" : "No"}
                  </td>

                  <td className="p-3 text-xs hidden lg:table-cell">
                    {fecha ? new Date(fecha).toLocaleDateString() : "-"}
                  </td>

                  <td className="p-3">
                    <NoticiaRowActions noticia={n} onRefresh={load} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-6">
            No hay noticias con los filtros actuales.
          </p>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-4 text-sm">
          <button
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </button>

          <span className="self-center text-slate-500">
            Página {meta.page} de {meta.totalPages}
          </span>

          <button
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
