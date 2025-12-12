import { useNavigate } from "react-router-dom";
import { EventoForm } from "../components/EventoForm";
import { createEvento, type EventoPayload } from "@/features/eventos/api/eventosApi";

export const EventosCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: EventoPayload) => {
    await createEvento(data);
    navigate("/admin/eventos");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Crear evento</h1>
        <p className="text-sm text-slate-500">
          Registra un nuevo evento para el sitio institucional.
        </p>
      </div>

      <EventoForm onSubmit={handleSubmit} submitLabel="Guardar evento" />
    </div>
  );
};
