import { useState } from "react";

interface DashboardStats {
  totalNoticias: number;
  noticiasPublicadas: number;
  noticiasBorrador: number;
  totalEventos: number;
  eventosProximos: number;
  eventosPasados: number;
  totalUsuarios: number;
  usuariosActivos: number;
  administradores: number;
  totalVisitas: number;
  tasaConversion: number;
}

export const AdminDashboardPage = () => {
  const fakeStats: DashboardStats = {
    totalNoticias: 42,
    noticiasPublicadas: 35,
    noticiasBorrador: 7,
    totalEventos: 18,
    eventosProximos: 5,
    eventosPasados: 13,
    totalUsuarios: 1247,
    usuariosActivos: 892,
    administradores: 8,
    totalVisitas: 12543,
    tasaConversion: 3.2,
  };

  const [stats, setStats] = useState<DashboardStats>(fakeStats);
  const [loading, setLoading] = useState(false);

  const refreshStats = () => {
    setLoading(true);
    
    setTimeout(() => {
      const refreshedStats = {
        totalNoticias: fakeStats.totalNoticias + Math.floor(Math.random() * 3),
        noticiasPublicadas: fakeStats.noticiasPublicadas + Math.floor(Math.random() * 2),
        noticiasBorrador: fakeStats.noticiasBorrador + Math.floor(Math.random() * 2),
        totalEventos: fakeStats.totalEventos + Math.floor(Math.random() * 2),
        eventosProximos: fakeStats.eventosProximos + Math.floor(Math.random() * 2),
        eventosPasados: fakeStats.eventosPasados,
        totalUsuarios: fakeStats.totalUsuarios + Math.floor(Math.random() * 10),
        usuariosActivos: fakeStats.usuariosActivos + Math.floor(Math.random() * 15),
        administradores: fakeStats.administradores,
        totalVisitas: fakeStats.totalVisitas + Math.floor(Math.random() * 100),
        tasaConversion: 3.2 + (Math.random() * 0.5 - 0.25),
      };
      
      setStats(refreshedStats);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Panel de Administración
          </h1>
          <p className="text-sm text-slate-500">
            Resumen de noticias, eventos y usuarios del sistema
          </p>
        </div>

        <button
          onClick={refreshStats}
          disabled={loading}
          className="self-start px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Actualizando..." : "Refrescar datos"}
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total de Noticias"
          value={stats.totalNoticias}
          subtitle="Artículos publicados y en borrador"
          accent="bg-blue-500"
          loading={loading}
        />

        <DashboardCard
          title="Noticias Publicadas"
          value={stats.noticiasPublicadas}
          subtitle="Visibles para los usuarios"
          accent="bg-emerald-500"
          loading={loading}
        />

        <DashboardCard
          title="Noticias en Borrador"
          value={stats.noticiasBorrador}
          subtitle="Pendientes de revisión"
          accent="bg-amber-500"
          loading={loading}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total de Eventos"
          value={stats.totalEventos}
          subtitle="Eventos creados en el sistema"
          accent="bg-purple-500"
          loading={loading}
        />

        <DashboardCard
          title="Próximos Eventos"
          value={stats.eventosProximos}
          subtitle="Programados para las próximas semanas"
          accent="bg-indigo-500"
          loading={loading}
        />

        <DashboardCard
          title="Eventos Pasados"
          value={stats.eventosPasados}
          subtitle="Eventos ya realizados"
          accent="bg-slate-500"
          loading={loading}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Usuarios Registrados"
          value={stats.totalUsuarios}
          subtitle="Total en la base de datos"
          accent="bg-teal-500"
          loading={loading}
        />

        <DashboardCard
          title="Usuarios Activos"
          value={stats.usuariosActivos}
          subtitle="Activos en los últimos 30 días"
          accent="bg-green-500"
          loading={loading}
        />

        <DashboardCard
          title="Administradores"
          value={stats.administradores}
          subtitle="Usuarios con permisos de admin"
          accent="bg-rose-500"
          loading={loading}
        />

        <DashboardCard
          title="Total de Visitas"
          value={stats.totalVisitas}
          subtitle="Visitas al sitio este mes"
          accent="bg-orange-500"
          loading={loading}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">
            Estado de las Noticias
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Distribución de artículos por estado de publicación
          </p>

          <div className="space-y-3">
            <ProgressRow
              label="Publicadas"
              value={stats.noticiasPublicadas}
              total={stats.totalNoticias}
              barClass="bg-emerald-400"
            />
            <ProgressRow
              label="En Borrador"
              value={stats.noticiasBorrador}
              total={stats.totalNoticias}
              barClass="bg-amber-400"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">
            Distribución de Eventos
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Eventos programados vs eventos ya realizados
          </p>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-bold text-slate-900">
              {stats.eventosProximos}
            </span>
            <span className="text-xs text-slate-500">
              próximos de {stats.totalEventos} eventos totales
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-indigo-500"
              style={{
                width:
                  stats.totalEventos > 0
                    ? `${Math.min(
                        100,
                        (stats.eventosProximos / stats.totalEventos) * 100
                      )}%`
                    : "0%",
              }}
            />
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Eventos próximos</span>
              <span className="text-slate-500">
                {stats.eventosProximos} ({stats.totalEventos > 0 ? Math.round((stats.eventosProximos / stats.totalEventos) * 100) : 0}%)
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Eventos pasados</span>
              <span className="text-slate-500">
                {stats.eventosPasados} ({stats.totalEventos > 0 ? Math.round((stats.eventosPasados / stats.totalEventos) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">
          Resumen de Métricas del Sistema
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Tasa de Conversión"
            value={`${stats.tasaConversion.toFixed(1)}%`}
            description="De visitantes a usuarios registrados"
            trend="up"
          />
          <MetricCard
            title="Actividad Usuarios"
            value={`${Math.round((stats.usuariosActivos / stats.totalUsuarios) * 100)}%`}
            description="Usuarios activos vs total"
            trend="up"
          />
          <MetricCard
            title="Publicaciones/Mes"
            value="12"
            description="Promedio de noticias mensuales"
            trend="stable"
          />
          <MetricCard
            title="Eventos/Mes"
            value="4"
            description="Promedio de eventos mensuales"
            trend="up"
          />
        </div>
      </section>
    </div>
  );
};

interface CardProps {
  title: string;
  value: number;
  subtitle: string;
  accent: string;
  loading: boolean;
}

const DashboardCard = ({ title, value, subtitle, accent, loading }: CardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {title}
        </p>
        <span className={`w-2 h-2 rounded-full ${accent}`} />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900">
          {loading ? "…" : value}
        </span>
      </div>

      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
};

interface ProgressRowProps {
  label: string;
  value: number;
  total: number;
  barClass: string;
}

const ProgressRow = ({ label, value, total, barClass }: ProgressRowProps) => {
  const percent = total > 0 ? Math.min(100, (value / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-500">
          {value} ({percent.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={`h-2 ${barClass}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend: "up" | "down" | "stable";
}

const MetricCard = ({ title, value, description, trend }: MetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-600";
      case "down":
        return "text-rose-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="flex flex-col p-3 border border-slate-200 rounded-lg">
      <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className={`text-sm ${getTrendColor()}`}>{getTrendIcon()}</span>
      </div>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
  );
};