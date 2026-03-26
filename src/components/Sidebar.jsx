import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const MANAGEMENT_ROLES = new Set(["admin", "event_manager"]);

const normalizeRole = (role) => {
  if (typeof role !== "string") return "";
  return role.trim().toLowerCase();
};

const getUserRole = (user) => {
  if (!user || typeof user !== "object") return "";

  const directRole =
    normalizeRole(user.role) ||
    normalizeRole(user.userRole) ||
    normalizeRole(user.role_name) ||
    normalizeRole(user.user_type) ||
    normalizeRole(user.type);

  if (directRole) return directRole;

  const nestedRole =
    normalizeRole(user.role?.name) || normalizeRole(user.role?.role);
  if (nestedRole) return nestedRole;

  if (Array.isArray(user.roles)) {
    const listRole = user.roles
      .map(
        (item) =>
          normalizeRole(item) ||
          normalizeRole(item?.name) ||
          normalizeRole(item?.role),
      )
      .find(Boolean);
    if (listRole) return listRole;
  }

  return "";
};

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userRole = getUserRole(user);
  const isManagementRole = MANAGEMENT_ROLES.has(userRole);
  const isAdmin = userRole === "admin";

  const links = isManagementRole
    ? [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Manage Events", to: "/dashboard/events" },
        { label: "Add Event", to: "/dashboard/events/add" },
        ...(isAdmin
          ? [
              { label: "Users", to: "/dashboard/users" },
              { label: "Roles", to: "/dashboard/roles" },
            ]
          : []),
        { label: "Manage Tickets", to: "/dashboard/tickets/manage" },
        { label: "Profile", to: "/dashboard/profile" },
      ]
    : [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Events", to: "/dashboard/events" },
        { label: "My Bookings", to: "/dashboard/mybookings" },
        { label: "Profile", to: "/dashboard/profile" },
      ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`app-sidebar fixed inset-y-0 left-0 z-40 w-64 transform bg-ink-900 text-white shadow-2xl transition lg:static lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-300">
              EventHub
            </p>
            {/* <h1 className="text-lg font-semibold">User Management</h1> */}
          </div>
          <button
            className="lg:hidden text-ink-200 hover:text-white"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-ink-700 text-white"
                    : "text-ink-200 hover:bg-ink-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 pb-6 space-y-3">
          <ThemeToggle compact />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white transition bg-red-600 rounded-xl hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
