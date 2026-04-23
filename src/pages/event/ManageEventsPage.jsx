import React, { useCallback, useEffect, useState } from "react";
import ErrorState from "../../components/ErrorState.jsx";
import EventManagementCard from "../../components/EventManagementCard.jsx";
import Loading from "../../components/Loading.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
  cancelEvent,
  deleteEvent,
  getManageAllEvents,
  publishEvent,
  searchManagedEvents,
} from "../../api/eventService.js";
import { runEventActionToast } from "../../utils/eventActionToast.js";

const EVENT_CATEGORIES = ["Concerts", "Theatre", "Family"];

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
  const [bannerLoadError, setBannerLoadError] = useState({});

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
    setEventActionLoading((prev) => ({ ...prev, [eventId]: actionName }));

    const actionMessages = {
      publish: {
        loading: "Publishing event...",
        success: "Event published successfully.",
        errorFallback: "Failed to publish event.",
      },
      cancel: {
        loading: "Cancelling event...",
        success: "Event cancelled successfully.",
        errorFallback: "Failed to cancel event.",
      },
      delete: {
        loading: "Deleting event...",
        success: "Event deleted successfully.",
        errorFallback: "Failed to delete event.",
      },
    };

    try {
      await runEventActionToast({
        action: actionFn,
        messages: actionMessages[actionName] || {
          loading: "Processing event action...",
          success: "Event action completed successfully.",
          errorFallback: `Failed to ${actionName} event.`,
        },
      });
      await loadEvents();
    } catch {
      // Error toast is handled centrally by runEventActionToast.
    } finally {
      setEventActionLoading((prev) => ({ ...prev, [eventId]: "" }));
    }
  };

  return (
    <div className="flex flex-col w-full gap-8 mx-auto max-w-7xl">
      <section className="manage-events-header card p-7">
        <p className="manage-events-eyebrow">Event operations</p>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-3">
          <div>
            <h1 className="text-3xl font-semibold text-ink-900">
              Manage events
            </h1>
            <p className="mt-2 text-sm leading-6 text-ink-500">
              Keep your catalog organized with publishing controls, quick edits,
              and status visibility.
            </p>
          </div>
          <div className="manage-events-total">
            {events.length} total events
          </div>
        </div>
      </section>

      <section className="card p-7">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-ink-900">Filters</h2>
          <p className="mt-1 text-sm text-ink-500">
            Narrow down by city, category, date, or publishing status.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-500">
              City
            </label>
            <input
              className="input"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Search by city"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-500">
              Category
            </label>
            <select
              className="input"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All categories</option>
              {EVENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-500">
              Date
            </label>
            <input
              className="input"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-500">
              Status
            </label>
            <select
              className="select"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClearFilters}
            disabled={loading}
          >
            Clear filters
          </button>
        </div>
      </section>

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

      {!loading && !error && events.length === 0 ? (
        <div className="px-6 py-8 text-sm card rounded-2xl text-ink-500">
          No events available right now.
        </div>
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const eventId = event._id;
            const status = (event.status || "unknown").toLowerCase();
            const activeAction = eventActionLoading[eventId] || "";
            const isActionRunning = Boolean(activeAction);
            const bannerUrl = resolveBannerUrl(event.banner_image);
            const showBanner = Boolean(bannerUrl) && !bannerLoadError[eventId];

            return (
              <EventManagementCard
                key={event._id || event.title}
                event={event}
                eventId={eventId}
                status={status}
                bannerUrl={bannerUrl}
                showBanner={showBanner}
                onBannerError={() =>
                  setBannerLoadError((prev) => ({
                    ...prev,
                    [eventId]: true,
                  }))
                }
                canManageEvents={canManageEvents}
                activeAction={activeAction}
                isActionRunning={isActionRunning}
                onPublish={() =>
                  handleEventAction(eventId, "publish", () =>
                    publishEvent(eventId, {}),
                  )
                }
                onCancel={() => {
                  if (
                    !window.confirm(
                      "Are you sure you want to cancel this event?",
                    )
                  ) {
                    return;
                  }
                  handleEventAction(eventId, "cancel", () =>
                    cancelEvent(eventId, {}),
                  );
                }}
                onDelete={() => {
                  if (
                    !window.confirm(
                      "Are you sure you want to delete this event?",
                    )
                  ) {
                    return;
                  }
                  handleEventAction(eventId, "delete", () =>
                    deleteEvent(eventId),
                  );
                }}
              />
            );
          })}
        </section>
      ) : null}
    </div>
  );
};

export default ManageEventsPage;
