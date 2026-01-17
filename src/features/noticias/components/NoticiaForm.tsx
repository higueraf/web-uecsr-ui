import { useEffect, useState, useRef } from "react";
import type {
  Noticia,
  NoticiaPayload,
  EstadoNoticia,
} from "@/features/noticias/api/noticiasApi";
import { getImageUrl } from "@/utils/imageUrl";

interface Props {
  initialData?: Noticia;
  onSubmit: (data: NoticiaPayload) => Promise<void> | void;
  submitLabel: string;
}

const estados: EstadoNoticia[] = ["BORRADOR", "PUBLICADO", "OCULTO"];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const NoticiaForm = ({ initialData, onSubmit, submitLabel }: Props) => {
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [resumen, setResumen] = useState("");
  const [contenido, setContenido] = useState("");
  const [estado, setEstado] = useState<EstadoNoticia>("BORRADOR");
  const [destacado, setDestacado] = useState<boolean>(false);
  const [orden, setOrden] = useState<number>(0);
  const [fechaPublicacion, setFechaPublicacion] = useState<string>("");

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo ?? "");
      setSlug(initialData.slug ?? "");
      setResumen(initialData.resumen ?? "");
      setContenido(initialData.contenido ?? "");
      setEstado(initialData.estado ?? "BORRADOR");
      setDestacado(initialData.destacado ?? false);
      setOrden(initialData.orden ?? 0);
      setFechaPublicacion(
        initialData.fechaPublicacion
          ? initialData.fechaPublicacion.substring(0, 10)
          : ""
      );
      setPreviewUrl(getImageUrl(initialData.imagenUrl));
    } else {
      setTitulo("");
      setSlug("");
      setResumen("");
      setContenido("");
      setEstado("BORRADOR");
      setDestacado(false);
      setOrden(0);
      setFechaPublicacion("");
      setPreviewUrl(undefined);
      setImagenFile(null);
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData && titulo && !slug) {
      setSlug(slugify(titulo));
    }
  }, [titulo, slug, initialData]);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagenFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: NoticiaPayload = {
      titulo,
      slug,
      resumen: resumen || undefined,
      contenido,
      imagen: imagenFile ?? undefined,
      estado,
      destacado,
      orden,
      fechaPublicacion: fechaPublicacion || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 max-w-4xl"
    >
      <div className="grid md:grid-cols-[2fr,2fr] gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Título
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Slug
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-[2fr,1fr,1fr] gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Resumen
          </label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]"
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Estado
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoNoticia)}
          >
            {estados.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <label className="block text-xs font-semibold text-slate-700 mt-3 mb-1">
            Orden
          </label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={orden}
            onChange={(e) => setOrden(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Fecha de publicación
          </label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={fechaPublicacion}
            onChange={(e) => setFechaPublicacion(e.target.value)}
          />

          <div className="mt-3 flex items-center gap-2">
            <input
              id="destacado"
              type="checkbox"
              checked={destacado}
              onChange={(e) => setDestacado(e.target.checked)}
            />
            <label
              htmlFor="destacado"
              className="text-xs text-slate-700 select-none"
            >
              Destacar noticia en el inicio
            </label>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr,2fr] gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Imagen principal
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagenChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            Seleccionar archivo
          </button>

          {imagenFile && (
            <p className="text-xs text-slate-600 mt-2">
              Archivo seleccionado:{" "}
              <span className="font-medium">{imagenFile.name}</span>
            </p>
          )}

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Previsualización"
              className="mt-3 rounded-lg border w-full h-32 object-cover"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Contenido
          </label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm min-h-[200px]"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
