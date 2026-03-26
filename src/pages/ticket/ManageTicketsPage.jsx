import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading.jsx";
import ErrorState from "../../components/ErrorState.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { getAllTickets, deleteTicket, searchTickets } from "../../api/ticketService.js";
import { getAllEvents } from "../../api/eventService.js"; // <-- import

const MANAGEMENT_ROLES = new Set(["event_manager", "admin"]);
const TICKET_TYPES = ["Regular", "VIP", "Early Bird", "Student"];

const normalizeRole = (role) => (typeof role === "string" ? role.trim().toLowerCase() : "");

const getUserRole = (authUser) => {
  if (!authUser || typeof authUser !== "object") return "";
  const directRole =
    normalizeRole(authUser.role) ||
    normalizeRole(authUser.userRole) ||
    normalizeRole(authUser.role_name) ||
    normalizeRole(authUser.user_type) ||
    normalizeRole(authUser.type);
  if (directRole) return directRole;

  const nestedRole =
    normalizeRole(authUser.role?.name) || normalizeRole(authUser.role?.role);
  if (nestedRole) return nestedRole;

  if (Array.isArray(authUser.roles)) {
    return authUser.roles
      .map((item) => normalizeRole(item) || normalizeRole(item?.name) || normalizeRole(item?.role))
      .find(Boolean);
  }

  return "";
};

const ManageTicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [eventsMap, setEventsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ event: "", type: "" });
  const [ticketActionLoading, setTicketActionLoading] = useState({});
  const [ticketActionError, setTicketActionError] = useState({});
  const [pageSuccessMessage, setPageSuccessMessage] = useState("");

  const userRole = getUserRole(user);
  const canManageTickets = MANAGEMENT_ROLES.has(userRole);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllTickets();
      setTickets(response?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load tickets.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEventsMap = useCallback(async () => {
  try {
    const response = await getAllEvents();

    const events =
      response?.data?.events ||
      response?.data?.data ||
      response?.data ||
      [];

    const map = {};
    events.forEach((event) => {
      map[event._id] = event.title || "Untitled Event";
    });

    setEventsMap(map);
  } catch (err) {
    console.error("Failed to load events:", err);
  }
}, []);

  useEffect(() => {
    loadTickets();
    loadEventsMap();
  }, [loadTickets, loadEventsMap]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    const hasFilters = filters.event || filters.type;
    if (!hasFilters) {
      await loadTickets();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.event) params.event = filters.event;
      if (filters.type) params.type = filters.type;

      const response = await searchTickets(params);
      setTickets(response?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to search tickets.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilters({ event: "", type: "" });
    await loadTickets();
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    setPageSuccessMessage("");
    setTicketActionError((prev) => ({ ...prev, [ticketId]: "" }));
    setTicketActionLoading((prev) => ({ ...prev, [ticketId]: true }));

    try {
      await deleteTicket(ticketId);
      await loadTickets();
      setPageSuccessMessage("Ticket deleted successfully!");
    } catch (err) {
      setTicketActionError((prev) => ({
        ...prev,
        [ticketId]: err?.response?.data?.message || "Failed to delete ticket.",
      }));
      setPageSuccessMessage("");
    } finally {
      setTicketActionLoading((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 card">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Tickets</p>
        <h1 className="text-2xl font-semibold text-ink-900">Manage Tickets</h1>
        <p className="mt-2 text-sm text-ink-500">
          View, edit, and delete tickets. Event titles are loaded from events.
        </p>
      </div>

      {/* <div className="p-6 card">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-ink-600">Event</label>
            <input
              className="mt-2 input"
              name="event"
              value={filters.event}
              onChange={handleFilterChange}
              placeholder="Filter by event"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-600">Ticket Type</label>
            <select
              className="mt-2 input"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All types</option>
              {TICKET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button type="button" className="btn btn-secondary" onClick={handleSearch} disabled={loading}>
            Search
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleClearFilters} disabled={loading}>
            Clear filters
          </button>
        </div>
      </div> */}

      {loading && <Loading label="Loading tickets..." />}

      {!loading && error && (
        <ErrorState
          message={error}
          action={
            <button type="button" className="btn btn-secondary w-fit" onClick={loadTickets}>
              Retry
            </button>
          }
        />
      )}

      {!loading && !error && pageSuccessMessage && (
        <div className="p-4 text-sm border rounded-xl border-mint-200 bg-mint-50 text-mint-700">
          {pageSuccessMessage}
        </div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <div className="p-6 text-sm card text-ink-500">No tickets available right now.</div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket) => {
            const ticketId = ticket._id;
            const isDeleting = ticketActionLoading[ticketId];
            const eventTitle = eventsMap[ticket.event_id] || ticket.event_id;

            return (
              <div key={ticketId} className="p-6 card">
                <h3 className="text-lg font-semibold text-ink-900">{ticket.ticket_type}</h3>
                <div className="mt-2 space-y-1 text-sm text-ink-600">
                  <p>
                    <span className="font-medium text-ink-800">Event:</span> {eventTitle}
                  </p>
                  <p>
                    <span className="font-medium text-ink-800">Price:</span> {ticket.price || "-"} {ticket.currency || "LKR"}
                  </p>
                  <p>
                    <span className="font-medium text-ink-800">Quantity:</span> {ticket.quantity || "-"}
                  </p>
                  <p>
                    <span className="font-medium text-ink-800">Max per user:</span> {ticket.max_per_user || "-"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {canManageTickets && (
                    <>
                    <Link to={`/dashboard/tickets/${ticketId}`} className="btn btn-ghost">
                                        View Details
                                      </Link>
                      <Link
                        to={`/dashboard/tickets/${ticketId}/edit`}
                        className="btn btn-ghost"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        disabled={isDeleting}
                        onClick={() => handleDelete(ticketId)}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  )}
                </div>

                {ticketActionError[ticketId] && (
                  <div className="px-3 py-2 mt-3 text-xs border rounded-xl border-gold-200 bg-gold-50 text-gold-700">
                    {ticketActionError[ticketId]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageTicketsPage;