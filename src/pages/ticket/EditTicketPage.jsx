import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorState from "../../components/ErrorState.jsx";
import Loading from "../../components/Loading.jsx";
import { getAllEvents, getEventById } from "../../api/eventService.js";
import { getTicketById, updateTicket } from "../../api/ticketService.js";
import { useNavigate } from "react-router-dom";

const initialForm = {
  event_id: "",
  ticket_type: "",
  description: "",
  price: "",
  currency: "LKR",
  quantity: "",
  max_per_user: "",
  status: "ACTIVE",
};

const requiredFields = ["event_id", "ticket_type", "price", "quantity"];
const CURRENCIES = ["LKR", "USD", "EUR", "GBP"];

const fieldLabels = {
  event_id: "Event",
  ticket_type: "Ticket Type",
  description: "Description",
  price: "Price",
  currency: "Currency",
  quantity: "Quantity",
  max_per_user: "Max per user",
  status: "Status",
};

const EditTicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [events, setEvents] = useState([]); // for event dropdown

  const loadTicket = useCallback(async () => {
    if (!id) {
      setError("Ticket ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await getTicketById(id);
      const ticketData = res?.data?.ticket || res?.data || null;

      if (!ticketData) {
        setError("Ticket not found.");
        setForm(initialForm);
        return;
      }

      setForm({
        event_id: ticketData.event_id || "",
        ticket_type: ticketData.ticket_type || "",
        description: ticketData.description || "",
        price: ticketData.price || "",
        currency: ticketData.currency || "LKR",
        quantity: ticketData.quantity || "",
        max_per_user: ticketData.max_per_user || "",
        status: ticketData.status || "ACTIVE",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load ticket details.");
      setForm(initialForm);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadEvents = useCallback(async () => {
    try {
      const res = await getAllEvents();
      const eventsData = res?.data?.events || [];
      setEvents(eventsData);
    } catch {
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    loadTicket();
  }, [loadTicket, loadEvents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateRequired = () => {
    for (const field of requiredFields) {
      if (!form[field] || (typeof form[field] === "string" && !form[field].trim())) {
        return `${fieldLabels[field]} is required.`;
      }
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const validationError = validateRequired();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        event_id: form.event_id,
        ticket_type: form.ticket_type.trim(),
        description: form.description?.trim() || "",
        price: Number(form.price),
        currency: form.currency,
        quantity: Number(form.quantity),
        max_per_user: Number(form.max_per_user) || 1,
        status: form.status,
      };

      await updateTicket(id, payload);
      setSuccessMessage("Ticket updated successfully!");
      setTimeout(() => {
      navigate("/dashboard/tickets/manage");
    }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update ticket.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Loading ticket..." />;

  if (error && !form.ticket_type) {
    return (
      <ErrorState
        message={error}
        action={
          <button type="button" className="btn btn-secondary w-fit" onClick={loadTicket}>
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 card">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Tickets</p>
        <h1 className="text-2xl font-semibold text-ink-900">Edit Ticket</h1>
        <p className="mt-2 text-sm text-ink-500">
          Update ticket information.
        </p>
      </div>

      <div className="p-6 card">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-ink-600">Event *</label>
            <select
              className="mt-2 input"
              name="event_id"
              value={form.event_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Event</option>
              {events.map(event => (
                <option key={event._id} value={event._id}>{event.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Ticket Type *</label>
            <input
              className="mt-2 input"
              name="ticket_type"
              value={form.ticket_type}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Price *</label>
            <input
              className="mt-2 input"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Currency</label>
            <select
                className="mt-2 input"
                name="currency"
                value={form.currency}
                onChange={handleChange}
            >
                {CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                    {cur}
                </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Quantity *</label>
            <input
              className="mt-2 input"
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Max per user</label>
            <input
              className="mt-2 input"
              type="number"
              name="max_per_user"
              value={form.max_per_user}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-ink-600">Description</label>
            <textarea
              className="mt-2 input min-h-28"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Status</label>
            <select
              className="mt-2 input"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {error && (
            <div className="px-4 py-3 text-sm border sm:col-span-2 rounded-xl border-gold-200 bg-gold-50 text-gold-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="px-4 py-3 text-sm border sm:col-span-2 rounded-xl border-mint-200 bg-mint-50 text-mint-700">
              {successMessage}
            </div>
          )}

          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTicketPage;