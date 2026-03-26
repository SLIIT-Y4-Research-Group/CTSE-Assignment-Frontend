import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const showWelcomeHero =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";

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

  return (
    <div
      className={`flex min-h-screen ${isAdmin ? "bg-ink-50" : "bg-ink-900"}`}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={`flex flex-1 flex-col gap-6 px-6 py-6 lg:px-10 ${isAdmin ? "" : "bg-ink-50"}`}
      >
        <Topbar
          onMenu={() => setSidebarOpen(true)}
          showHero={showWelcomeHero}
        />

        <main className="flex-1">
          {paymentMessage && (
            <div className="px-4 py-3 mb-4 text-green-800 border border-green-200 shadow-sm rounded-xl bg-green-50">
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
