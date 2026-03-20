import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link className="text-lg font-semibold text-ink-900" to="/">
            EventHub
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold text-ink-600">
            <NavLink className={({ isActive }) => (isActive ? "text-ink-900" : "hover:text-ink-900")} to="/events">
              Events
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? "text-ink-900" : "hover:text-ink-900")} to="/tickets">
              Tickets
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? "text-ink-900" : "hover:text-ink-900")} to="/login">
              Login
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-ink-500">
          <span>© 2026 EventHub</span>
          <span>Built for seamless event operations</span>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
