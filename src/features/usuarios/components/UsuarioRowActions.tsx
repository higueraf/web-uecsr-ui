import { deleteUsuario } from "../api/usuariosApi";

interface Props {
  id: number;
  onRefresh: () => void;
  onEdit: () => void;
}

export const UsuarioRowActions = ({ id, onRefresh, onEdit }: Props) => {
  const eliminar = async () => {
    if (!confirm("¿Eliminar este usuario?")) return;
    await deleteUsuario(id);
    onRefresh();
  };

  return (
    <div className="flex gap-3 justify-center">
      <button className="text-blue-600 text-sm hover:underline" onClick={onEdit}>
        Editar
      </button>
      <button className="text-red-500 text-sm hover:underline" onClick={eliminar}>
        Eliminar
      </button>
    </div>
  );
};
