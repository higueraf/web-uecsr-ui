// src/features/auth/components/RegisterUsuarioForm.tsx
import { useState } from "react";
import type { RegisterUsuarioPayload } from "../types/RegisterUsuarioPayload";

interface Props {
  onSubmit: (data: RegisterUsuarioPayload) => Promise<void> | void;
}

export const RegisterUsuarioForm: React.FC<Props> = ({ onSubmit }) => {
  const [form, setForm] = useState<RegisterUsuarioPayload>({
    nombres: "",
    apellidos: "",
    email: "",
    contrasena: "",
  });

  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = (key: keyof RegisterUsuarioPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMsg("");

    if (
      !form.nombres.trim() ||
      !form.apellidos.trim() ||
      !form.email.trim() ||
      !form.contrasena.trim()
    ) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

    if (
      form.nombres.length > 150 ||
      form.apellidos.length > 150 ||
      form.email.length > 150
    ) {
      setErrorMsg(
        "Los campos nombres, apellidos y correo no deben superar los 150 caracteres."
      );
      return;
    }

    if (form.contrasena.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setSubmitting(true);

      // DEBUG (puedes quitarlo luego)
      console.log("[RegisterUsuarioForm] submit payload:", form);

      await onSubmit(form);

      setSuccess(true);
      setForm({
        nombres: "",
        apellidos: "",
        email: "",
        contrasena: "",
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Ocurrió un error al registrarse. Intente nuevamente.";

      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-extrabold text-center text-blue-800 mb-2">
          Registro de usuario
        </h2>

        <p className="text-sm text-center text-slate-500 mb-6">
          Crea tu cuenta para acceder a la plataforma de la Unidad Educativa
          Colegio Simón Rodríguez.
        </p>

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm px-3 py-2">
            ¡Registro exitoso! Ahora puedes iniciar sesión.
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {errorMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nombres
            </label>
            <input
              type="text"
              maxLength={150}
              value={form.nombres}
              onChange={(e) => setField("nombres", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese sus nombres"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Apellidos
            </label>
            <input
              type="text"
              maxLength={150}
              value={form.apellidos}
              onChange={(e) => setField("apellidos", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese sus apellidos"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              maxLength={150}
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ejemplo@csr.edu.ec"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              minLength={6}
              value={form.contrasena}
              onChange={(e) => setField("contrasena", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Registrando..." : "Registrarme"}
          </button>
        </form>
      </div>
    </div>
  );
};
