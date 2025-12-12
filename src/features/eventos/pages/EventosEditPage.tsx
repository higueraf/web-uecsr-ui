import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEventoById,
  updateEvento,
  type Evento,
  type EventoPayload,
} from "@/features/eventos/api/eventosApi";
import { EventoForm } from "../components/EventoForm";

export const EventosEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<Evento | null>(null);

  useEffect(() => {
    if (!id) return;
    getEventoById(Number(id)).then(setEvento);
  }, [id]);

  const handleSubmit = async (data: EventoPayload) => {
    if (!id) return;
    await updateEvento(Number(id), data);
    navigate("/admin/eventos");
  };

  if (!evento) {
    return (
      <p className="text-sm text-slate-500">Cargando evento...</p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Editar evento</h1>
        <p className="text-sm text-slate-500">
          Modifica los datos del evento seleccionado.
        </p>
      </div>

      <EventoForm
        initialData={evento}
        onSubmit={handleSubmit}
        submitLabel="Actualizar evento"
      />
    </div>
  );
};
