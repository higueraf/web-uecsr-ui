import { Outlet } from "react-router-dom";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const PublicLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const currentUserName = user
    ? `${user.nombres} ${user.apellidos}`
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar
        currentUserName={currentUserName}
        isAdmin={user?.rol === "ADMIN"}
        showAdmin={user?.rol === "ADMIN"}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
