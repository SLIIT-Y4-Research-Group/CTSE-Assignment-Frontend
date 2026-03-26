import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-ink-50 to-ink-50">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            className="text-xl font-semibold tracking-tight text-ink-900"
            to="/"
          >
            EventHub
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold text-ink-600">
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-ink-900" : "transition hover:text-ink-900"
              }
              to="/events"
            >
              Events
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-ink-900" : "transition hover:text-ink-900"
              }
              to="/tickets"
            >
              Tickets
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-ink-900" : "transition hover:text-ink-900"
              }
              to="/dashboard/events/add"
            >
              For organizers
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "btn btn-primary" : "btn btn-primary"
              }
              to="/login"
            >
              Login
            </NavLink>
            <ThemeToggle compact />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm text-ink-500 md:grid-cols-4">
          <div>
            <p className="text-xl font-semibold text-ink-900">EventHub</p>
            <p className="mt-2 text-sm leading-6 text-ink-500">
              A modern platform to discover, book, and manage events with
              confidence.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Quick links
            </p>
            <div className="mt-3 space-y-2">
              <Link
                className="block transition hover:text-ink-800"
                to="/events"
              >
                Events
              </Link>
              <Link
                className="block transition hover:text-ink-800"
                to="/tickets"
              >
                Tickets
              </Link>
              <Link className="block transition hover:text-ink-800" to="/login">
                Login
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Organizers
            </p>
            <div className="mt-3 space-y-2">
              <Link
                className="block transition hover:text-ink-800"
                to="/dashboard/events/add"
              >
                Publish an event
              </Link>
              <Link
                className="block transition hover:text-ink-800"
                to="/dashboard/events"
              >
                Manage events
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Support
            </p>
            <p className="mt-3">support@eventhub.app</p>
            <p className="mt-1">+94 11 000 0000</p>
          </div>
        </div>
        <div className="border-t border-ink-100">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-ink-500">
            <span>© 2026 EventHub. All rights reserved.</span>
            <span>Built for seamless event operations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
