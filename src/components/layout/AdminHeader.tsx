import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  onToggleMenu: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export const AdminHeader = ({
  onToggleMenu,
  isAuthenticated = false,
  userName,
  onLogout,
}: AdminHeaderProps) => {
  const navigate = useNavigate();
  const handleGoToWeb = () => {
    console.log("click ir a la web");
    navigate("/");
  };
  return (
    <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center px-4 md:px-6 justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMenu}
          className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-start flex-col leading-tight">
          <span className="text-lg md:text-xl font-extrabold text-slate-900">
            Unidad Educativa Colegio Simón Rodríguez
          </span>
          <span className="text-xs md:text-sm text-slate-500 italic">
            Panel Administrativo
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <>
            <span className="hidden sm:inline text-sm text-slate-600">
              {userName ? `Hola, ${userName}` : "Usuario autenticado"}
            </span>

            {onLogout && (
              <>
                <button
                  onClick={handleGoToWeb}
                  className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold border border-green-600 hover:bg-green-700 hover:border-green-700 transition-colors shadow-sm cursor-pointer"
                >
                  Ir a la web
                </button>

                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};
