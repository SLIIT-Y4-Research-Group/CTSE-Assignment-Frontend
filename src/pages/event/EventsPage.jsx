import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorState from "../../components/ErrorState.jsx";
import Loading from "../../components/Loading.jsx";
import EventCategorySelector, {
  EVENT_CATEGORIES,
} from "../../components/EventCategorySelector.jsx";
import { formatEventDate, formatEventTime } from "../../utils/dateTime.js";
import { getAllEvents, validateEvent } from "../../api/eventService.js";
import { getAllTickets } from "../../api/ticketService.js";

const getTicketEventId = (ticket) => {
  const eventId = ticket?.event_id;
  if (!eventId) return "";
  if (typeof eventId === "string") return eventId;
  if (typeof eventId === "object") return eventId?._id || eventId?.id || "";
  return "";
};

const formatPrice = (value) => {
  if (!Number.isFinite(value)) return "";
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2);
};

const buildTicketPricingMap = (events, tickets) => {
  const eventIds = new Set(
    (events || []).map((event) => event?._id).filter(Boolean),
  );

  const map = {};

  (tickets || []).forEach((ticket) => {
    const eventId = getTicketEventId(ticket);
    if (!eventIds.has(eventId)) return;

    const price = Number(ticket?.price);
    if (!Number.isFinite(price) || price < 0) return;

    const currency = ticket?.currency || "LKR";
    const typeKey = String(ticket?.ticket_type || "default").toLowerCase();

    if (!map[eventId]) {
      map[eventId] = {
        hasTickets: true,
        lowestPrice: price,
        currency,
        ticketTypes: new Set([typeKey]),
      };
      return;
    }

    map[eventId].ticketTypes.add(typeKey);
    if (price < map[eventId].lowestPrice) {
      map[eventId].lowestPrice = price;
      map[eventId].currency = currency;
    }
  });

  eventIds.forEach((eventId) => {
    if (!map[eventId]) {
      map[eventId] = {
        hasTickets: false,
      };
      return;
    }

    map[eventId].multipleTypes = map[eventId].ticketTypes.size > 1;
    delete map[eventId].ticketTypes;
  });

  return map;
};

const EventsPage = () => {
  const navigate = useNavigate();
  const eventServiceBaseUrl = "http://localhost:3002";
  const [allPublishedEvents, setAllPublishedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    category: EVENT_CATEGORIES[0],
    date: "",
  });
  const [bannerLoadError, setBannerLoadError] = useState({});
  const [bookingLoading, setBookingLoading] = useState({});
  const [bookingFeedback, setBookingFeedback] = useState({});
  const [ticketPricingByEvent, setTicketPricingByEvent] = useState({});

  const resolveBannerUrl = (imagePath) => {
    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;

    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;
    return `${eventServiceBaseUrl}${normalizedPath}`;
  };

  const loadEvents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllEvents();
      const events = response?.data?.events || [];
      const publishedEvents = events.filter(
        (event) => (event?.status || "").toLowerCase() === "published",
      );
      setAllPublishedEvents(publishedEvents);
      setBannerLoadError({});

      try {
        const ticketsResponse = await getAllTickets();
        const tickets =
          ticketsResponse?.data?.tickets || ticketsResponse?.data || [];
        setTicketPricingByEvent(
          buildTicketPricingMap(publishedEvents, tickets),
        );
      } catch (ticketErr) {
        setTicketPricingByEvent(buildTicketPricingMap(publishedEvents, []));
      }
    } catch (err) {
      console.log("Failed to load events:", err);
      setError(err?.response?.data?.message || "Failed to load events.");
      setAllPublishedEvents([]);
      setTicketPricingByEvent({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // Public page uses client-side filtering on already loaded published events.
  };

  const handleClearFilters = () => {
    setFilters({ city: "", category: EVENT_CATEGORIES[0], date: "" });
  };

  const filteredEvents = useMemo(() => {
    const city = filters.city.trim().toLowerCase();
    const category = filters.category.trim().toLowerCase();
    const date = filters.date;

    return allPublishedEvents.filter((event) => {
      const eventCity = (event?.city || "").toLowerCase();
      const eventCategory = (event?.category || "").toLowerCase();
      const eventDate = (event?.date || "").slice(0, 10);

      if (city && !eventCity.includes(city)) return false;
      if (category && eventCategory !== category) return false;
      if (date && eventDate !== date) return false;
      return true;
    });
  }, [allPublishedEvents, filters]);

  const handleBookNow = async (eventId) => {
    if (!eventId) return;

    setBookingFeedback((prev) => ({ ...prev, [eventId]: null }));
    setBookingLoading((prev) => ({ ...prev, [eventId]: true }));

    try {
      const response = await validateEvent(eventId);
      const validation = response?.data || {};
      const isBookable =
        validation?.exists === true &&
        String(validation?.status || "").toLowerCase() === "published" &&
        validation?.bookable === true;

      if (isBookable) {
        setBookingFeedback((prev) => ({
          ...prev,
          [eventId]: {
            type: "success",
            message: "Event is valid for booking",
          },
        }));

        navigate("/tickets", { state: { eventId } });
        return;
      }

      setBookingFeedback((prev) => ({
        ...prev,
        [eventId]: {
          type: "error",
          message: "This event is not available for booking",
        },
      }));
    } catch (err) {
      setBookingFeedback((prev) => ({
        ...prev,
        [eventId]: {
          type: "error",
          message:
            err?.response?.data?.message ||
            "This event is not available for booking",
        },
      }));
    } finally {
      setBookingLoading((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 card">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
          Events
        </p>
        <h1 className="text-2xl font-semibold text-ink-900">Public events</h1>
        <p className="mt-2 text-sm text-ink-500">
          Browse upcoming published events and view event details.
        </p>
      </div>

      <div className="p-6 card">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-3">
            <label className="text-xs font-semibold text-ink-600">
              Category
            </label>
            <div className="mt-2">
              <EventCategorySelector
                value={filters.category}
                onChange={(category) =>
                  setFilters((prev) => ({ ...prev, category }))
                }
              />
            </div>
          </div>
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
            <label className="text-xs font-semibold text-ink-600">Date</label>
            <input
              className="mt-2 input"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
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

      {!loading && !error && filteredEvents.length === 0 ? (
        <div className="p-6 text-sm card text-ink-500">
          No published events found for the selected filters.
        </div>
      ) : null}

      {!loading && !error && filteredEvents.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => {
            const eventId = event._id;
            const bannerUrl = resolveBannerUrl(event.banner_image);
            const showBanner = Boolean(bannerUrl) && !bannerLoadError[eventId];
            const isBooking = Boolean(bookingLoading[eventId]);
            const bookingMessage = bookingFeedback[eventId];
            const pricing = ticketPricingByEvent[eventId];
            const hasTicketPricing = Boolean(pricing?.hasTickets);
            const ticketPriceText = hasTicketPricing
              ? pricing.multipleTypes
                ? `${formatPrice(pricing.lowestPrice)} ${pricing.currency} Upwards`
                : `From ${formatPrice(pricing.lowestPrice)} ${pricing.currency}`
              : "";

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
                  {hasTicketPricing ? (
                    <p>
                      <span className="font-medium text-ink-800">Tickets:</span>{" "}
                      {ticketPriceText}
                    </p>
                  ) : (
                    <p>
                      <span className="font-medium text-ink-800">Tickets:</span>{" "}
                      Tickets not available
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link to={`/events/${eventId}`} className="btn btn-secondary">
                    View Details
                  </Link>
                  {/* <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={isBooking || !eventId}
                    onClick={() => handleBookNow(eventId)}
                  >
                    {isBooking ? "Checking..." : "Book Now"}
                  </button> */}
                  <Link
                    to={`/dashboard/events/${eventId}/tickets`}
                    className="btn btn-secondary"
                  >
                    View Ticket Types
                  </Link>
                </div>

                {bookingMessage ? (
                  <div
                    className={`mt-3 rounded-xl border px-3 py-2 text-xs ${
                      bookingMessage.type === "success"
                        ? "border-mint-200 bg-mint-50 text-mint-700"
                        : "border-gold-200 bg-gold-50 text-gold-700"
                    }`}
                  >
                    {bookingMessage.message}
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

export default EventsPage;
