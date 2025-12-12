import { useEffect, useState } from "react";
import { getForoPublic, type ForoCategoria, type ForoPreguntaPublic } from "../api/foroApi";
import { ForoCategoryBadge } from "../components/ForoCategoryBadge";
import { MessageCircle, User, MessageSquare } from "lucide-react";

const categorias: { value: ForoCategoria | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "NOTICIA", label: "Noticias" },
  { value: "EVENTO", label: "Eventos" },
  { value: "ADMISION", label: "Admisión" },
  { value: "INFORMACION", label: "Información" },
  { value: "OTRO", label: "Otros" },
];

const datosEjemplo: ForoPreguntaPublic[] = [
  {
    id: "1",
    titulo: "Estrategias de aprendizaje en casa",
    contenido: "Compartamos estrategias para complementar la educación desde el hogar...",
    categoria: "NOTICIA",
    autorNombre: "María González",
    createdAt: new Date().toISOString(),
    respuestasCount: 12,
  },
  {
    id: "2",
    titulo: "Próximo evento de integración familiar",
    contenido: "Estamos organizando un evento para fortalecer la comunidad educativa...",
    categoria: "EVENTO",
    autorNombre: "Carlos Rodríguez",
    createdAt: new Date().toISOString(),
    respuestasCount: 8,
  },
  {
    id: "3",
    titulo: "Proceso de admisión 2025",
    contenido: "Información sobre los requisitos y fechas importantes para el próximo año...",
    categoria: "ADMISION",
    autorNombre: "Ana Martínez",
    createdAt: new Date().toISOString(),
    respuestasCount: 15,
  },
];

export const ForoPublicPage = () => {
  const [data, setData] = useState<{ items: ForoPreguntaPublic[]; meta?: any } | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState<ForoCategoria | "todas">("todas");

  const load = async () => {
    try {
      const res = await getForoPublic(page, search, categoria === "todas" ? undefined : categoria);
      const items = Array.isArray(res?.items) ? res.items : [];
      if (items.length === 0) {
        setData({ items: datosEjemplo });
        return;
      }
      setData(res);
    } catch {
      setData({ items: datosEjemplo });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    load();
  }, [page, search, categoria]);

  const items = data?.items?.length ? data.items : datosEjemplo;

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="py-10 md:py-20 bg-gray-50 min-h-[60vh]">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3 mb-4 md:mb-0">
                <MessageCircle className="text-blue-600 w-8 h-8" />
                <span>Discusiones de la Comunidad</span>
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
              <input
                type="text"
                placeholder="Buscar pregunta..."
                className="border rounded p-2 w-full md:w-72"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="border rounded p-2 w-full md:w-56"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
              >
                {categorias.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-6">
              {items.map((discussion: any) => (
                <div key={discussion.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2">
                    <h3 className="text-xl font-semibold text-gray-800">{discussion.titulo}</h3>
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full whitespace-nowrap">
                      Activo
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{discussion.contenido}</p>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-500 gap-2">
                    <div className="flex items-center space-x-4 flex-wrap">
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{discussion.autorNombre || "Anónimo"}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{discussion.respuestasCount || 0} respuestas</span>
                      </span>
                      <ForoCategoryBadge categoria={discussion.categoria} />
                    </div>
                    <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button className="px-4 py-2 border rounded disabled:opacity-50" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Anterior
              </button>
              <button className="px-4 py-2 border rounded" onClick={() => setPage((p) => p + 1)}>
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
