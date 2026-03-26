import React from "react";
import { Link } from "react-router-dom";
import EventCardActionMenu from "./EventCardActionMenu.jsx";
import { formatEventDate, formatEventTime } from "../utils/dateTime.js";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "published":
      return "badge badge-success";
    case "draft":
      return "badge badge-draft";
    case "cancelled":
      return "badge badge-cancelled";
    default:
      return "badge badge-default";
  }
};

const formatStatusLabel = (status) => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const EventManagementCard = ({
  event,
  eventId,
  status,
  bannerUrl,
  showBanner,
  onBannerError,
  canManageEvents,
  activeAction,
  isActionRunning,
  onPublish,
  onCancel,
  onDelete,
  actionError,
}) => {
  const statusLabel = formatStatusLabel(status);

  return (
    <article className="event-manage-card">
      <div className="event-manage-card__banner">
        {showBanner ? (
          <img
            src={bannerUrl}
            alt={event.title || "Event banner"}
            className="h-full w-full object-cover"
            onError={onBannerError}
          />
        ) : (
          <div className="event-manage-card__placeholder">No banner image</div>
        )}
      </div>

      <div className="event-manage-card__content">
        <div className="flex items-start justify-between gap-3">
          <h3 className="event-manage-card__title">
            {event.title || "Untitled event"}
          </h3>
          <span className={getStatusBadgeClass(status)}>{statusLabel}</span>
        </div>

        <dl className="event-manage-card__meta-grid">
          <div>
            <dt className="event-manage-card__meta-label">Date</dt>
            <dd className="event-manage-card__meta-value">
              {formatEventDate(event.date)}
            </dd>
          </div>
          <div>
            <dt className="event-manage-card__meta-label">Time</dt>
            <dd className="event-manage-card__meta-value">
              {formatEventTime(event.time)}
            </dd>
          </div>
          <div>
            <dt className="event-manage-card__meta-label">Venue</dt>
            <dd className="event-manage-card__meta-value">
              {event.venue_name || "-"}
            </dd>
          </div>
          <div>
            <dt className="event-manage-card__meta-label">City</dt>
            <dd className="event-manage-card__meta-value">
              {event.city || "-"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="event-manage-card__meta-label">Category</dt>
            <dd className="event-manage-card__meta-value">
              {event.category || "-"}
            </dd>
          </div>
        </dl>

        <div className="event-manage-card__actions">
          <div className="event-manage-card__actions-main">
            <Link to={`/events/${eventId}`} className="btn btn-primary">
              View details
            </Link>

            {canManageEvents ? (
              <Link
                to={`/events/${eventId}/edit`}
                className="btn btn-secondary"
              >
                Edit
              </Link>
            ) : null}
          </div>

          {canManageEvents ? (
            <EventCardActionMenu disabled={isActionRunning || !eventId}>
              {status === "draft" ? (
                <button
                  type="button"
                  className="event-action-menu__item"
                  disabled={isActionRunning || !eventId}
                  onClick={onPublish}
                >
                  {activeAction === "publish" ? "Publishing..." : "Publish"}
                </button>
              ) : null}

              {status !== "cancelled" ? (
                <button
                  type="button"
                  className="event-action-menu__item"
                  disabled={isActionRunning || !eventId}
                  onClick={onCancel}
                >
                  {activeAction === "cancel" ? "Cancelling..." : "Cancel"}
                </button>
              ) : null}

              <button
                type="button"
                className="event-action-menu__item event-action-menu__item-danger"
                disabled={isActionRunning || !eventId}
                onClick={onDelete}
              >
                {activeAction === "delete" ? "Deleting..." : "Delete"}
              </button>
            </EventCardActionMenu>
          ) : null}
        </div>

        {actionError ? (
          <p className="event-manage-card__error">{actionError}</p>
        ) : null}
      </div>
    </article>
  );
};

export default EventManagementCard;
