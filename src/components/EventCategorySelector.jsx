import React from "react";

export const EVENT_CATEGORIES = ["Concerts", "Theatre", "Family"];

const EventCategorySelector = ({ value, onChange }) => {
  return (
    <div
      className="flex w-full gap-8 border-b border-ink-200"
      role="tablist"
      aria-label="Event category"
    >
      {EVENT_CATEGORIES.map((category) => {
        const isActive = value === category;

        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`relative pb-3 text-base font-semibold transition sm:text-[1.75rem] ${
              isActive ? "text-[#2f3f8f]" : "text-ink-400 hover:text-ink-600"
            }`}
            onClick={() => onChange(category)}
          >
            {category}
            <span
              className={`absolute inset-x-0 bottom-[-2px] h-1 rounded-full transition ${
                isActive ? "bg-[#f97316]" : "bg-transparent"
              }`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
};

export default EventCategorySelector;
