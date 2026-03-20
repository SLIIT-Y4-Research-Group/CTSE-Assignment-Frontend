import React from "react";

const TicketsPage = () => {
  const tickets = [
    {
      code: "EVT-10024",
      event: "Tech Summit 2026",
      seat: "Hall A • Seat 24",
      status: "Confirmed"
    },
    {
      code: "EVT-10067",
      event: "Wellness Expo",
      seat: "Balcony • Seat 11",
      status: "Pending"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Tickets</p>
        <h1 className="text-2xl font-semibold text-ink-900">Your ticket wallet</h1>
        <p className="mt-2 text-sm text-ink-500">Log in to access purchase history and QR codes.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {tickets.map((ticket) => (
          <div key={ticket.code} className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink-400">{ticket.code}</p>
                <h3 className="mt-2 text-lg font-semibold text-ink-900">{ticket.event}</h3>
                <p className="mt-2 text-sm text-ink-500">{ticket.seat}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  ticket.status === "Confirmed" ? "bg-mint-50 text-mint-700" : "bg-gold-50 text-gold-700"
                }`}
              >
                {ticket.status}
              </span>
            </div>
            <button className="btn btn-ghost mt-4 w-full">View ticket</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;
