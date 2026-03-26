import React from "react";

const Topbar = ({ onMenu, showHero = true }) => {
  if (!showHero) {
    return (
      <div className="lg:hidden">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 bg-white text-ink-700 shadow-sm"
          onClick={onMenu}
          aria-label="Open sidebar"
        >
          ☰
        </button>
      </div>
    );
  }

  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl bg-white px-6 py-4 shadow-soft">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 text-ink-700"
          onClick={onMenu}
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
            Dashboard
          </p>
          <h2 className="text-lg font-semibold text-ink-800">Welcome back</h2>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
