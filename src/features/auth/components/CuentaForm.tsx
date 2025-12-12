import { useState } from "react";

interface CuentaFormProps {
  initialNombres: string;
  initialApellidos: string;
  onSubmit: (data: {
    nombres: string;
    apellidos: string;
    contrasenaActual: string;
    nuevaContrasena: string;
    confirmarContrasena: string;
  }) => Promise<void> | void;
}

export const CuentaForm: React.FC<CuentaFormProps> = ({
  initialNombres,
  initialApellidos,
  onSubmit,
}) => {
  const [nombres, setNombres] = useState(initialNombres);
  const [apellidos, setApellidos] = useState(initialApellidos);
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nombres.trim() || !apellidos.trim()) {
      setErrorMsg("Los campos nombres y apellidos son obligatorios.");
      return;
    }

    const quiereCambiarContrasena =
      contrasenaActual.trim() ||
      nuevaContrasena.trim() ||
      confirmarContrasena.trim();

    if (quiereCambiarContrasena) {
      if (
        !contrasenaActual.trim() ||
        !nuevaContrasena.trim() ||
        !confirmarContrasena.trim()
      ) {
        setErrorMsg(
          "Para cambiar la contraseña debes completar todos los campos de contraseña."
        );
        return;
      }

      if (nuevaContrasena.length < 6) {
        setErrorMsg("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }

      if (nuevaContrasena !== confirmarContrasena) {
        setErrorMsg("La confirmación de la contraseña no coincide.");
        return;
      }
    }

    try {
      setSubmitting(true);
      await onSubmit({
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        contrasenaActual: contrasenaActual.trim(),
        nuevaContrasena: nuevaContrasena.trim(),
        confirmarContrasena: confirmarContrasena.trim(),
      });
      setSuccessMsg("Datos actualizados correctamente.");
      setContrasenaActual("");
      setNuevaContrasena("");
      setConfirmarContrasena("");
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          "Ocurrió un error al actualizar tu cuenta. Intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Datos personales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nombres
            </label>
            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tus nombres"
              maxLength={150}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Apellidos
            </label>
            <input
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tus apellidos"
              maxLength={150}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Cambio de contraseña
        </h2>
        <p className="text-xs text-slate-500">
          Si no deseas cambiar tu contraseña, puedes dejar estos campos en
          blanco.
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Contraseña actual
            </label>
            <input
              type="password"
              value={contrasenaActual}
              onChange={(e) => setContrasenaActual(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Introduce tu contraseña actual"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Repite la nueva contraseña"
              />
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm px-3 py-2">
          {successMsg}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-lg bg-blue-700 text-white font-semibold text-sm shadow-md hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
};
