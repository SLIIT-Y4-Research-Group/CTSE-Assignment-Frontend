import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, uploadEventBanner } from "../../api/eventService.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import { EVENT_CATEGORIES } from "../../components/EventCategorySelector.jsx";
import {
  getApiErrorMessage,
  runEventActionToast,
} from "../../utils/eventActionToast.js";

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
  banner_image: "",
  is_featured: false,
  organizer_id: "",
  organizer_contact_email: "",
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
  short_description: "Short description",
  description: "Description",
  date: "Date",
  time: "Time",
  venue_name: "Venue name",
  city: "City",
  category: "Category",
  banner_image: "Banner image URL",
  is_featured: "Featured event",
  organizer_id: "Organizer",
  organizer_contact_email: "Organizer contact email",
};

const isValidCategory = (value) => EVENT_CATEGORIES.includes(value);

const createSlugFromTitle = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const AddEventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const eventServiceBaseUrl = "http://localhost:3002";
  const todayDate = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUploadError, setBannerUploadError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const organizerId = user?._id || "";
    setForm((prev) => ({
      ...prev,
      organizer_id: organizerId,
    }));
  }, [user?._id]);

  const resolveBannerUrl = (imagePath) => {
    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;

    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;
    return `${eventServiceBaseUrl}${normalizedPath}`;
  };

  const bannerPreviewSrc = resolveBannerUrl(form.banner_image);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" ? { slug: createSlugFromTitle(value) } : {}),
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

  const handleBannerFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBannerUploadError("");
    setError("");
    setBannerUploading(true);

    try {
      const response = await uploadEventBanner(file);
      const uploadedImageUrl = response?.data?.imageUrl || "";

      if (!uploadedImageUrl) {
        throw new Error("Banner upload did not return an image URL.");
      }

      setForm((prev) => ({
        ...prev,
        banner_image: uploadedImageUrl,
      }));
    } catch (err) {
      setBannerUploadError(
        err?.response?.data?.message || "Failed to upload banner image.",
      );
    } finally {
      setBannerUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateRequired();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (form.date && form.date < todayDate) {
      setError("Date cannot be earlier than today.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: (form.slug || createSlugFromTitle(form.title)).trim(),
        short_description: form.short_description.trim(),
        description: form.description.trim(),
        venue_name: form.venue_name.trim(),
        city: form.city.trim(),
        category: form.category.trim(),
        banner_image: form.banner_image.trim(),
        organizer_id: form.organizer_id.trim(),
        organizer_contact_email: form.organizer_contact_email.trim(),
      };

      await runEventActionToast({
        action: () => createEvent(payload),
        messages: {
          loading: "Creating event and sending notifications...",
          success: "Event created successfully. Redirecting...",
          errorFallback: "Failed to create event. Please try again.",
        },
        onSuccess: () => {
          setForm(initialForm);
          setBannerUploadError("");
          window.setTimeout(() => {
            navigate("/dashboard/events");
          }, 1000);
        },
      });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("[AddEventPage] createEvent failed", {
          message: err?.message,
          code: err?.code,
          response: err?.response,
          request: err?.request,
        });
      }

      setError(
        getApiErrorMessage(err, "Failed to create event. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl gap-8 mx-auto add-event-shell">
      <section className="card add-event-hero p-7">
        <p className="add-event-eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
          Events
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-900">
          Add new event
        </h1>
        <p className="max-w-2xl mt-2 text-sm leading-6 text-ink-500">
          Create and save a new event with its details, schedule, and venue
          information.
        </p>
      </section>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="p-6 card add-event-section sm:p-7">
          <div className="mb-5 add-event-section__header">
            <p className="add-event-section__eyebrow">Section 1</p>
            <h2 className="text-lg font-semibold text-ink-900">Event basics</h2>
            <p className="mt-1 text-sm text-ink-500">
              Define the main content and event details.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 form-field sm:col-span-2">
              <label
                htmlFor="title"
                className="text-xs font-semibold tracking-wide uppercase text-ink-500"
              >
                Title <span className="text-gold-700">*</span>
              </label>
              <input
                id="title"
                className="input"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2 form-field">
              <label className="text-xs font-semibold tracking-wide uppercase text-ink-500">
                Category <span className="text-gold-700">*</span>
              </label>
              <select
                className="input"
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

            <div className="space-y-2 form-field sm:col-span-2">
              <label
                htmlFor="short_description"
                className="text-xs font-semibold tracking-wide uppercase text-ink-500"
              >
                Short description
              </label>
              <input
                id="short_description"
                className="input"
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 form-field sm:col-span-2">
              <label
                htmlFor="description"
                className="text-xs font-semibold tracking-wide uppercase text-ink-500"
              >
                Description <span className="text-gold-700">*</span>
              </label>
              <textarea
                id="description"
                className="py-3 input min-h-32"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        <section className="p-6 card add-event-section sm:p-7">
          <div className="mb-5 add-event-section__header">
            <p className="add-event-section__eyebrow">Section 2</p>
            <h2 className="text-lg font-semibold text-ink-900">
              Schedule and location
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Add date, time, and venue information for attendees.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 form-field">
              <label
                htmlFor="date"
                className="text-xs font-semibold tracking-wide uppercase text-ink-500"
              >
                Date <span className="text-gold-700">*</span>
              </label>
              <input
                id="date"
                className="input"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={todayDate}
                required
              />
            </div>

            <div className="space-y-2 form-field">
              <label
                htmlFor="time"
                className="text-xs font-semibold tracking-wide uppercase text-ink-500"
              >
                Time <span className="text-gold-700">*</span>
              </label>
              <input
                id="time"
                className="input"
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2 form-field">
              <label
                htmlFor="venue_name"
                className="text-xs font-semibold tracking-wide uppercase text-ink-500"
              >
                Venue name <span className="text-gold-700">*</span>
              </label>
              <input
                id="venue_name"
                className="input"
                name="venue_name"
                value={form.venue_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2 form-field">
              <label
                htmlFor="city"
                className="text-xs font-semibold tracking-wide uppercase text-ink-500"
              >
                City <span className="text-gold-700">*</span>
              </label>
              <input
                id="city"
                className="input"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        <section className="p-6 card add-event-section sm:p-7">
          <div className="mb-5 add-event-section__header">
            <p className="add-event-section__eyebrow">Section 3</p>
            <h2 className="text-lg font-semibold text-ink-900">Media</h2>
            <p className="mt-1 text-sm text-ink-500">
              Upload a banner image to represent your event visually.
            </p>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="banner"
              className="text-xs font-semibold tracking-wide uppercase text-ink-500"
            >
              Banner image
            </label>

            <label
              htmlFor="banner"
              className="flex flex-col items-center justify-center gap-2 px-6 py-8 text-center transition border border-dashed cursor-pointer add-event-upload rounded-2xl border-ink-300 bg-ink-50 hover:border-ink-400 hover:bg-white"
            >
              <p className="text-sm font-semibold text-ink-700">
                {form.banner_image
                  ? "Replace banner image"
                  : "Upload banner image"}
              </p>
              <p className="text-xs text-ink-500">
                Click to choose an image file (JPG, PNG, WEBP).
              </p>
            </label>

            <input
              id="banner"
              className="sr-only"
              type="file"
              name="banner"
              accept="image/*"
              onChange={handleBannerFileChange}
            />

            {!bannerUploading && !bannerUploadError && !form.banner_image ? (
              <div className="px-4 py-3 text-xs border add-event-upload__state rounded-xl border-ink-200 bg-ink-50 text-ink-500">
                No image selected yet.
              </div>
            ) : null}

            {bannerUploading ? (
              <div className="px-4 py-3 text-xs border add-event-upload__state rounded-xl border-ink-200 bg-ink-50 text-ink-600">
                Uploading image...
              </div>
            ) : null}

            {bannerUploadError ? (
              <div className="px-4 py-3 text-xs border add-event-upload__state rounded-xl border-gold-200 bg-gold-50 text-gold-700">
                {bannerUploadError}
              </div>
            ) : null}

            {!bannerUploading && !bannerUploadError && bannerPreviewSrc ? (
              <div className="p-3 bg-white border add-event-preview rounded-2xl border-ink-200">
                <p className="mb-2 text-xs font-medium tracking-wide uppercase text-ink-500">
                  Uploaded image preview
                </p>
                <img
                  src={bannerPreviewSrc}
                  alt="Event banner preview"
                  className="object-cover w-full h-36 rounded-xl sm:h-48"
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="p-6 card add-event-section sm:p-7">
          <div className="mb-5 add-event-section__header">
            <p className="add-event-section__eyebrow">Section 4</p>
            <h2 className="text-lg font-semibold text-ink-900">
              Organizer details
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Organizer is auto-filled from the current account.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 form-field">
              <label className="text-xs font-semibold tracking-wide uppercase text-ink-500">
                Organizer
              </label>
              <div className="px-3 py-3 text-sm border add-event-account rounded-xl border-ink-200 bg-ink-50 text-ink-600">
                <p className="text-xs font-semibold tracking-wide uppercase text-ink-500">
                  Account linked
                </p>
                <p className="mt-1 text-sm text-ink-700">
                  Organizer is set automatically from the logged-in account.
                </p>
              </div>
              <input
                type="hidden"
                name="organizer_id"
                value={form.organizer_id}
                readOnly
              />
            </div>

            <div className="space-y-2 form-field">
              <label
                htmlFor="organizer_contact_email"
                className="text-xs font-semibold tracking-wide uppercase text-ink-500"
              >
                Organizer contact email
              </label>
              <input
                id="organizer_contact_email"
                className="input"
                type="email"
                name="organizer_contact_email"
                value={form.organizer_contact_email}
                onChange={handleChange}
              />
            </div>

            <div className="px-4 py-3 bg-white border sm:col-span-2 rounded-xl border-ink-200">
              <label className="inline-flex items-center gap-3 text-sm font-medium text-ink-700">
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
          </div>
        </section>

        {error ? (
          <div className="px-4 py-3 text-sm border rounded-xl border-gold-200 bg-gold-50 text-gold-700">
            {error}
          </div>
        ) : null}

        <section className="p-5 card add-event-submit sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-600">
              Review required fields before creating the event.
            </p>
            <button
              type="submit"
              className="btn btn-primary min-w-40"
              disabled={submitting || bannerUploading}
            >
              {submitting ? "Creating event..." : "Create event"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default AddEventPage;
