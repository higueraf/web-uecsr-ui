import type { ForoEstadoAdmin } from "../api/foroApi";

const MAP: Record<ForoEstadoAdmin, { label: string; classes: string }> = {
  NUEVA: { label: "NUEVA", classes: "bg-yellow-100 text-yellow-800" },
  APROBADA: { label: "APROBADA", classes: "bg-green-100 text-green-800" },
  RECHAZADA: { label: "RECHAZADA", classes: "bg-red-100 text-red-800" },
  OCULTA: { label: "OCULTA", classes: "bg-slate-200 text-slate-800" },
};

export const ForoStatusBadge = ({ estado }: { estado: ForoEstadoAdmin }) => {
  const cfg = MAP[estado];
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>{cfg.label}</span>;
};
