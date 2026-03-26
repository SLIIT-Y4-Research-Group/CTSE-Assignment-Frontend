import React, { useEffect, useState, useCallback } from "react";
import Loading from "../../components/Loading.jsx";
import ErrorState from "../../components/ErrorState.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { getUserBookings, cancelBooking, getBookingById } from "../../api/bookingService.js";
import { getEventById } from "../../api/eventService.js";
import { formatEventDate, formatEventTime } from "../../utils/dateTime.js";
import { Link } from "react-router-dom";

const MyBookingPage = () => {
  const { user } = useAuth();
  const currentUser = user || JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);
  const [modalBooking, setModalBooking] = useState(null);
  const [modalEvent, setModalEvent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const loadBookings = useCallback(async () => {
    if (!currentUser?._id) {
      setError("User not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await getUserBookings(currentUser._id);
      setBookings(res?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancel = async (bookingId) => {
    setCancelingId(bookingId);
    try {
      await cancelBooking(bookingId);
      loadBookings();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelingId(null);
    }
  };

  // Open modal: fetch booking by ID and the first ticket's event
  const openModal = async (bookingId) => {
    setModalLoading(true);
    setModalError("");
    try {
      const bookingRes = await getBookingById(bookingId);
      const bookingData = bookingRes.data;
      setModalBooking(bookingData);

      // Fetch event details from first ticket (or multiple if needed)
      if (bookingData.tickets?.length > 0) {
        const eventId = bookingData.tickets[0].ticket_id.event_id;
        const eventRes = await getEventById(eventId);
        const ev = eventRes?.data?.event || eventRes?.data?.data || eventRes?.data;
        setModalEvent(ev);
      } else {
        setModalEvent(null);
      }
    } catch (err) {
      console.error(err);
      setModalError("Failed to load booking details");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalBooking(null);
    setModalEvent(null);
    setModalError("");
  };

  if (loading) return <Loading label="Loading your bookings..." />;
  if (error)
    return (
      <ErrorState
        message={error}
        action={
          <button className="btn btn-secondary" onClick={loadBookings}>
            Retry
          </button>
        }
      />
    );

  if (bookings.length === 0) {
    return (
      <div className="p-6 card text-ink-500 text-sm">
        You have no bookings yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 card">
        <h1 className="text-2xl font-semibold text-ink-900">My Bookings</h1>
        <p className="mt-2 text-sm text-ink-500">
          View and manage your ticket bookings.
        </p>
      </div>
    <Link to="/dashboard/bookingCart" className="btn btn-primary">
        Go to Payments
    </Link>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {bookings.map((booking) => (
          <div key={booking._id} className="p-6 card">
            <h3 className="text-lg font-semibold text-ink-900">
              Booking: {booking.booking_reference}
            </h3>
            <p className="text-sm text-ink-600 mt-1">
              Status:{" "}
              <span
                className={`font-medium ${
                  booking.booking_status === "CONFIRMED"
                    ? "text-green-600"
                    : booking.booking_status === "CANCELLED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {booking.booking_status}
              </span>
            </p>
            <p className="text-sm text-ink-600 mt-1">
              Payment:{" "}
              <span
                className={`font-medium ${
                  booking.payment_status === "PAID"
                    ? "text-green-600"
                    : booking.payment_status === "FAILED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {booking.payment_status}
              </span>
            </p>
            <p className="text-sm text-ink-600 mt-1">
              Total: {booking.total_amount} LKR
            </p>
            <p className="text-sm text-ink-600 mt-1">
              Booked On: {formatEventDate(booking.booking_date)}{" "}
              {formatEventTime(booking.booking_date)}
            </p>

            <div className="flex gap-2 mt-4">
                <button
                className="btn btn-ghost"
                onClick={() => openModal(booking._id)}
              >
                View Details
              </button>
              {booking.booking_status !== "CANCELLED" && (
                <button
                  className="btn btn-secondary"
                  onClick={() => handleCancel(booking._id)}
                  disabled={cancelingId === booking._id}
                >
                  {cancelingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}
              
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-96 space-y-4 max-h-[90vh] overflow-auto">
            {modalLoading ? (
              <Loading label="Loading booking details..." />
            ) : modalError ? (
              <p className="text-red-600">{modalError}</p>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-ink-900">
                  Booking Details
                </h2>
                <p className="text-sm text-ink-600">
                  Booking Reference: {modalBooking.booking_reference}
                </p>
                <p className="text-sm text-ink-600">
                  Status: {modalBooking.booking_status}
                </p>
                <p className="text-sm text-ink-600">
                  Payment: {modalBooking.payment_status}
                </p>
                <p className="text-sm text-ink-600">
                  Total: {modalBooking.total_amount} LKR
                </p>
                <p className="text-sm text-ink-600">
                  Booked On: {formatEventDate(modalBooking.booking_date)}{" "}
                  {formatEventTime(modalBooking.booking_date)}
                </p>

                {modalEvent && (
                  <div className="mt-3 space-y-2 text-sm text-ink-700 border-t pt-2">
                    <p className="font-medium">Event Details:</p>
                    <p>Title: {modalEvent.title}</p>
                    <p>Date: {formatEventDate(modalEvent.date)}</p>
                    <p>Time: {formatEventTime(modalEvent.time)}</p>
                    <p>Venue: {modalEvent.venue_name}</p>
                    <p>City: {modalEvent.city}</p>
                    <p>Category: {modalEvent.category}</p>
                  </div>
                )}

                <div className="mt-3 space-y-1 text-sm text-ink-700 border-t pt-2">
                  <p className="font-medium">Tickets:</p>
                  {modalBooking.tickets.map((t) => (
                    <div key={t.ticket_id._id} className="ml-2">
                      {t.ticket_id.ticket_type} - {t.quantity} x {t.price_at_booking} LKR
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-4">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingPage;