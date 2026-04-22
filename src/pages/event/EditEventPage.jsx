import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorState from "../../components/ErrorState.jsx";
import Loading from "../../components/Loading.jsx";
import { getEventById, updateEvent } from "../../api/eventService.js";
import { EVENT_CATEGORIES } from "../../components/EventCategorySelector.jsx";

const initialForm = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  date: "",
  time: "",
  venue_name: "",
  city: "",
  category: "",
  organizer_contact_email: "",
  is_featured: false,
  organizer_id: "",
  banner_image: "",
};

const requiredFields = [
  "title",
  "slug",
  "description",
  "date",
  "time",
  "venue_name",
  "city",
  "category",
];

const fieldLabels = {
  title: "Title",
  slug: "Slug",
  description: "Description",
  date: "Date",
  time: "Time",
  venue_name: "Venue name",
  city: "City",
  category: "Category",
};

const isValidCategory = (value) => EVENT_CATEGORIES.includes(value);

const EditEventPage = () => {
  const { id } = useParams();
  const todayDate = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadEvent = useCallback(async () => {
    if (!id) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getEventById(id);
      const eventData =
        response?.data?.event || response?.data?.data || response?.data || null;

      if (!eventData) {
        setError("Event not found.");
        setForm(initialForm);
        return;
      }

      setForm({
        title: eventData.title || "",
        slug: eventData.slug || "",
        short_description: eventData.short_description || "",
        description: eventData.description || "",
        date: eventData.date || "",
        time: eventData.time || "",
        venue_name: eventData.venue_name || "",
        city: eventData.city || "",
        category: eventData.category || "",
        organizer_contact_email: eventData.organizer_contact_email || "",
        is_featured: Boolean(eventData.is_featured),
        organizer_id: eventData.organizer_id || "",
        banner_image: eventData.banner_image || "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load event details.");
      setForm(initialForm);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateRequired = () => {
    for (const field of requiredFields) {
      const value = form[field];
      if (typeof value === "string" && !value.trim()) {
        return `${fieldLabels[field]} is required.`;
      }
    }

    if (!isValidCategory(form.category)) {
      return "Category must be one of Concerts, Theatre, or Family.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!id) {
      setError("Event ID is missing.");
      return;
    }

    const validationError = validateRequired();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (form.date && form.date < todayDate) {
      setError("Date cannot be earlier than today.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        short_description: form.short_description.trim(),
        description: form.description.trim(),
        date: form.date,
        time: form.time,
        venue_name: form.venue_name.trim(),
        city: form.city.trim(),
        category: form.category.trim(),
        organizer_contact_email: form.organizer_contact_email.trim(),
        is_featured: form.is_featured,
        organizer_id: form.organizer_id,
        banner_image: form.banner_image,
      };

      await updateEvent(id, payload);
      setSuccessMessage("Event updated successfully");
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || "Failed to update event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Loading event..." />;

  if (error && !form.title) {
    return (
      <ErrorState
        message={error}
        action={
          <button
            type="button"
            className="btn btn-secondary w-fit"
            onClick={loadEvent}
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 card">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
          Events
        </p>
        <h1 className="text-2xl font-semibold text-ink-900">Edit event</h1>
        <p className="mt-2 text-sm text-ink-500">
          Update event information while keeping organizer and banner values
          intact.
        </p>
      </div>

      <div className="p-6 card">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-ink-600">
              Title *
            </label>
            <input
              className="mt-2 input"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Slug *</label>
            <input
              className="mt-2 input"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">
              Category *
            </label>
            <select
              className="mt-2 input"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {EVENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-ink-600">
              Short description
            </label>
            <input
              className="mt-2 input"
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-ink-600">
              Description *
            </label>
            <textarea
              className="mt-2 input min-h-28"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Date *</label>
            <input
              className="mt-2 input"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={todayDate}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Time *</label>
            <input
              className="mt-2 input"
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">
              Venue name *
            </label>
            <input
              className="mt-2 input"
              name="venue_name"
              value={form.venue_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">City *</label>
            <input
              className="mt-2 input"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-ink-600">
              Organizer contact email
            </label>
            <input
              className="mt-2 input"
              type="email"
              name="organizer_contact_email"
              value={form.organizer_contact_email}
              onChange={handleChange}
            />
          </div>

          <input
            type="hidden"
            name="organizer_id"
            value={form.organizer_id}
            readOnly
          />
          <input
            type="hidden"
            name="banner_image"
            value={form.banner_image}
            readOnly
          />

          <div className="sm:col-span-2">
            <label className="inline-flex items-center gap-3 text-sm text-ink-700">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-ink-300"
              />
              Mark as featured event
            </label>
          </div>

          {error ? (
            <div className="px-4 py-3 text-sm border sm:col-span-2 rounded-xl border-gold-200 bg-gold-50 text-gold-700">
              {error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="px-4 py-3 text-sm border sm:col-span-2 rounded-xl border-mint-200 bg-mint-50 text-mint-700">
              {successMessage}
            </div>
          ) : null}

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

export default EditEventPage;
