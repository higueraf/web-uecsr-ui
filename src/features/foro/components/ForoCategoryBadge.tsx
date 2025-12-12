import type { ForoCategoria } from "../api/foroApi";

const MAP: Record<ForoCategoria, { label: string; classes: string }> = {
  NOTICIA: { label: "Noticias", classes: "bg-blue-100 text-blue-800" },
  EVENTO: { label: "Eventos", classes: "bg-emerald-100 text-emerald-800" },
  ADMISION: { label: "Admisión", classes: "bg-purple-100 text-purple-800" },
  INFORMACION: { label: "Información", classes: "bg-slate-100 text-slate-800" },
  OTRO: { label: "Otros", classes: "bg-slate-100 text-slate-800" },
};

export const ForoCategoryBadge = ({ categoria }: { categoria: ForoCategoria }) => {
  const cfg = MAP[categoria];
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>{cfg.label}</span>;
};
