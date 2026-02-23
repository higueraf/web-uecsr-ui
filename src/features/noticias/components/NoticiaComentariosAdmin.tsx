import { useEffect, useMemo, useState } from "react";
import { deleteNoticiaComentario, getNoticiaComentarios, toggleAprobacionNoticiaComentario, type NoticiaComentario } from "../api/noticiasApi";

export function NoticiaComentariosAdmin({ noticiaId }: { noticiaId: number }) {
  const [soloAprobados, setSoloAprobados] = useState(false);
  const [items, setItems] = useState<NoticiaComentario[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getNoticiaComentarios(noticiaId, soloAprobados);
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [noticiaId, soloAprobados]);

  const pendientes = useMemo(
    () => items.filter((i) => !i.aprobado).length,
    [items]
  );

  const toggleAprobado = async (comentarioId: number) => {
    await toggleAprobacionNoticiaComentario(noticiaId, comentarioId);
    await load();
  };

  const remove = async (comentarioId: number) => {
    if (!confirm("¿Eliminar comentario?")) return;
    await deleteNoticiaComentario(noticiaId, comentarioId);
    await load();
  };

  return (
    <div className="mt-6 border rounded p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Moderación de comentarios</h3>
          <p className="text-sm opacity-70">Pendientes: {pendientes}</p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={soloAprobados}
            onChange={(e) => setSoloAprobados(e.target.checked)}
          />
          Mostrar solo aprobados
        </label>
      </div>

      {loading ? (
        <p className="mt-4 text-sm">Cargando...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((c) => {
            const autor = c?.usuario
              ? `${c.usuario.nombres} ${c.usuario.apellidos}`
              : (c.nombreAutor ?? "Anónimo");

            // 👇 tu backend usa creadoEn o created_at; usa el que tengas
            const fechaRaw = c.creadoEn; 
            const fechaTxt = fechaRaw ? new Date(fechaRaw).toLocaleString() : "-";

            return (
              <div key={c.id} className="border rounded p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-medium">{autor}</span>
                    <span className="mx-2 opacity-60">·</span>
                    <span className="opacity-60">{fechaTxt}</span>
                    <span className="mx-2 opacity-60">·</span>
                    <span className={c.aprobado ? "text-green-600" : "text-yellow-600"}>
                      {c.aprobado ? "Aprobado" : "Pendiente"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 border rounded"
                      onClick={() => toggleAprobado(c.id)}
                    >
                      {c.aprobado ? "Desaprobar" : "Aprobar"}
                    </button>

                    <button
                      className="px-3 py-1 border rounded"
                      onClick={() => remove(c.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <p className="mt-2">{c.contenido}</p>
              </div>
            );
          })}

          {items.length === 0 && (
            <p className="text-sm opacity-70">No hay comentarios para mostrar.</p>
          )}
        </div>
      )}
    </div>
  );
}
