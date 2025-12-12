import { useEffect, useRef, useState } from "react";
import type {
  Evento,
  EventoPayload,
  EstadoEvento,
  CategoriaEvento,
  EventoComentario,
} from "@/features/eventos/api/eventosApi";
import {
  getEventoComentarios,
  deleteEventoComentario,
  toggleAprobarEventoComentario,
} from "@/features/eventos/api/eventosApi";
import { getImageUrl } from "@/utils/imageUrl";

interface Props {
  initialData?: Evento;
  onSubmit: (data: EventoPayload) => Promise<void> | void;
  submitLabel: string;
}

const estados: EstadoEvento[] = [
  "PROGRAMADO",
  "EN_CURSO",
  "FINALIZADO",
  "CANCELADO",
];

const categorias: CategoriaEvento[] = [
  "ACADÉMICO",
  "CULTURAL",
  "DEPORTES",
  "ADMISIONES",
  "AMBIENTAL",
  "GENERAL",
];

export const EventoForm = ({ initialData, onSubmit, submitLabel }: Props) => {
  const [titulo, setTitulo] = useState(initialData?.titulo ?? "");
  const [resumen, setResumen] = useState(initialData?.resumen ?? "");
  const [descripcion, setDescripcion] = useState(initialData?.descripcion ?? "");
  const [fechaInicio, setFechaInicio] = useState(
    initialData?.fechaInicio ? initialData.fechaInicio.substring(0, 10) : ""
  );
  const [fechaFin, setFechaFin] = useState(
    initialData?.fechaFin ? initialData.fechaFin.substring(0, 10) : ""
  );
  const [lugar, setLugar] = useState(initialData?.lugar ?? "");
  const [estado, setEstado] = useState<EstadoEvento>(
    initialData?.estado ?? "PROGRAMADO"
  );
  const [categoria, setCategoria] = useState<CategoriaEvento>(
    initialData?.categoria ?? "GENERAL"
  );
  const [orden, setOrden] = useState<number>(initialData?.orden ?? 0);

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    getImageUrl(initialData?.imagenUrl)
  );

  const [comentarios, setComentarios] = useState<EventoComentario[]>([]);
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [soloAprobados, setSoloAprobados] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!initialData && !fechaInicio) {
      setFechaInicio(new Date().toISOString().substring(0, 10));
    }
  }, [initialData, fechaInicio]);

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo ?? "");
      setResumen(initialData.resumen ?? "");
      setDescripcion(initialData.descripcion ?? "");
      setFechaInicio(
        initialData.fechaInicio
          ? initialData.fechaInicio.substring(0, 10)
          : ""
      );
      setFechaFin(
        initialData.fechaFin
          ? initialData.fechaFin.substring(0, 10)
          : ""
      );
      setLugar(initialData.lugar ?? "");
      setEstado(initialData.estado ?? "PROGRAMADO");
      setCategoria(initialData.categoria ?? "GENERAL");
      setOrden(initialData.orden ?? 0);
      setPreviewUrl(getImageUrl(initialData.imagenUrl));
      setImagenFile(null);
    } else {
      setTitulo("");
      setResumen("");
      setDescripcion("");
      setFechaInicio(new Date().toISOString().substring(0, 10));
      setFechaFin("");
      setLugar("");
      setEstado("PROGRAMADO");
      setCategoria("GENERAL");
      setOrden(0);
      setPreviewUrl(undefined);
      setImagenFile(null);
      setComentarios([]);
    }
  }, [initialData]);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagenFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const cargarComentarios = async () => {
    if (!initialData?.id) return;
    setLoadingComentarios(true);
    try {
      const data = await getEventoComentarios(
        initialData.id,
        soloAprobados
      );
      setComentarios(data);
    } finally {
      setLoadingComentarios(false);
    }
  };

  useEffect(() => {
    cargarComentarios();
  }, [initialData?.id, soloAprobados]);

  const handleAprobar = async (comentarioId: number) => {
    if (!initialData?.id) return;
    await toggleAprobarEventoComentario(initialData.id, comentarioId);
    await cargarComentarios();
  };

  const handleEliminarComentario = async (comentarioId: number) => {
    if (!initialData?.id) return;
    if (!confirm("¿Eliminar este comentario?")) return;
    await deleteEventoComentario(initialData.id, comentarioId);
    await cargarComentarios();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: EventoPayload = {
      titulo,
      resumen,
      descripcion: descripcion || undefined,
      fechaInicio,
      fechaFin: fechaFin || undefined,
      lugar,
      estado,
      categoria,
      orden,
      imagen: imagenFile,
    };
    await onSubmit(payload);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 max-w-4xl"
      >
        <div className="grid md:grid-cols-[2fr,1fr] gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título del evento
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />

            <label className="block text-xs font-semibold text-slate-700 mb-1 mt-3">
              Resumen
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]"
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estado
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={estado}
                onChange={(e) =>
                  setEstado(e.target.value as EstadoEvento)
                }
              >
                {estados.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoría
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={categoria}
                onChange={(e) =>
                  setCategoria(e.target.value as CategoriaEvento)
                }
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                Lugar
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr,1fr] gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fecha de inicio
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fecha de fin
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
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
              Descripción
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm min-h-[200px]"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
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
    </div>
  );
};
