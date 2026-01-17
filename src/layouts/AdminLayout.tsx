import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, initializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initializing) return;
    if (!user) {
      navigate("/admin/login", { replace: true });
    } else if (user.rol !== "ADMIN") {
      navigate("/", { replace: true });
    }
  }, [user, initializing, navigate]);

  const userName = user ? `${user.nombres} ${user.apellidos}` : undefined;

  return (
    <div className="h-screen flex bg-slate-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          onToggleMenu={() => setSidebarOpen((v) => !v)}
          isAuthenticated={!!user}
          userName={userName}
          onLogout={logout}
        />
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
