import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorState from "../../components/ErrorState.jsx";
import Loading from "../../components/Loading.jsx";
import { getTicketById } from "../../api/ticketService.js";
import { getEventById } from "../../api/eventService.js";

const TicketDetailsPage = () => {
  const { id } = useParams();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTicketDetails = useCallback(async () => {
    if (!id) {
      setError("Ticket ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch ticket
      const ticketRes = await getTicketById(id);
      const ticketData = ticketRes?.data?.ticket || ticketRes?.data || null;

      if (!ticketData) {
        setError("Ticket not found.");
        setTicketDetails(null);
        return;
      }

      setTicketDetails(ticketData);

      // Fetch event title
      if (ticketData.event_id) {
        const eventRes = await getEventById(ticketData.event_id);
        const eventData = eventRes?.data?.event || eventRes?.data?.data || eventRes?.data || null;
        setEventTitle(eventData?.title || ticketData.event_id);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load ticket details.");
      setTicketDetails(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTicketDetails();
  }, [loadTicketDetails]);

  if (loading) return <Loading label="Loading ticket details..." />;

  if (error) {
    return (
      <ErrorState
        message={error}
        action={
          <button
            type="button"
            className="btn btn-secondary w-fit"
            onClick={loadTicketDetails}
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!ticketDetails) {
    return (
      <div className="p-6 text-sm card text-ink-500">
        No ticket details available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 card">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Tickets</p>
        <h1 className="text-2xl font-semibold text-ink-900">
          {ticketDetails.ticket_type || "Ticket details"}
        </h1>
        {ticketDetails.description ? (
          <p className="mt-2 text-sm text-ink-500">{ticketDetails.description}</p>
        ) : null}
      </div>

      <div className="p-6 card">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-ink-500">Event</p>
            <p className="text-sm text-ink-800">{eventTitle || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Ticket Type</p>
            <p className="text-sm text-ink-800">{ticketDetails.ticket_type || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Price</p>
            <p className="text-sm text-ink-800">
              {ticketDetails.price} {ticketDetails.currency || "LKR"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Quantity</p>
            <p className="text-sm text-ink-800">{ticketDetails.quantity || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Max per user</p>
            <p className="text-sm text-ink-800">{ticketDetails.max_per_user || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Status</p>
            <p className="text-sm text-ink-800">{ticketDetails.status || "-"}</p>
          </div>
          {ticketDetails.description && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-ink-500">Description</p>
              <p className="text-sm text-ink-800 whitespace-pre-line">{ticketDetails.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;