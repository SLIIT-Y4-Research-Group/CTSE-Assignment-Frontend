import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const roleName = user?.role?.name || user?.role || "";
  const isAdmin = useMemo(() => roleName.toLowerCase() === "admin", [roleName]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const payment = query.get("payment");

    if (payment === "success") {
      setPaymentMessage("Payment completed successfully.");

      const timer = setTimeout(() => {
        setPaymentMessage("");
        navigate("/dashboard", { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.search, navigate]);

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
          {paymentMessage && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800 shadow-sm">
              {paymentMessage}
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;