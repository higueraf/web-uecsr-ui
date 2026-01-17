import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Newspaper,
  School,
  MessageCircle,
  Phone,
  Settings,
  Menu,
  X,
  User,
  type LucideIcon,
  HelpCircle,
} from "lucide-react";

import logoImage from "/logo.jpeg";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  isAdmin?: boolean;
};

const navItems: NavItem[] = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/noticias-eventos", label: "Noticias y Eventos", icon: Newspaper },
  { to: "/nosotros", label: "Nosotros", icon: School },
  { to: "/foro", label: "Foro", icon: MessageCircle },
  { to: "/preguntas-frecuentes", label: "Preguntas Frecuentes", icon: HelpCircle },
  { to: "/contacto", label: "Contacto", icon: Phone },
  { to: "/admin", label: "Administración", icon: Settings, isAdmin: true },
];

interface PublicNavbarProps {
  showAdmin?: boolean;
  isAdmin?: boolean;
  currentUserName?: string;
  isAuthenticated?: boolean;
  onEditSchoolInfo?: () => void;
  onGoToAccount?: () => void;
  onLogout?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  showAdmin = false,
  currentUserName,
  isAuthenticated,
  onGoToAccount,
  onLogout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter((item) => !item.isAdmin || showAdmin);
  const isLogged =
    typeof isAuthenticated === "boolean" ? isAuthenticated : !!currentUserName;

  const goToLogin = () => {
    navigate("/admin/login");
    setMobileOpen(false);
  };

  const goToAccount = () => {
    if (onGoToAccount) onGoToAccount();
    else navigate("/mi-cuenta");
    setMenuOpen(false);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-lg">
      <div className="bg-white px-6 h-20 flex items-start">
        <div className="max-w-7xl mx-auto w-full flex items-start justify-between gap-4 pt-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-start gap-3 p-0 rounded-lg group text-left"
          >
            <div className="rounded-lg bg-white shadow-sm group-hover:scale-[1.02] transition-transform">
              <img
                src={logoImage}
                alt="Logo Colegio Simón Rodríguez"
                className="h-18 w-18 md:h-18 md:w-18 object-contain"
              />
            </div>

            <div className="leading-none">
              <h1 className="m-0 text-xl md:text-xl font-bold text-gray-800 leading-tight">
                Unidad Educativa Colegio Simón Rodríguez
              </h1>
              <p className="m-0 mt-0.5 text-xs md:text-sm text-gray-500 italic leading-tight">
                Excelencia Académica
              </p>
            </div>
          </button>

          <div className="hidden md:flex items-start gap-3 pt-1">
            {isLogged && (
              <div className="flex items-start gap-3">
                <span className="text-sm font-medium text-slate-700 truncate max-w-[180px] mt-1">
                  Hola, {currentUserName}
                </span>

                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="p-2 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    <User className="w-6 h-6 text-blue-700" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={goToAccount}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        Mi cuenta
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isLogged && (
              <button
                onClick={goToLogin}
                className="px-4 py-2 rounded-full bg-blue-700 text-white font-semibold text-sm shadow-md hover:bg-blue-800 transition-colors"
              >
                Iniciar sesión
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-full text-blue-700 hover:bg-blue-50"
            >
              {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex justify-center bg-blue-700">
        <nav className="max-w-7xl mx-auto px-6 flex space-x-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center space-x-2 py-3 px-4 font-semibold border-b-4 transition ${
                    isActive
                      ? "text-blue-900 bg-white border-yellow-400 shadow-md"
                      : "text-white border-transparent hover:text-yellow-300 hover:bg-blue-800"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div
        className={`md:hidden bg-blue-700 shadow-xl transition-all ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-md text-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-white hover:bg-blue-600"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {!isLogged && (
            <button
              onClick={goToLogin}
              className="mt-2 w-full py-3 bg-white text-blue-700 rounded-md font-semibold shadow-md hover:bg-blue-50"
            >
              Iniciar sesión
            </button>
          )}

          {isLogged && (
            <>
              <button
                onClick={goToAccount}
                className="mt-2 w-full py-3 bg-white text-blue-700 rounded-md font-semibold shadow-md hover:bg-blue-50 text-left"
              >
                Mi cuenta
              </button>
              <button
                onClick={handleLogout}
                className="w-full mt-2 py-3 bg-red-600 text-white rounded-md font-semibold shadow-md hover:bg-red-700 text-left"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
