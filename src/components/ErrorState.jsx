import React from "react";

const ErrorState = ({ message, action }) => {
  return (
    <div className="card flex flex-col gap-3 p-6 text-ink-700">
      <div className="text-sm font-semibold uppercase tracking-wide text-gold-600">Something went wrong</div>
      <p className="text-sm">{message || "Please try again in a moment."}</p>
      {action}
    </div>
  );
};

export default ErrorState;
