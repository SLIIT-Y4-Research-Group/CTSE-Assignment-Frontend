import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorState from "../../components/ErrorState.jsx";
import Loading from "../../components/Loading.jsx";
import { getEventById } from "../../api/eventService.js";
import { formatEventDate, formatEventTime } from "../../utils/dateTime.js";

const EventDetailsPage = () => {
  const { id } = useParams();
  const eventServiceBaseUrl = "http://localhost:3002";

  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bannerLoadFailed, setBannerLoadFailed] = useState(false);

  const loadEventDetails = useCallback(async () => {
    if (!id) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getEventById(id);
      const data =
        response?.data?.event || response?.data?.data || response?.data || null;
      setEventDetails(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load event details.");
      setEventDetails(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEventDetails();
  }, [loadEventDetails]);

  const resolveBannerUrl = (imagePath) => {
    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;

    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;
    return `${eventServiceBaseUrl}${normalizedPath}`;
  };

  const bannerPreviewUrl = resolveBannerUrl(eventDetails?.banner_image);

  useEffect(() => {
    setBannerLoadFailed(false);
  }, [bannerPreviewUrl]);

  if (loading) return <Loading label="Loading event details..." />;

  if (error) {
    return (
      <ErrorState
        message={error}
        action={
          <button
            type="button"
            className="btn btn-secondary w-fit"
            onClick={loadEventDetails}
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!eventDetails) {
    return (
      <div className="p-6 text-sm card text-ink-500">
        No event details available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 card">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
          Events
        </p>
        <h1 className="text-2xl font-semibold text-ink-900">
          {eventDetails.title || "Event details"}
        </h1>
        {eventDetails.short_description ? (
          <p className="mt-2 text-sm text-ink-500">
            {eventDetails.short_description}
          </p>
        ) : null}
      </div>

      {bannerPreviewUrl && !bannerLoadFailed ? (
        <div className="p-3 card">
          <img
            src={bannerPreviewUrl}
            alt={eventDetails.title || "Event banner"}
            className="object-cover w-full h-56 rounded-xl md:h-72"
            onError={() => setBannerLoadFailed(true)}
          />
        </div>
      ) : null}

      {bannerPreviewUrl && bannerLoadFailed ? (
        <div className="p-6 text-sm card text-ink-500">
          Banner image is not available right now.
        </div>
      ) : null}

      <div className="p-6 card">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-ink-500">Title</p>
            <p className="text-sm text-ink-800">{eventDetails.title || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Status</p>
            <p className="text-sm text-ink-800">{eventDetails.status || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Date</p>
            <p className="text-sm text-ink-800">
              {formatEventDate(eventDetails.date)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Time</p>
            <p className="text-sm text-ink-800">
              {formatEventTime(eventDetails.time)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Venue</p>
            <p className="text-sm text-ink-800">
              {eventDetails.venue_name || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">City</p>
            <p className="text-sm text-ink-800">{eventDetails.city || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-500">Category</p>
            <p className="text-sm text-ink-800">
              {eventDetails.category || "-"}
            </p>
          </div>
          {eventDetails.organizer_contact_email ? (
            <div>
              <p className="text-xs font-semibold text-ink-500">
                Organizer contact
              </p>
              <p className="text-sm text-ink-800">
                {eventDetails.organizer_contact_email}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold text-ink-500">Description</p>
          <p className="mt-2 text-sm whitespace-pre-line text-ink-700">
            {eventDetails.description || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
