import { Link } from "react-router-dom";
import {
  deleteNoticia,
  togglePublicarNoticia,
  type Noticia,
} from "@/features/noticias/api/noticiasApi";

interface Props {
  noticia: Noticia;
  onRefresh: () => void;
}

export const NoticiaRowActions = ({ noticia, onRefresh }: Props) => {
  const handleDelete = async () => {
    const ok = confirm("¿Eliminar esta noticia?");
    if (!ok) return;
    await deleteNoticia(noticia.id);
    onRefresh();
  };

  const handleTogglePublicar = async () => {
    await togglePublicarNoticia(noticia.id);
    onRefresh();
  };

  const labelPublicar = noticia.estado === "PUBLICADO" ? "Ocultar" : "Publicar";

  return (
    <div className="flex items-center gap-2 justify-end text-xs">
      <Link
        to={`/admin/noticias/${noticia.id}`}
        className="text-blue-600 hover:underline"
      >
        Editar
      </Link>

      <button
        onClick={handleTogglePublicar}
        className="text-amber-600 hover:underline"
      >
        {labelPublicar}
      </button>

      <button
        onClick={handleDelete}
        className="text-red-600 hover:underline"
      >
        Eliminar
      </button>
    </div>
  );
};
