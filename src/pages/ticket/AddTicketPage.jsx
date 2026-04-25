import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext.jsx";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const initialForm = {
  event_id: "",
  ticket_type: "",
  description: "",
  price: "",
  currency: "LKR",
  quantity: "",
  max_per_user: 10,
  sale_start: "",
  sale_end: "",
};

const requiredFields = ["event_id", "ticket_type", "price", "quantity"];
const TICKET_TYPES = ["Regular", "VIP", "Early Bird", "Student"];
const CURRENCIES = ["LKR", "USD", "EUR", "GBP"];

const fieldLabels = {
  event_id: "Event",
  ticket_type: "Ticket type",
  description: "Description",
  price: "Price",
  currency: "Currency",
  quantity: "Quantity",
  max_per_user: "Max per user",
  sale_start: "Sale start date",
  sale_end: "Sale end date",
};

const AddTicketPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { id: eventIdFromUrl } = useParams();
  const [form, setForm] = useState(initialForm);
  const [events, setEvents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const apiBase = "http://event-system-alb-1954530717.ap-south-1.elb.amazonaws.com/api/tickets/api"; // ticket service

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://event-system-alb-1954530717.ap-south-1.elb.amazonaws.com/api/events/api/events");
        console.log("Events API response:", res.data);
        setEvents(Array.isArray(res.data) ? res.data : res.data.events || []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!eventIdFromUrl) return;

    setForm((prev) => ({
      ...prev,
      event_id: eventIdFromUrl,
    }));
  }, [eventIdFromUrl]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const validateRequired = () => {
    for (const field of requiredFields) {
      const value = form[field];
      if (!value) {
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

    setSubmitting(true);
    try {
      await axios.post(`${apiBase}/tickets`, form);
      setSuccessMessage("Ticket created successfully!");
      setForm(initialForm);

      setTimeout(() => {
        navigate("/dashboard/tickets/manage");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to create ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 card">
        <h1 className="text-2xl font-semibold text-ink-900">Add new ticket</h1>
        <p className="mt-2 text-sm text-ink-500">
          Create a ticket for an event.
        </p>
      </div>

      <div className="p-6 card">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold text-ink-600">
              Event *
            </label>
            <select
              name="event_id"
              value={form.event_id}
              onChange={handleChange}
              className="mt-2 input"
              required
              disabled={!!eventIdFromUrl} // prevent changing if coming from specific event
            >
              <option value="">Select event</option>
              {events.map((evt) => (
                <option key={evt._id} value={evt._id}>
                  {evt.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">
              Ticket type *
            </label>
            <select
              className="mt-2 input"
              name="ticket_type"
              value={form.ticket_type}
              onChange={handleChange}
              required
            >
              <option value="">Select ticket type</option>
              {TICKET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">
              Price *
            </label>
            <input
              className="mt-2 input"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">
              Currency
            </label>
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
            <label className="text-xs font-semibold text-ink-600">
              Quantity *
            </label>
            <input
              className="mt-2 input"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">
              Max per user
            </label>
            <input
              className="mt-2 input"
              name="max_per_user"
              type="number"
              value={form.max_per_user}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">
              Sale start
            </label>
            <input
              className="mt-2 input"
              type="date"
              name="sale_start"
              value={form.sale_start}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">
              Sale end
            </label>
            <input
              className="mt-2 input"
              type="date"
              name="sale_end"
              value={form.sale_end}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-ink-600">
              Description
            </label>
            <textarea
              className="mt-2 input min-h-20"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Creating ticket..." : "Create ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTicketPage;
