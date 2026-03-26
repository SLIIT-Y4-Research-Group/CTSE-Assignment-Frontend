import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading.jsx";
import ErrorState from "../../components/ErrorState.jsx";
import { getTicketsByEvent, deleteTicket } from "../../api/ticketService.js";
import { getEventById } from "../../api/eventService.js";
import { formatEventDate, formatEventTime } from "../../utils/dateTime.js";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const eventServiceBaseUrl = "http://localhost:3002";
const apiBase = "http://localhost:3003/api"; 

const ViewTicketByEvent = () => {
const { user } = useAuth(); 
 const currentUser = user || JSON.parse(localStorage.getItem("user"));
  const { eventId } = useParams();
  const [event, setEvent] = useState({});
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bannerLoadError, setBannerLoadError] = useState({});

  const [modalTicket, setModalTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const resolveBannerUrl = (imagePath) => {
    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${eventServiceBaseUrl}${normalizedPath}`;
  };

  const loadData = useCallback(async () => {
    if (!eventId) {
      setError("Event ID missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ticketRes = await getTicketsByEvent(eventId);
      setTickets(ticketRes?.data || []);

      const eventRes = await getEventById(eventId);
      const ev = eventRes?.data?.event || eventRes?.data?.data || eventRes?.data || {};
      setEvent(ev);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load data");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openModal = (ticket) => {
    setModalTicket(ticket);
    setQuantity(1);
    setBookingError("");
    setBookingSuccess("");
  };

  const closeModal = () => setModalTicket(null);

  const handleBooking = async () => {
  if (!modalTicket) return;

  const available = modalTicket.quantity - (modalTicket.sold || 0);
  if (quantity < 1 || quantity > available) {
    setBookingError("Invalid quantity");
    return;
  }

  setSubmitting(true);
  setBookingError("");
  setBookingSuccess("");

  try {
    const payload = {
      user_id: currentUser?._id,
      tickets: [{ ticket_id: modalTicket._id, quantity }],
    };

    await axios.post(`${apiBase}/bookings`, payload);
    setBookingSuccess("Booking created successfully!");
    loadData(); // refresh tickets
    setTimeout(() => closeModal(), 1000);
  } catch (err) {
    console.error(err);
    setBookingError(err?.response?.data?.message || "Failed to create booking");
  } finally {
    setSubmitting(false);
  }
};

  if (loading) return <Loading label="Loading tickets..." />;
  if (error)
    return (
      <ErrorState
        message={error}
        action={
          <button className="btn btn-secondary" onClick={loadData}>
            Retry
          </button>
        }
      />
    );

  const bannerUrl = resolveBannerUrl(event.banner_image);
  const showBanner = Boolean(bannerUrl) && !bannerLoadError[eventId];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="p-6 card">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Tickets</p>
        <h1 className="text-2xl font-semibold text-ink-900">
          {event.title || "Event"} - Tickets
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Browse all tickets created for this event.
        </p>
      </div>

      {/* EVENT BANNER */}
      {/* {showBanner ? (
        <img
          src={bannerUrl}
          alt={event.title || "Event banner"}
          className="object-cover w-full h-40 mb-4 rounded-xl"
          onError={() =>
            setBannerLoadError((prev) => ({ ...prev, [eventId]: true }))
          }
        />
      ) : (
        <div className="flex items-center justify-center w-full h-40 mb-4 text-sm border rounded-xl border-ink-200 bg-ink-50 text-ink-500">
          No banner image
        </div>
      )} */}

      {/* EVENT INFO */}
      <div className="p-6 card space-y-2 text-sm text-ink-600">
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
          <span className="font-medium text-ink-800">City:</span> {event.city || "-"}
        </p>
        <p>
          <span className="font-medium text-ink-800">Category:</span>{" "}
          {event.category || "-"}
        </p>
      </div>

      {/* TICKETS */}
      {tickets.length === 0 && (
        <div className="p-6 text-sm card text-ink-500">
          No tickets found for this event.
        </div>
      )}

      {tickets.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket) => {
            const available = ticket.quantity - (ticket.sold || 0);
            return (
              <div key={ticket._id} className="p-6 card">
                <h3 className="text-lg font-semibold text-ink-900">{ticket.ticket_type}</h3>

                <div className="mt-2 space-y-1 text-sm text-ink-600">
                  <p>
                    <span className="font-medium text-ink-800">Price:</span>{" "}
                    {ticket.price} {ticket.currency || "LKR"}
                  </p>
                  <p>
                    <span className="font-medium text-ink-800">Quantity:</span>{" "}
                    {ticket.quantity}
                  </p>
                  <p>
                    <span className="font-medium text-ink-800">Sold:</span> {ticket.sold || 0}
                  </p>
                  <p>
                    <span className="font-medium text-ink-800">Available:</span> {available}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    className="btn btn-ghost"
                    onClick={() => openModal(ticket)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {modalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-96 space-y-4">
            <h2 className="text-xl font-semibold text-ink-900">
              Book: {modalTicket.ticket_type}
            </h2>
            <p>
              Available: {modalTicket.quantity - (modalTicket.sold || 0)}
            </p>

            <div>
              <label className="text-sm font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                max={modalTicket.quantity - (modalTicket.sold || 0)}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="input mt-2 w-full"
              />
            </div>

            {bookingError && (
              <p className="text-sm text-red-600">{bookingError}</p>
            )}
            {bookingSuccess && (
              <p className="text-sm text-green-600">{bookingSuccess}</p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleBooking}
                disabled={submitting}
              >
                {submitting ? "Booking..." : "Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTicketByEvent;