import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { Spinner } from "../../components/ui/Spinner";

export function DashboardLayout() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-force-light flex min-h-screen bg-white text-gray-900">
      <AdminSidebar onSignOut={signOut} />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
