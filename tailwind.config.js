/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#e7eaef",
          200: "#cfd6e0",
          300: "#a7b3c6",
          400: "#6f809b",
          500: "#4f6080",
          600: "#3e4b66",
          700: "#313b52",
          800: "#242d40",
          900: "#1b2233"
        },
        mint: {
          50: "#eefcf7",
          100: "#d7f6ea",
          200: "#b0ecd3",
          300: "#7dddb7",
          400: "#3fc896",
          500: "#1eab78",
          600: "#168a62",
          700: "#136f50",
          800: "#115940",
          900: "#0f4936"
        },
        gold: {
          50: "#fff8e7",
          100: "#ffefc2",
          200: "#ffdd8a",
          300: "#ffc451",
          400: "#ffab1f",
          500: "#f28a0c",
          600: "#d16607",
          700: "#a54607",
          800: "#7a340a",
          900: "#5a290b"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(28, 34, 51, 0.12)",
        card: "0 12px 40px rgba(20, 27, 43, 0.12)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};
