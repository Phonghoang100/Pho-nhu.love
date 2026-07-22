/* ============================================================
   Calendar helpers: download .ics + build a Google Calendar link.
   Uses window.WEDDING.date and .schedule from config.js.
   ============================================================ */
(function () {
  "use strict";
  const W = window.WEDDING || {};

  // Format a Date to iCal UTC: YYYYMMDDTHHMMSSZ
  function toICS(dt) {
    return dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }
  // Format for Google Calendar (same UTC basic format)
  function toGCal(dt) { return toICS(dt); }

  // Reception is the anchor event (6:00 PM ET on the wedding day).
  function receptionTimes() {
    const base = new Date(W.date); // ceremony start
    const start = new Date(base); start.setHours(18, 0, 0, 0);
    const end = new Date(base); end.setHours(23, 0, 0, 0);
    return { start, end };
  }

  const TITLE = `${W.groom} & ${W.bride} — Wedding Celebration`;
  const LOCATION = "Canton House, 2255 Pleasant Hill Rd, Duluth, GA 30096";
  const DESC =
    "Join us to celebrate the wedding of " + W.groom + " & " + W.bride + ". " +
    "Ceremonies begin in the morning; the reception follows at 6:00 PM at Canton House. " +
    "Dress code: " + (W.dressCode || "Elegant / Professional") + ".";

  function buildICS() {
    const { start, end } = receptionTimes();
    const uid = "phong-nhu-wedding-" + start.getTime() + "@wedding";
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Phong and Nhu Wedding//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + uid,
      "DTSTAMP:" + toICS(new Date()),
      "DTSTART:" + toICS(start),
      "DTEND:" + toICS(end),
      "SUMMARY:" + TITLE,
      "DESCRIPTION:" + DESC.replace(/,/g, "\\,"),
      "LOCATION:" + LOCATION.replace(/,/g, "\\,"),
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:" + TITLE,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    return lines.join("\r\n");
  }

  window.downloadICS = function () {
    const blob = new Blob([buildICS()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Phong-and-Nhu-Wedding.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  window.googleCalUrl = function () {
    const { start, end } = receptionTimes();
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: TITLE,
      dates: toGCal(start) + "/" + toGCal(end),
      details: DESC,
      location: LOCATION
    });
    return "https://calendar.google.com/calendar/render?" + p.toString();
  };
})();
