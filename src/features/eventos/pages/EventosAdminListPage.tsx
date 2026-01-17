import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getEventosAdmin,
  type Evento,
  type EstadoEvento,
} from "@/features/eventos/api/eventosApi";
import { EventoRowActions } from "../components/EventoRowActions";

const estados: (EstadoEvento | "TODOS")[] = [
  "TODOS",
  "PROGRAMADO",
  "EN_CURSO",
  "FINALIZADO",
  "CANCELADO",
];

export const EventosAdminListPage = () => {
  const [items, setItems] = useState<Evento[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoEvento | "TODOS">("TODOS");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEventosAdmin(page, search);
      let data = res.data;
      if (estadoFiltro !== "TODOS") data = data.filter((e) => e.estado === estadoFiltro);
      setItems(data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, search, estadoFiltro]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Eventos</h1>
          <p className="text-sm text-slate-500">
            Gestiona los eventos que se muestran en el sitio público.
          </p>
        </div>

        <Link
          to="/admin/eventos/crear"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          Nuevo evento
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Buscar por título, resumen o lugar..."
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-72"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-56"
          value={estadoFiltro}
          onChange={(e) => {
            setEstadoFiltro(e.target.value as EstadoEvento | "TODOS");
            setPage(1);
          }}
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
              <th className="p-3 text-left hidden lg:table-cell">Lugar</th>
              <th className="p-3 text-left hidden lg:table-cell">Fecha inicio</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {items.map((e) => {
              const fecha = e.fechaInicio ?? e.creadoEn;
              return (
                <tr key={e.id} className="border-t">
                  <td className="p-3">
                    <div className="font-semibold text-slate-900 line-clamp-1">{e.titulo}</div>
                    {e.resumen && (
                      <div className="text-xs text-slate-500 line-clamp-2 md:hidden">
                        {e.resumen}
                      </div>
                    )}
                  </td>

                  <td className="p-3 text-xs hidden md:table-cell">
                    {e.estado === "PROGRAMADO" && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                        Programado
                      </span>
                    )}
                    {e.estado === "EN_CURSO" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        En curso
                      </span>
                    )}
                    {e.estado === "FINALIZADO" && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Finalizado
                      </span>
                    )}
                    {e.estado === "CANCELADO" && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        Cancelado
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-xs hidden lg:table-cell">{e.lugar}</td>

                  <td className="p-3 text-xs hidden lg:table-cell">
                    {fecha ? new Date(fecha).toLocaleDateString() : "-"}
                  </td>

                  <td className="p-3">
                    <EventoRowActions evento={e} onRefresh={load} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && items.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-6">
            No hay eventos con los filtros actuales.
          </p>
        )}

        {loading && (
          <p className="text-center text-sm text-slate-500 py-6">Cargando...</p>
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
