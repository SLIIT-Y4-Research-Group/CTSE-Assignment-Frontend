import React from "react";

const Loading = ({ label = "Loading" }) => {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-soft">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink-200 border-t-ink-700"></div>
        <span className="text-sm font-medium text-ink-700">{label}</span>
      </div>
    </div>
  );
};

export default Loading;
