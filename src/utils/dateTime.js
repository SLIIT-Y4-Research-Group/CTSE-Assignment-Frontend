export const formatEventDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatEventTime = (value) => {
  if (!value) return "-";

  const raw = String(value).trim();
  let parsedDate;

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(raw)) {
    const [hoursStr, minutesStr] = raw.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return "-";
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return "-";

    parsedDate = new Date();
    parsedDate.setHours(hours, minutes, 0, 0);
  } else {
    parsedDate = new Date(raw);
  }

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsedDate);
};
