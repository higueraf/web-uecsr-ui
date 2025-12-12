import { Link } from "react-router-dom";
import { deleteEvento, type Evento } from "@/features/eventos/api/eventosApi";

interface Props {
  evento: Evento;
  onRefresh: () => void;
}

export const EventoRowActions = ({ evento, onRefresh }: Props) => {
  const handleDelete = async () => {
    if (!confirm("¿Eliminar este evento?")) return;
    await deleteEvento(evento.id);
    onRefresh();
  };

  return (
    <div className="flex items-center gap-2 justify-end text-xs">
      <Link
        to={`/admin/eventos/${evento.id}`}
        className="text-blue-600 hover:underline"
      >
        Editar
      </Link>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:underline"
      >
        Eliminar
      </button>
    </div>
  );
};
