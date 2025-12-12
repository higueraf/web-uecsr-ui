// src/features/auth/pages/LoginPage.tsx
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLoadingStore } from "@/store/loadingStore";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loading = useLoadingStore((state) => state.loading);

  const [form, setForm] = useState({
    email: "",
    contrasena: "",
  });

  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const usuario = await login({
        email: form.email,
        contrasena: form.contrasena,
      });

      if (usuario.rol === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      setError("Credenciales inválidas o error de servidor.");
      console.error(err);
    }
  };

  const isFormValid =
    form.email.trim() !== "" && form.contrasena.trim() !== "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Control de Acceso
            </h1>
            <p className="text-slate-600 text-lg mb-8 text-center">
              Plataforma Unidad Educativa Colegio Simón Rodríguez
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="admin@colegio-eca.edu"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.contrasena}
                  onChange={(e) => set("contrasena", e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-center">
                    {error}
                  </p>
                </div>
              )}

              <div className="text-center">
                <button
                  className={`mt-2 py-3 px-8 rounded-lg font-bold text-lg shadow-xl transition duration-300 ${
                    isFormValid && !loading
                      ? "bg-yellow-500 text-blue-900 hover:bg-yellow-400 cursor-pointer"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                  type="submit"
                  disabled={!isFormValid || loading}
                >
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              ¿Aún no tienes cuenta?{" "}
              <Link
                to="/registro"
                className="text-blue-700 font-semibold hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
