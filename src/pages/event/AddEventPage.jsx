import React, { useEffect, useState } from "react";
import { createEvent, uploadEventBanner } from "../../api/eventService.js";
import { useAuth } from "../../auth/AuthContext.jsx";

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

const createSlugFromTitle = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const AddEventPage = () => {
  const { user } = useAuth();
  const eventServiceBaseUrl = "http://localhost:3002";
  const todayDate = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState(initialForm);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUploadError, setBannerUploadError] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    if (name === "slug") {
      setIsSlugManuallyEdited(true);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" && !isSlugManuallyEdited
        ? { slug: createSlugFromTitle(value) }
        : {}),
    }));
  };

  const validateRequired = () => {
    for (const field of requiredFields) {
      const value = form[field];
      if (typeof value === "string" && !value.trim()) {
        return `${fieldLabels[field]} is required.`;
      }
    }
    return "";
  };

  const handleBannerFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBannerUploadError("");
    setError("");
    setSuccessMessage("");
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
    setSuccessMessage("");

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
        slug: form.slug.trim(),
        short_description: form.short_description.trim(),
        description: form.description.trim(),
        venue_name: form.venue_name.trim(),
        city: form.city.trim(),
        category: form.category.trim(),
        banner_image: form.banner_image.trim(),
        organizer_id: form.organizer_id.trim(),
        organizer_contact_email: form.organizer_contact_email.trim(),
      };

      await createEvent(payload);
      setSuccessMessage("Event created successfully");
      setForm(initialForm);
      setIsSlugManuallyEdited(false);
      setBannerUploadError("");
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || "Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
          Events
        </p>
        <h1 className="text-2xl font-semibold text-ink-900">Add new event</h1>
        <p className="mt-2 text-sm text-ink-500">
          Create an event and let the backend keep its default draft status.
        </p>
      </div>

      <div className="card p-6">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-ink-600">
              Title *
            </label>
            <input
              className="input mt-2"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Slug *</label>
            <input
              className="input mt-2"
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
            <input
              className="input mt-2"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-ink-600">
              Short description
            </label>
            <input
              className="input mt-2"
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
              className="input mt-2 min-h-28"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">Date *</label>
            <input
              className="input mt-2"
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
              className="input mt-2"
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
              className="input mt-2"
              name="venue_name"
              value={form.venue_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">City *</label>
            <input
              className="input mt-2"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-ink-600">
              Banner image
            </label>
            {form.banner_image ? (
              <p className="mt-2 text-xs font-medium text-ink-600">
                Change image
              </p>
            ) : null}
            <input
              className="input mt-2"
              type="file"
              name="banner"
              accept="image/*"
              onChange={handleBannerFileChange}
            />
            <p className="mt-1 text-xs text-ink-500">
              Select an image to upload. Only image files are supported.
            </p>
            {!bannerUploading && !bannerUploadError && !form.banner_image ? (
              <div className="mt-3 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-xs text-ink-500">
                No image selected yet.
              </div>
            ) : null}
            {bannerUploading ? (
              <div className="mt-3 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-xs text-ink-600">
                Uploading image...
              </div>
            ) : null}
            {bannerUploadError ? (
              <div className="mt-3 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-xs text-gold-700">
                {bannerUploadError}
              </div>
            ) : null}
            {!bannerUploading && !bannerUploadError && bannerPreviewSrc ? (
              <div className="mt-3 rounded-xl border border-ink-200 bg-white p-3">
                <p className="mb-2 text-xs font-medium text-ink-600">
                  Uploaded image preview
                </p>
                <img
                  src={bannerPreviewSrc}
                  alt="Event banner preview"
                  className="h-32 w-full rounded-lg object-cover sm:h-40"
                />
              </div>
            ) : null}
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">
              Organizer
            </label>
            <p className="mt-2 text-xs text-ink-500">
              Organizer is set automatically from the logged-in account.
            </p>
            <input
              type="hidden"
              name="organizer_id"
              value={form.organizer_id}
              readOnly
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600">
              Organizer contact email
            </label>
            <input
              className="input mt-2"
              type="email"
              name="organizer_contact_email"
              value={form.organizer_contact_email}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="inline-flex items-center gap-3 text-sm text-ink-700">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-ink-300"
              />
              Mark as featured event
            </label>
          </div>

          {error ? (
            <div className="sm:col-span-2 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-700">
              {error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="sm:col-span-2 rounded-xl border border-mint-200 bg-mint-50 px-4 py-3 text-sm text-mint-700">
              {successMessage}
            </div>
          ) : null}

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || bannerUploading}
            >
              {submitting ? "Creating event..." : "Create event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;
