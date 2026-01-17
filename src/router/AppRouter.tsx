import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { HomePage } from "@/pages/HomePage";
import { NoticiasEventosPage } from "@/pages/NoticiasEventosPage";
import { NosotrosPage } from "@/pages/NosotrosPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { MiCuentaPage } from "@/features/auth/pages/MiCuentaPage";
import { NoticiasPublicListPage } from "@/features/noticias/pages/NoticiasPublicListPage";
import { NoticiaDetailPage } from "@/features/noticias/pages/NoticiaDetailPage";
import { EventoDetailPage } from "@/features/eventos/pages/EventoDetailPage";
import { ForoPublicPage } from "@/features/foro/pages/ForoPublicPage";
import { PreguntaDetallePage } from "@/features/foro/pages/PreguntaDetallePage";
import { AdminDashboardPage } from "@/features/dashboard/pages/AdminDashboardPage";
import { ForoAdminPage } from "@/features/foro/pages/ForoAdminPage";
import { NoticiasAdminListPage } from "@/features/noticias/pages/NoticiasAdminListPage";
import { NoticiasCreatePage } from "@/features/noticias/pages/NoticiasCreatePage";
import { NoticiasEditPage } from "@/features/noticias/pages/NoticiasEditPage";
import { EventosAdminListPage } from "@/features/eventos/pages/EventosAdminListPage";
import { EventosCreatePage } from "@/features/eventos/pages/EventosCreatePage";
import { EventosEditPage } from "@/features/eventos/pages/EventosEditPage";
import { PreguntasFrecuentesPage } from "@/pages/PreguntasFrecuentes";
import { ContactoPublicPage } from "@/pages/ContactoPublicPage";
import { UsuariosAdminPage } from "@/features/usuarios/pages/UsuariosAdminPage";
import { PreguntaDetalleAdminPage } from "@/features/foro/components/PreguntaDetalleAdminPage";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/noticias-eventos" element={<NoticiasEventosPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentesPage />} />
        <Route path="/contacto" element={<ContactoPublicPage />} />
        <Route path="/noticias" element={<NoticiasPublicListPage />} />
        <Route path="/noticias/:id" element={<NoticiaDetailPage />} />
        <Route path="/eventos/:id" element={<EventoDetailPage />} />
        <Route path="/foro" element={<ForoPublicPage />} />
        <Route path="/foro/:id" element={<PreguntaDetallePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/mi-cuenta" element={<MiCuentaPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="foro" element={<ForoAdminPage />} />
           <Route path="foro/:id" element={<PreguntaDetalleAdminPage />} />
          <Route path="noticias" element={<NoticiasAdminListPage />} />
          <Route path="noticias/crear" element={<NoticiasCreatePage />} />
          <Route path="noticias/:id" element={<NoticiasEditPage />} />
          <Route path="eventos" element={<EventosAdminListPage />} />
          <Route path="eventos/crear" element={<EventosCreatePage />} />
          <Route path="eventos/:id" element={<EventosEditPage />} />
          <Route path="usuarios" element={<UsuariosAdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
