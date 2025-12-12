import { useNavigate } from "react-router-dom";
import { NoticiaForm } from "../components/NoticiaForm";
import { createNoticia, type NoticiaPayload } from "@/features/noticias/api/noticiasApi";

export const NoticiasCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: NoticiaPayload) => {
    await createNoticia(data);
    navigate("/admin/noticias");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Crear noticia</h1>
        <p className="text-sm text-slate-500">
          Registra una nueva noticia para el sitio institucional.
        </p>
      </div>

      <NoticiaForm onSubmit={handleSubmit} submitLabel="Guardar noticia" />
    </div>
  );
};
