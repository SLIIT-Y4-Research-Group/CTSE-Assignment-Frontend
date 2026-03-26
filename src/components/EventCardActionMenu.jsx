import React, { useEffect, useRef, useState } from "react";

const EventCardActionMenu = ({ children, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) return;
      setOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="event-action-menu" ref={menuRef}>
      <button
        type="button"
        className="event-action-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More actions"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span className="sr-only">More actions</span>
        <svg
          viewBox="0 0 24 24"
          className="event-action-menu__icon"
          aria-hidden="true"
        >
          <circle cx="5" cy="12" r="2" fill="currentColor" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <circle cx="19" cy="12" r="2" fill="currentColor" />
        </svg>
      </button>

      {open ? (
        <div
          className="event-action-menu__panel"
          role="menu"
          aria-label="Card actions"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default EventCardActionMenu;
