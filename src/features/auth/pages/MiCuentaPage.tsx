import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CuentaForm } from "@/features/auth/components/CuentaForm";

export const MiCuentaPage = () => {
  const { user, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated || !user) {
      navigate("/admin/login", { replace: true });
    }
  }, [initializing, isAuthenticated, user, navigate]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (values: {
    nombres: string;
    apellidos: string;
    contrasenaActual: string;
    nuevaContrasena: string;
    confirmarContrasena: string;
  }) => {
    console.log("Actualizar cuenta:", values);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center text-blue-800 mb-2">
          Mi cuenta
        </h1>
        <p className="text-sm text-center text-slate-500 mb-8">
          Actualiza tus datos personales y, si lo deseas, cambia tu contraseña.
        </p>

        <CuentaForm
          initialNombres={user.nombres}
          initialApellidos={user.apellidos}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
