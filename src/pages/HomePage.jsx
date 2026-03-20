import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Event Management System</p>
          <h1 className="text-4xl font-semibold text-ink-900">
            Discover live events, reserve seats, and manage everything in one place.
          </h1>
          <p className="text-base text-ink-600">
            EventHub makes it easy to explore upcoming events, secure tickets, and stay updated with organizers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-primary" to="/events">
              Browse events
            </Link>
            <Link className="btn btn-ghost" to="/tickets">
              View tickets
            </Link>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-ink-900">Today’s highlights</h3>
          <div className="mt-4 space-y-3">
            {[
              { title: "Tech Summit 2026", meta: "Main Hall • 9:00 AM" },
              { title: "Creators Meetup", meta: "Studio A • 1:30 PM" },
              { title: "Night Market Live", meta: "Open Grounds • 6:00 PM" }
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-ink-100 bg-ink-50 px-4 py-3">
                <p className="text-sm font-semibold text-ink-800">{item.title}</p>
                <p className="text-xs text-ink-500">{item.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Curated events", text: "See the most popular events across venues and teams." },
          { title: "Instant tickets", text: "Reserve seats in seconds with secure checkout." },
          { title: "Real-time updates", text: "Stay informed with schedule and venue alerts." }
        ].map((card) => (
          <div key={card.title} className="card p-6">
            <h3 className="text-lg font-semibold text-ink-900">{card.title}</h3>
            <p className="mt-2 text-sm text-ink-500">{card.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
