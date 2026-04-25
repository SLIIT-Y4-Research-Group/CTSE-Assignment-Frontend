import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const highlights = [
    {
      title: "Tech Summit 2026",
      meta: "Apr 18, 2026 • Colombo",
      tag: "Featured",
    },
    {
      title: "Design Systems Forum",
      meta: "May 03, 2026 • Kandy",
      tag: "New",
    },
    {
      title: "Growth Leaders Meetup",
      meta: "May 22, 2026 • Galle",
      tag: "Popular",
    },
  ];

  const stats = [
    { label: "Events listed", value: "1,200+" },
    { label: "Tickets booked", value: "75,000+" },
    { label: "Active organizers", value: "420+" },
    { label: "Cities covered", value: "38" },
  ];

  const features = [
    {
      title: "Discover curated events",
      text: "Explore high-quality experiences by city, category, and date with confidence.",
    },
    {
      title: "Reserve tickets quickly",
      text: "Book seats in a few clicks with a smooth checkout flow built for speed.",
    },
    {
      title: "Manage events with organizer tools",
      text: "Create, edit, publish, and track your events from one central dashboard.",
    },
    {
      title: "Stay updated in real time",
      text: "Get timely changes for schedules, venues, and availability across events.",
    },
  ];

  const featuredEvents = [
    {
      title: "Tech Summit 2026",
      date: "Apr 18, 2026",
      location: "Colombo",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Creative Product Conference",
      date: "May 09, 2026",
      location: "Kandy",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Startup Network Night",
      date: "May 26, 2026",
      location: "Galle",
      image:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <div className="space-y-12 lg:space-y-16">
      <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-400">
            Event management platform
          </p>
          
          <p className="max-w-xl text-base leading-7 text-ink-600">
            EventHub helps attendees explore upcoming events and gives
            organizers the tools to publish, manage, and grow events with
            confidence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-primary" to="/events">
              Explore events
            </Link>
            <Link className="btn btn-secondary" to="/dashboard/events/add">
              For organizers
            </Link>
          </div>
        </div>
        <div className="card overflow-hidden border-ink-200 bg-gradient-to-b from-white to-ink-50/70 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
                Platform preview
              </p>
              <h3 className="mt-1 text-xl font-semibold text-ink-900">
                Trending this week
              </h3>
            </div>
            <span className="rounded-full border border-mint-200 bg-mint-50 px-3 py-1 text-xs font-semibold text-mint-700">
              Live data
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-ink-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-ink-500">{item.meta}</p>
                  </div>
                  <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-600">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="card border-ink-200 bg-white p-5">
            <p className="text-2xl font-semibold text-ink-900">{item.value}</p>
            <p className="mt-1 text-sm text-ink-500">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
            Platform capabilities
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-ink-900">
            Built for practical event operations
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((card) => (
            <div key={card.title} className="card border-ink-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-ink-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-500">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card border-ink-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
            For attendees
          </p>
          <h3 className="mt-2 text-xl font-semibold text-ink-900">
            Find the right experience faster
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            Discover events by category and city, secure your tickets quickly,
            and keep all bookings in one organized place.
          </p>
          <Link className="btn btn-secondary mt-4" to="/events">
            Browse events
          </Link>
        </div>

        <div className="card border-ink-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
            For organizers
          </p>
          <h3 className="mt-2 text-xl font-semibold text-ink-900">
            Launch and manage events with confidence
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            Create listings, manage updates, and control event publishing from a
            single dashboard designed for operational clarity.
          </p>
          <Link className="btn btn-secondary mt-4" to="/dashboard/events/add">
            Open organizer tools
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
              Featured events
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-ink-900">
              Explore what is happening next
            </h2>
          </div>
          <Link className="btn btn-secondary" to="/events">
            View all events
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredEvents.map((event) => (
            <div
              key={event.title}
              className="card overflow-hidden border-ink-200 bg-white"
            >
              <div className="h-40 w-full overflow-hidden bg-ink-100">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-base font-semibold text-ink-900">
                  {event.title}
                </h3>
                <p className="text-sm text-ink-500">{event.date}</p>
                <p className="text-sm text-ink-500">{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
