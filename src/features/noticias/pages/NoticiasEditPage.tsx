import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NoticiaForm } from "../components/NoticiaForm";
import {
  getNoticiaById,
  updateNoticia,
  type Noticia,
  type NoticiaPayload,
} from "@/features/noticias/api/noticiasApi";

export const NoticiasEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState<Noticia | null>(null);

  useEffect(() => {
    if (!id) return;
    getNoticiaById(Number(id)).then(setNoticia);
  }, [id]);

  const handleSubmit = async (data: NoticiaPayload) => {
    if (!id) return;
    await updateNoticia(Number(id), data);
    navigate("/admin/noticias");
  };

  if (!noticia) {
    return (
      <p className="text-sm text-slate-500">
        Cargando noticia...
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Editar noticia</h1>
        <p className="text-sm text-slate-500">
          Modifica el contenido y la configuración de la noticia seleccionada.
        </p>
      </div>

      <NoticiaForm
        initialData={noticia}
        onSubmit={handleSubmit}
        submitLabel="Actualizar noticia"
      />
    </div>
  );
};
