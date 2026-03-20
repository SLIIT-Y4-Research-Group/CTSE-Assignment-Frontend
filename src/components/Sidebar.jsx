import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const roleName = user?.role?.name || user?.role || "";
  const isAdmin = roleName.toLowerCase() === "admin";

  const links = [
    { label: "Dashboard", to: "/dashboard" },
    ...(isAdmin
      ? [
          { label: "Users", to: "/dashboard/users" },
          { label: "Roles", to: "/dashboard/roles" }
        ]
      : []),
    { label: "Profile", to: "/dashboard/profile" }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-ink-900 text-white shadow-2xl transition lg:static lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-300">EventHub</p>
            <h1 className="text-lg font-semibold">User Management</h1>
          </div>
          <button
            className="lg:hidden text-ink-200 hover:text-white"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? "bg-ink-700 text-white" : "text-ink-200 hover:bg-ink-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 pb-6 text-xs text-ink-400">© 2026 EventHub</div>
      </div>
    </aside>
  );
};

export default Sidebar;
