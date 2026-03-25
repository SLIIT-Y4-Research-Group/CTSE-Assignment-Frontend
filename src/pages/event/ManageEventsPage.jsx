import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/ErrorState.jsx";
import Loading from "../../components/Loading.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { formatEventDate, formatEventTime } from "../../utils/dateTime.js";
import {
  cancelEvent,
  deleteEvent,
  getManageAllEvents,
  publishEvent,
  searchManagedEvents,
} from "../../api/eventService.js";

const MANAGEMENT_ROLES = new Set(["event_manager", "admin"]);

const normalizeRole = (role) => {
  if (typeof role !== "string") return "";
  return role.trim().toLowerCase();
};

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
    const listRole = authUser.roles
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

const ManageEventsPage = () => {
  const eventServiceBaseUrl = "http://localhost:3002";
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    date: "",
    status: "",
  });
  const [eventActionLoading, setEventActionLoading] = useState({});
  const [eventActionError, setEventActionError] = useState({});
  const [bannerLoadError, setBannerLoadError] = useState({});
  const [pageSuccessMessage, setPageSuccessMessage] = useState("");

  const userRole = getUserRole(user);
  const canManageEvents = MANAGEMENT_ROLES.has(userRole);

  const resolveBannerUrl = (imagePath) => {
    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;

    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;
    return `${eventServiceBaseUrl}${normalizedPath}`;
  };

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getManageAllEvents();
      setEvents(response?.data?.events || []);
      setBannerLoadError({});
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    const city = filters.city.trim();
    const category = filters.category.trim();
    const date = filters.date;
    const status = filters.status;
    const hasFilters = Boolean(city || category || date || status);

    if (!hasFilters) {
      await loadEvents();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = {};
      if (city) params.city = city;
      if (category) params.category = category;
      if (date) params.date = date;
      if (status) params.status = status;

      const response = await searchManagedEvents(params);
      setEvents(response?.data?.events || []);
      setBannerLoadError({});
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to search events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilters({ city: "", category: "", date: "", status: "" });
    await loadEvents();
  };

  const handleEventAction = async (eventId, actionName, actionFn) => {
    setPageSuccessMessage("");
    setEventActionError((prev) => ({ ...prev, [eventId]: "" }));
    setEventActionLoading((prev) => ({ ...prev, [eventId]: actionName }));

    try {
      await actionFn();
      await loadEvents();

      const successMessages = {
        publish: "Event published successfully",
        cancel: "Event cancelled successfully",
        delete: "Event deleted successfully",
      };
      setPageSuccessMessage(
        successMessages[actionName] || "Event action completed successfully",
      );
    } catch (err) {
      setEventActionError((prev) => ({
        ...prev,
        [eventId]:
          err?.response?.data?.message || `Failed to ${actionName} event.`,
      }));
      setPageSuccessMessage("");
    } finally {
      setEventActionLoading((prev) => ({ ...prev, [eventId]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 card">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
          Events
        </p>
        <h1 className="text-2xl font-semibold text-ink-900">Manage events</h1>
        <p className="mt-2 text-sm text-ink-500">
          View, edit, publish, cancel, and delete events from the system.
        </p>
      </div>

      <div className="p-6 card">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-xs font-semibold text-ink-600">City</label>
            <input
              className="mt-2 input"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Search by city"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-600">
              Category
            </label>
            <input
              className="mt-2 input"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              placeholder="Search by category"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-600">Date</label>
            <input
              className="mt-2 input"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-600">Status</label>
            <select
              className="mt-2 input"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All statuses</option>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleClearFilters}
            disabled={loading}
          >
            Clear filters
          </button>
        </div>
      </div>

      {loading ? <Loading label="Loading events..." /> : null}

      {!loading && error ? (
        <ErrorState
          message={error}
          action={
            <button
              type="button"
              className="btn btn-secondary w-fit"
              onClick={loadEvents}
            >
              Retry
            </button>
          }
        />
      ) : null}

      {!loading && !error && pageSuccessMessage ? (
        <div className="p-4 text-sm border rounded-xl border-mint-200 bg-mint-50 text-mint-700">
          {pageSuccessMessage}
        </div>
      ) : null}

      {!loading && !error && events.length === 0 ? (
        <div className="p-6 text-sm card text-ink-500">
          No events available right now.
        </div>
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const eventId = event._id;
            const status = (event.status || "unknown").toLowerCase();
            const activeAction = eventActionLoading[eventId] || "";
            const isActionRunning = Boolean(activeAction);
            const bannerUrl = resolveBannerUrl(event.banner_image);
            const showBanner = Boolean(bannerUrl) && !bannerLoadError[eventId];

            return (
              <div key={event._id || event.title} className="p-6 card">
                {showBanner ? (
                  <img
                    src={bannerUrl}
                    alt={event.title || "Event banner"}
                    className="object-cover w-full h-40 mb-4 rounded-xl"
                    onError={() =>
                      setBannerLoadError((prev) => ({
                        ...prev,
                        [eventId]: true,
                      }))
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-40 mb-4 text-sm border rounded-xl border-ink-200 bg-ink-50 text-ink-500">
                    No banner image
                  </div>
                )}

                <h3 className="text-lg font-semibold text-ink-900">
                  {event.title || "Untitled event"}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-ink-600">
                  <p>
                    <span className="font-medium text-ink-800">Date:</span>{" "}
                    {formatEventDate(event.date)}
                  </p>
                  <p>
                    <span className="font-medium text-ink-800">Time:</span>{" "}
                    {formatEventTime(event.time)}
                  </p>
                  <p>
                    <span className="font-medium text-ink-800">Venue:</span>{" "}
                    {event.venue_name || "-"}
                  </p>
                  <p>
                    <span className="font-medium text-ink-800">City:</span>{" "}
                    {event.city || "-"}
                  </p>
                  <p>
                    <span className="font-medium text-ink-800">Category:</span>{" "}
                    {event.category || "-"}
                  </p>
                </div>
                <span className="inline-flex px-3 py-1 mt-4 text-xs font-semibold uppercase rounded-full w-fit bg-mint-50 text-mint-700">
                  {event.status || "unknown"}
                </span>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Link to={`/events/${eventId}`} className="btn btn-ghost">
                    View Details
                  </Link>

                  {canManageEvents ? (
                    <>
                      <Link
                        to={`/events/${eventId}/edit`}
                        className="btn btn-ghost"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/dashboard/events/${eventId}/tickets/new`}
                        className="btn btn-primary"
                      >
                        Add Ticket
                      </Link>

                      {status === "draft" ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled={isActionRunning || !eventId}
                          onClick={() =>
                            handleEventAction(eventId, "publish", () =>
                              publishEvent(eventId, {}),
                            )
                          }
                        >
                          {activeAction === "publish"
                            ? "Publishing..."
                            : "Publish"}
                        </button>
                      ) : null}

                      {status !== "cancelled" ? (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          disabled={isActionRunning || !eventId}
                          onClick={() => {
                            if (
                              !window.confirm(
                                "Are you sure you want to cancel this event?",
                              )
                            )
                              return;
                            handleEventAction(eventId, "cancel", () =>
                              cancelEvent(eventId, {}),
                            );
                          }}
                        >
                          {activeAction === "cancel"
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      ) : null}

                      <button
                        type="button"
                        className="btn btn-ghost"
                        disabled={isActionRunning || !eventId}
                        onClick={() => {
                          if (
                            !window.confirm(
                              "Are you sure you want to delete this event?",
                            )
                          )
                            return;
                          handleEventAction(eventId, "delete", () =>
                            deleteEvent(eventId),
                          );
                        }}
                      >
                        {activeAction === "delete" ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  ) : null}
                </div>

                {eventActionError[eventId] ? (
                  <div className="px-3 py-2 mt-3 text-xs border rounded-xl border-gold-200 bg-gold-50 text-gold-700">
                    {eventActionError[eventId]}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ManageEventsPage;
