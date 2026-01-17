interface Props {
  activo: boolean;
}

export const UsuarioStatusBadge = ({ activo }: Props) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        activo ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
      }`}
    >
      {activo ? "ACTIVO" : "INACTIVO"}
    </span>
  );
};
