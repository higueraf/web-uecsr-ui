import type { RolUsuario } from "../api/usuariosApi";

interface Props {
  rol: RolUsuario;
}

const MAP: Record<RolUsuario, { label: string; classes: string }> = {
  ADMIN: { label: "ADMIN", classes: "bg-blue-100 text-blue-800" },
  STAFF: { label: "STAFF", classes: "bg-purple-100 text-purple-800" },
  PUBLICO: { label: "PÚBLICO", classes: "bg-slate-100 text-slate-800" },
};

export const UsuarioRoleBadge = ({ rol }: Props) => {
  const cfg = MAP[rol] || MAP.PUBLICO;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
};
