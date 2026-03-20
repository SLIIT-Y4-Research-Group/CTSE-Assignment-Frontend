import React, { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roleName = user?.role?.name || user?.role || "";
  const isAdmin = useMemo(() => roleName.toLowerCase() === "admin", [roleName]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={`flex min-h-screen ${isAdmin ? "bg-ink-50" : "bg-ink-900"}`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex flex-1 flex-col gap-6 px-6 py-6 lg:px-10 ${isAdmin ? "" : "bg-ink-50"}`}>
        <Topbar user={user} onLogout={handleLogout} onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
