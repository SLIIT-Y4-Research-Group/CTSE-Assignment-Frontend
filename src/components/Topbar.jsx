import React from "react";

const Topbar = ({ user, onLogout, onMenu }) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-6 py-4 shadow-soft">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 text-ink-700"
          onClick={onMenu}
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Dashboard</p>
          <h2 className="text-lg font-semibold text-ink-800">Welcome back</h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-ink-800">{user?.name || user?.fullName || "User"}</p>
          <p className="text-xs text-ink-500">{user?.email || ""}</p>
        </div>
        <button className="btn btn-ghost" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
