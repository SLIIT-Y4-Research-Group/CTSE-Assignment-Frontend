import React, { useEffect, useState } from "react";
import { applyTheme, getInitialTheme } from "../theme/theme.js";

const ThemeToggle = ({ compact = false }) => {
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
