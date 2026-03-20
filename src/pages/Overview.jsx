import React from "react";

const OverviewPage = () => {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Dashboard</p>
        <h3 className="text-xl font-semibold text-ink-900">Your workspace</h3>
        <p className="mt-2 text-sm text-ink-500">
          This is a placeholder dashboard for non-admin users. Add event-specific widgets here.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Upcoming Events</p>
          <p className="mt-4 text-3xl font-semibold text-ink-900">08</p>
          <p className="mt-2 text-sm text-ink-500">Events this month</p>
        </div>
        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Active Tasks</p>
          <p className="mt-4 text-3xl font-semibold text-ink-900">14</p>
          <p className="mt-2 text-sm text-ink-500">Assigned to you</p>
        </div>
        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Team Messages</p>
          <p className="mt-4 text-3xl font-semibold text-ink-900">03</p>
          <p className="mt-2 text-sm text-ink-500">New updates</p>
        </div>
      </div>
      <div className="card p-6">
        <h4 className="text-lg font-semibold text-ink-900">Today at a glance</h4>
        <div className="mt-4 grid gap-3">
          <div className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm">
            <span className="text-ink-600">Venue walkthrough scheduled</span>
            <span className="font-semibold text-ink-700">10:30 AM</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm">
            <span className="text-ink-600">AV checklist review</span>
            <span className="font-semibold text-ink-700">1:00 PM</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm">
            <span className="text-ink-600">Vendor confirmation call</span>
            <span className="font-semibold text-ink-700">4:45 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
