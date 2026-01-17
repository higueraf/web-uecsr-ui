import { useEffect, useState } from "react";
import type { ForoCategoria, ForoEstadoAdmin, ForoPreguntaAdmin, ForoPreguntaPayloadAdmin } from "../api/foroApi";

const categorias: ForoCategoria[] = ["NOTICIA", "EVENTO", "ADMISION", "INFORMACION", "OTRO"];
const estados: ForoEstadoAdmin[] = ["NUEVA", "APROBADA", "RECHAZADA", "OCULTA"];

export const ForoForm = ({
  initialData,
  onSubmit,
  submitLabel,
  onCancel,
}: {
  initialData?: ForoPreguntaAdmin;
  onSubmit: (data: ForoPreguntaPayloadAdmin) => Promise<void> | void;
  submitLabel: string;
  onCancel: () => void;
}) => {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState<ForoCategoria>("OTRO");
  const [estado, setEstado] = useState<ForoEstadoAdmin>("NUEVA");
  const [respuestaAdmin, setRespuestaAdmin] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setTitulo(initialData.titulo ?? "");
    setContenido(initialData.contenido ?? "");
    setCategoria(initialData.categoria ?? "OTRO");
    setEstado(initialData.estado ?? "NUEVA");
    setRespuestaAdmin(initialData.respuestaAdmin ?? "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      titulo,
      contenido,
      categoria,
      estado,
      respuestaAdmin: respuestaAdmin || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as ForoCategoria)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contenido *</label>
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm min-h-[150px]"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado (Admin)</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as ForoEstadoAdmin)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            {estados.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Respuesta oficial (opcional)</label>
          <input
            value={respuestaAdmin}
            onChange={(e) => setRespuestaAdmin(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
