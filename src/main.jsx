import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { applyTheme, getInitialTheme } from "./theme/theme.js";

applyTheme(getInitialTheme());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              background: "#0f172a",
              color: "#f8fafc",
              boxShadow: "0 10px 24px rgba(2, 6, 23, 0.35)",
            },
          }}
        />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
