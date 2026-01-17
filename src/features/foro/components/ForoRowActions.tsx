import { deletePregunta, toggleOcultaPregunta } from "../api/foroApi";

export const ForoRowActions = ({ id, onRefresh }: { id: string; onRefresh: () => void }) => {
  const eliminar = async () => {
    if (!confirm("¿Eliminar esta pregunta del foro?")) return;
    await deletePregunta(id);
    onRefresh();
  };

  const toggle = async () => {
    await toggleOcultaPregunta(id);
    onRefresh();
  };

  return (
    <div className="flex gap-2 justify-center">
      <button className="text-blue-600 text-sm hover:underline" onClick={toggle}>
        Mostrar/Ocultar
      </button>
      <button className="text-red-500 text-sm hover:underline" onClick={eliminar}>
        Eliminar
      </button>
    </div>
  );
};
