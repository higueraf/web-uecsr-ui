import { useState } from "react";
import type { ForoCategoria, ForoPreguntaPayloadPublic } from "../api/foroApi";

const categorias: { value: ForoCategoria; label: string }[] = [
  { value: "NOTICIA", label: "Noticias" },
  { value: "EVENTO", label: "Eventos" },
  { value: "ADMISION", label: "Admisión" },
  { value: "INFORMACION", label: "Información" },
  { value: "OTRO", label: "Otros" },
];

export const ForoPreguntaPublicForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: ForoPreguntaPayloadPublic) => Promise<void> | void;
  onCancel: () => void;
}) => {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState<ForoCategoria>("OTRO");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!titulo.trim() || !contenido.trim()) {
      setErrorMsg("Título y contenido son obligatorios.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        categoria,
      });
      setTitulo("");
      setContenido("");
      setCategoria("OTRO");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "No se pudo crear la pregunta.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {errorMsg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            maxLength={200}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as ForoCategoria)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            {categorias.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contenido *</label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm min-h-[160px]"
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            Tu pregunta será revisada antes de publicarse.
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg text-sm"
          disabled={submitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Enviando..." : "Publicar pregunta"}
        </button>
      </div>
    </form>
  );
};
