import { useEffect, useState } from "react";
import type { RolUsuario, Usuario, CreateUsuarioPayload, UpdateUsuarioPayload } from "../api/usuariosApi";

interface Props {
  initialData?: Usuario;
  onSubmit: (data: CreateUsuarioPayload | UpdateUsuarioPayload) => Promise<void> | void;
  submitLabel: string;
  onCancel: () => void;
}

const roles: RolUsuario[] = ["ADMIN", "STAFF", "PUBLICO"];

export const UsuarioForm = ({ initialData, onSubmit, submitLabel, onCancel }: Props) => {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<RolUsuario>("PUBLICO");
  const [activo, setActivo] = useState(true);

  const [contrasena, setContrasena] = useState("");
  const [contrasena2, setContrasena2] = useState("");

  useEffect(() => {
    if (initialData) {
      setNombres(initialData.nombres ?? "");
      setApellidos(initialData.apellidos ?? "");
      setEmail(initialData.email ?? "");
      setRol(initialData.rol ?? "PUBLICO");
      setActivo(initialData.activo ?? true);
      setContrasena("");
      setContrasena2("");
    } else {
      setNombres("");
      setApellidos("");
      setEmail("");
      setRol("PUBLICO");
      setActivo(true);
      setContrasena("");
      setContrasena2("");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = !!initialData?.id;

    if (!isEdit) {
      if (!contrasena || contrasena.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (contrasena !== contrasena2) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      const payload: CreateUsuarioPayload = {
        nombres,
        apellidos,
        email,
        contrasena,
        rol,
        activo,
      };

      await onSubmit(payload);
      return;
    }

    if (contrasena || contrasena2) {
      if (contrasena.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (contrasena !== contrasena2) {
        alert("Las contraseñas no coinciden.");
        return;
      }
    }

    const payload: UpdateUsuarioPayload = {
      nombres,
      apellidos,
      email,
      rol,
      activo,
      ...(contrasena ? { contrasena } : {}),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombres *</label>
          <input
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
          <input
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as RolUsuario)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
              Activo
            </label>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {initialData ? "Nueva contraseña (opcional)" : "Contraseña *"}
          </label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required={!initialData}
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {initialData ? "Confirmar (si cambias)" : "Confirmar contraseña *"}
          </label>
          <input
            type="password"
            value={contrasena2}
            onChange={(e) => setContrasena2(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required={!initialData}
            minLength={6}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
