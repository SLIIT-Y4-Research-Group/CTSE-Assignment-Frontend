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
import EventsPage from "./pages/event/EventsPage.jsx";
import ManageEventsPage from "./pages/event/ManageEventsPage.jsx";
import AddEventPage from "./pages/event/AddEventPage.jsx";
import EditEventPage from "./pages/event/EditEventPage.jsx";
import EventDetailsPage from "./pages/event/EventDetailsPage.jsx";
import TicketsPage from "./pages/TicketsPage.jsx";
import PaymentPage from "./pages/PaymentsPage.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import CancelPage from "./pages/CancelPage.jsx";

const MANAGEMENT_ROLES = new Set(["admin", "event_manager"]);

const normalizeRole = (role) => {
  if (typeof role !== "string") return "";
  return role.trim().toLowerCase();
};

const getUserRole = (user) => {
  if (!user || typeof user !== "object") return "";

  const directRole =
    normalizeRole(user.role) ||
    normalizeRole(user.userRole) ||
    normalizeRole(user.role_name) ||
    normalizeRole(user.user_type) ||
    normalizeRole(user.type);

  if (directRole) return directRole;

  const nestedRole =
    normalizeRole(user.role?.name) || normalizeRole(user.role?.role);
  if (nestedRole) return nestedRole;

  if (Array.isArray(user.roles)) {
    const listRole = user.roles
      .map(
        (item) =>
          normalizeRole(item) ||
          normalizeRole(item?.name) ||
          normalizeRole(item?.role),
      )
      .find(Boolean);
    if (listRole) return listRole;
  }

  return "";
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = getUserRole(user) === "admin";

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const ManagementRoute = ({ children }) => {
  const { user } = useAuth();
  const role = getUserRole(user);
  const canManage = MANAGEMENT_ROLES.has(role);

  if (!canManage) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const DashboardEventsRoute = () => {
  const { user } = useAuth();
  const role = getUserRole(user);
  const canManage = MANAGEMENT_ROLES.has(role);

  return canManage ? <ManageEventsPage /> : <EventsPage />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="events/add" element={<AddEventPage />} />
        <Route path="events/:id/edit" element={<EditEventPage />} />
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
        <Route path="events" element={<DashboardEventsRoute />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route
          path="events/add"
          element={
            <ManagementRoute>
              <AddEventPage />
            </ManagementRoute>
          }
        />
        <Route
          path="events/:id/edit"
          element={
            <ManagementRoute>
              <EditEventPage />
            </ManagementRoute>
          }
        />
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
