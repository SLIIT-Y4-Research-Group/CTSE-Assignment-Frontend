import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UsersPage from "./pages/users/UsersPage.jsx";
import RolesPage from "./pages/roles/RolesPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import OverviewPage from "./pages/Overview.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { useAuth } from "./auth/AuthContext.jsx";
import PublicLayout from "./pages/PublicLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import TicketsPage from "./pages/TicketsPage.jsx";
import PaymentPage from "./pages/PaymentsPage.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import CancelPage from "./pages/CancelPage.jsx";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const roleName = user?.role?.name || user?.role || "";
  const isAdmin = roleName.toLowerCase() === "admin";

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="tickets" element={<TicketsPage />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/cancel" element={<CancelPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route
          path="users"
          element={
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="roles"
          element={
            <AdminRoute>
              <RolesPage />
            </AdminRoute>
          }
        />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;