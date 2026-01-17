import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const labelMap: Record<string, string> = {
  admin: "Panel",
  admisiones: "Admisiones",
  contactos: "Contactos",
  foro: "Foro",
  informaciones: "Información del Colegio",
};

export const AdminBreadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean); // ["admin","admisiones","123"]

  // Solo se muestran breadcrumbs para rutas /admin/...
  if (!segments[0] || segments[0] !== "admin") return null;

  const crumbs = segments.map((seg, idx) => {
    const path = "/" + segments.slice(0, idx + 1).join("/");
    const isLast = idx === segments.length - 1;
    const label = labelMap[seg] || seg;

    return { path, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1 text-xs text-slate-500 mb-2">
      {crumbs.map((c, idx) => (
        <span key={c.path} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight size={12} className="text-slate-400" />}
          {c.isLast ? (
            <span className="font-semibold text-slate-700">{c.label}</span>
          ) : (
            <Link to={c.path} className="hover:text-slate-700">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};
