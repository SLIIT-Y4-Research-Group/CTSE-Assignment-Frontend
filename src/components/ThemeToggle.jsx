import React, { useEffect, useState } from "react";
import { applyTheme, getInitialTheme } from "../theme/theme.js";

const ThemeToggle = ({ compact = false, variant = "default" }) => {
  const [theme, setTheme] = useState(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handleThemeEvent = (event) => {
      const nextTheme = event?.detail === "dark" ? "dark" : "light";
      setTheme(nextTheme);
    };

    window.addEventListener("eventhub-theme-change", handleThemeEvent);
    return () => {
      window.removeEventListener("eventhub-theme-change", handleThemeEvent);
    };
  }, []);

  const isDark = theme === "dark";

  if (variant === "icon-only") {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="theme-toggle-icon"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
      </button>
    );
  }

  if (variant === "mode-buttons") {
    return (
      <div className="theme-mode-switch" role="group" aria-label="Theme mode">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`theme-mode-switch__button ${!isDark ? "is-active" : ""}`}
          aria-pressed={!isDark}
        >
          <span aria-hidden="true">☀️</span>
          <span>Light mode</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`theme-mode-switch__button ${isDark ? "is-active" : ""}`}
          aria-pressed={isDark}
        >
          <span aria-hidden="true">🌙</span>
          <span>Dark mode</span>
        </button>
      </div>
    );
  }

  if (variant === "segmented") {
    return (
      <div className="theme-segmented" role="group" aria-label="Theme mode">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`theme-segmented__button ${!isDark ? "is-active" : ""}`}
          aria-pressed={!isDark}
        >
          Light
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`theme-segmented__button ${isDark ? "is-active" : ""}`}
          aria-pressed={isDark}
        >
          Dark
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={compact ? "theme-toggle theme-toggle-compact" : "theme-toggle"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span aria-hidden="true">{isDark ? "☀" : "☾"}</span>
      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
};

export default ThemeToggle;
