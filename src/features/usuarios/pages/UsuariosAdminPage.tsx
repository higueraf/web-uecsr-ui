import { useEffect, useMemo, useState } from "react";
import {
  getUsuariosAdmin,
  createUsuario,
  updateUsuario,
  type Usuario,
  type RolUsuario,
  type CreateUsuarioPayload,
  type UpdateUsuarioPayload,
} from "../api/usuariosApi";
import { UsuarioRoleBadge } from "../components/UsuarioRoleBadge";
import { UsuarioStatusBadge } from "../components/UsuarioStatusBadge";
import { UsuarioRowActions } from "../components/UsuarioRowActions";
import { UsuarioForm } from "../components/UsuarioForm";

const rolOptions: { value: RolUsuario | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "ADMIN", label: "ADMIN" },
  { value: "STAFF", label: "STAFF" },
  { value: "PUBLICO", label: "PÚBLICO" },
];

const estadoOptions: { value: "todos" | "activos" | "inactivos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "activos", label: "Activos" },
  { value: "inactivos", label: "Inactivos" },
];

export const UsuariosAdminPage = () => {
  const [data, setData] = useState<{ items: Usuario[]; meta?: any }>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [rol, setRol] = useState<RolUsuario | "todos">("todos");
  const [estado, setEstado] = useState<"todos" | "activos" | "inactivos">("todos");

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Usuario | undefined>(undefined);

  const filteredItems = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((u) => {
      const okRol = rol === "todos" ? true : u.rol === rol;
      const okEstado =
        estado === "todos" ? true : estado === "activos" ? u.activo : !u.activo;
      return okRol && okEstado;
    });
  }, [data?.items, rol, estado]);

  const load = async () => {
    const res = await getUsuariosAdmin({ page, limit: 20, search });
    setData(res);
  };

  useEffect(() => {
    load();
  }, [page, search]);

  const openCreate = () => {
    setSelected(undefined);
    setShowModal(true);
  };

  const openEdit = (u: Usuario) => {
    setSelected(u);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(undefined);
  };

  const handleSubmit = async (payload: CreateUsuarioPayload | UpdateUsuarioPayload) => {
    if (selected?.id) {
      await updateUsuario(selected.id, payload as UpdateUsuarioPayload);
    } else {
      await createUsuario(payload as CreateUsuarioPayload);
    }
    await load();
    closeModal();
  };

  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <h1 className="text-2xl font-bold text-brand-700 mb-4 lg:mb-0">Usuarios — Administración</h1>

        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Nuevo Usuario
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
        <input
          type="text"
          placeholder="Buscar por nombres, apellidos o email..."
          className="border rounded p-2 w-full lg:w-96"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <div className="flex gap-3 flex-wrap">
          <select
            className="border rounded p-2"
            value={rol}
            onChange={(e) => setRol(e.target.value as any)}
          >
            {rolOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            className="border rounded p-2"
            value={estado}
            onChange={(e) => setEstado(e.target.value as any)}
          >
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
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Rol</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((u) => (
              <tr key={u.id} className="border-t hover:bg-slate-50">
                <td className="p-3">
                  <div className="font-semibold text-sm">
                    {u.nombres} {u.apellidos}
                  </div>
                  <div className="text-xs text-slate-500">ID: {u.id}</div>
                </td>

                <td className="p-3 text-sm">{u.email}</td>

                <td className="p-3 text-center">
                  <UsuarioRoleBadge rol={u.rol} />
                </td>

                <td className="p-3 text-center">
                  <UsuarioStatusBadge activo={u.activo} />
                </td>

                <td className="p-3 text-center">
                  <UsuarioRowActions id={u.id} onRefresh={load} onEdit={() => openEdit(u)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <p className="text-center text-slate-500 py-6">
            No se encontraron usuarios con los filtros seleccionados.
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6 items-center">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </button>

        <span className="text-sm text-slate-600">
          Página {page} de {totalPages}
        </span>

        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {selected ? "Editar Usuario" : "Nuevo Usuario"}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              <UsuarioForm
                initialData={selected}
                onSubmit={handleSubmit}
                submitLabel={selected ? "Actualizar" : "Crear"}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
