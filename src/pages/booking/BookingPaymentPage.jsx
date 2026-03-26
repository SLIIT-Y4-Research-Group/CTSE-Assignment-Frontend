import React, { useEffect, useState, useCallback } from "react";
import Loading from "../../components/Loading.jsx";
import ErrorState from "../../components/ErrorState.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { getUserBookings } from "../../api/bookingService.js";

const BookingPaymentPage = () => {
  const { user } = useAuth();
  const currentUser = user || JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      const filtered =
        res?.data?.filter(
          (b) =>
            b.payment_status === "PENDING" &&
            b.booking_status !== "CANCELLED"
        ) || [];

      setBookings(filtered);
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

  const toggleBooking = (bookingId) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const totalAmount = bookings
    .filter((b) => selectedBookings.includes(b._id))
    .reduce((sum, b) => sum + b.total_amount, 0);

  const handlePayment = () => {
    if (!selectedBookings.length) {
      alert("Please select at least one booking");
      return;
    }

    console.log("Selected bookings:", selectedBookings);
    console.log("Total:", totalAmount);

    //("Proceeding to payment");
  };

  if (loading) return <Loading label="Loading bookings..." />;
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
      <div className="p-6 card text-sm text-ink-500">
        No pending bookings available for payment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="p-6 card flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">
            Select Bookings for Payment
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Choose one or more bookings to proceed.
          </p>
        </div>

        {/* TOTAL + BUTTON */}
        <div className="text-right">
          <p className="text-sm text-ink-500">Total</p>
          <p className="text-xl font-semibold text-ink-900">
            {totalAmount} LKR
          </p>
          <button
            className="btn btn-primary mt-2"
            onClick={handlePayment}
            disabled={!selectedBookings.length}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* BOOKINGS LIST */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className={`p-6 card cursor-pointer border-2 ${
              selectedBookings.includes(booking._id)
                ? "border-blue-500"
                : "border-transparent"
            }`}
            onClick={() => toggleBooking(booking._id)}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-ink-900">
                {booking.booking_reference}
              </h3>

              <input
                type="checkbox"
                checked={selectedBookings.includes(booking._id)}
                onChange={() => toggleBooking(booking._id)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <p className="text-sm text-ink-600 mt-2">
              Amount: {booking.total_amount} LKR
            </p>

            <p className="text-sm text-ink-600">
              Status: {booking.booking_status}
            </p>

            <div className="mt-3 text-sm text-ink-700">
              <p className="font-medium">Tickets:</p>
              {booking.tickets.map((t) => (
                <div key={t._id} className="ml-2">
                  {t.quantity} x {t.price_at_booking}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPaymentPage;