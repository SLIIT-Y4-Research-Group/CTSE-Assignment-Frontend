import React from "react";

const EventsPage = () => {
  const events = [
    {
      title: "Tech Summit 2026",
      date: "Mar 28, 2026",
      location: "Colombo Conference Center",
      status: "Registration open"
    },
    {
      title: "Wellness Expo",
      date: "Apr 02, 2026",
      location: "Harbor Hall",
      status: "Limited seats"
    },
    {
      title: "Design Futures",
      date: "Apr 12, 2026",
      location: "City Arts Theater",
      status: "Tickets live"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Events</p>
        <h1 className="text-2xl font-semibold text-ink-900">Upcoming events</h1>
        <p className="mt-2 text-sm text-ink-500">
          Explore curated events and secure tickets before they sell out.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.title} className="card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">{event.date}</p>
            <h3 className="mt-3 text-lg font-semibold text-ink-900">{event.title}</h3>
            <p className="mt-2 text-sm text-ink-500">{event.location}</p>
            <span className="mt-4 inline-flex w-fit rounded-full bg-mint-50 px-3 py-1 text-xs font-semibold text-mint-700">
              {event.status}
            </span>
            <button className="btn btn-ghost mt-4 w-full">View details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
