import { Link, useLocation } from "react-router-dom";
import { LogoUECSR } from "./LogoUECSR";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Newspaper,
  CalendarDays,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/foro", label: "Foro", icon: MessageSquare },
  { to: "/admin/noticias", label: "Noticias", icon: Newspaper },
  { to: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { to: "/admin/usuarios", label: "Usuarios", icon: Users },
  
];

export const AdminSidebar = ({ isOpen, onClose }: Props) => {
  const { pathname } = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static left-0 top-0 z-50 h-full w-64 bg-[#0F2A73] text-blue-50 p-4 flex flex-col transition-transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        <div className="mb-6">
          <LogoUECSR  />
        </div>

        <nav className="flex-1 space-y-1 text-sm">
          {links.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition
                  ${
                    active
                      ? "bg-white text-blue-900 shadow-sm"
                      : "text-blue-100 hover:bg-blue-800/80 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto text-[11px] text-blue-100/80">
          Panel Administrativo · v1.0
        </div>
      </aside>
    </>
  );
};
