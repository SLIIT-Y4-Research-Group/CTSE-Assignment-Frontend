export const THEME_STORAGE_KEY = "eventhub-theme";

export const getStoredTheme = () => {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  return saved === "dark" || saved === "light" ? saved : null;
};

export const getPreferredTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const getInitialTheme = () => getStoredTheme() || getPreferredTheme();

export const applyTheme = (theme) => {
  if (typeof document === "undefined") return;

  const safeTheme = theme === "dark" ? "dark" : "light";
  document.body.classList.toggle("dark-theme", safeTheme === "dark");
  document.documentElement.setAttribute("data-theme", safeTheme);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, safeTheme);
    window.dispatchEvent(
      new CustomEvent("eventhub-theme-change", { detail: safeTheme }),
    );
  }
};
