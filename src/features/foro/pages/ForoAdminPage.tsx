import { useEffect, useState } from "react";
import { createPreguntaAdmin, getForoAdmin, updatePreguntaAdmin, type ForoCategoria, type ForoEstadoAdmin, type ForoPreguntaAdmin } from "../api/foroApi";
import { ForoCategoryBadge } from "../components/ForoCategoryBadge";
import { ForoRowActions } from "../components/ForoRowActions";
import { ForoStatusBadge } from "../components/ForoStatusBadge";
import { ForoForm } from "../components/ForoForm";
import { RespuestasAdminPanel } from "../components/RespuestasAdminPanel";

const categoriaOptions: { value: ForoCategoria | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "NOTICIA", label: "Noticias" },
  { value: "EVENTO", label: "Eventos" },
  { value: "ADMISION", label: "Admisión" },
  { value: "INFORMACION", label: "Información" },
  { value: "OTRO", label: "Otros" },
];

const estadoOptions: { value: ForoEstadoAdmin | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "NUEVA", label: "NUEVA" },
  { value: "APROBADA", label: "APROBADA" },
  { value: "RECHAZADA", label: "RECHAZADA" },
  { value: "OCULTA", label: "OCULTA" },
];

export const ForoAdminPage = () => {
  const [data, setData] = useState<{ items: ForoPreguntaAdmin[]; meta?: any }>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState<ForoCategoria | "todas">("todas");
  const [estado, setEstado] = useState<ForoEstadoAdmin | "todos">("todos");

  const [showFormModal, setShowFormModal] = useState(false);
  const [selected, setSelected] = useState<ForoPreguntaAdmin | undefined>(undefined);

  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState<number | null>(null);

  const load = async () => {
    const res = await getForoAdmin(
      page,
      search,
      categoria === "todas" ? undefined : categoria,
      estado === "todos" ? undefined : estado
    );
    setData(res);
  };

  useEffect(() => {
    load();
  }, [page, search, categoria, estado]);

  const openCreate = () => {
    setSelected(undefined);
    setShowFormModal(true);
  };

  const openEdit = (p: ForoPreguntaAdmin) => {
    setSelected(p);
    setShowFormModal(true);
  };

  const closeForm = () => {
    setShowFormModal(false);
    setSelected(undefined);
  };

  const submitForm = async (payload: any) => {
    if (selected?.id) await updatePreguntaAdmin(selected.id, payload);
    else await createPreguntaAdmin(payload);
    closeForm();
    load();
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <h1 className="text-2xl font-bold text-brand-700 mb-4 lg:mb-0">Foro — Administración</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Nueva Pregunta
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
        <input
          type="text"
          placeholder="Buscar por título o contenido..."
          className="border rounded p-2 w-full lg:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3 flex-wrap">
          <select className="border rounded p-2" value={categoria} onChange={(e) => setCategoria(e.target.value as any)}>
            {categoriaOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select className="border rounded p-2" value={estado} onChange={(e) => setEstado(e.target.value as any)}>
            {estadoOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Categoría</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-center">Respuestas</th>
              <th className="p-3 text-center">Fecha</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((p) => (
              <tr key={p.id} className="border-t hover:bg-slate-50">
                <td className="p-3 max-w-xs">
                  <div className="font-semibold text-sm cursor-pointer hover:text-blue-600" onClick={() => openEdit(p)}>
                    {p.titulo}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2">{p.contenido}</div>
                </td>

                <td className="p-3">
                  <ForoCategoryBadge categoria={p.categoria} />
                </td>

                <td className="p-3 text-center">
                  <ForoStatusBadge estado={p.estado} />
                </td>

                <td className="p-3 text-center text-sm">
                  <button
                    onClick={() => setPreguntaSeleccionada(parseInt(p.id))}
                    className="text-blue-600 hover:underline"
                  >
                    {p.respuestasCount || 0}
                  </button>
                </td>

                <td className="p-3 text-center text-xs text-slate-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 text-center">
                  <ForoRowActions id={p.id} onRefresh={load} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!data || data.items?.length === 0) && (
          <p className="text-center text-slate-500 py-6">No se encontraron preguntas con los filtros seleccionados.</p>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button className="px-4 py-2 border rounded disabled:opacity-50" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </button>
        <button className="px-4 py-2 border rounded" onClick={() => setPage((p) => p + 1)}>
          Siguiente
        </button>
      </div>

      {preguntaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Moderar Respuestas</h3>
                <button onClick={() => setPreguntaSeleccionada(null)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <RespuestasAdminPanel preguntaId={preguntaSeleccionada} />
            </div>
          </div>
        </div>
      )}

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{selected ? "Editar Pregunta" : "Nueva Pregunta"}</h3>
                <button onClick={closeForm} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <ForoForm initialData={selected} onSubmit={submitForm} submitLabel={selected ? "Actualizar" : "Crear"} onCancel={closeForm} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
