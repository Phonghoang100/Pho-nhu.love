/* ============================================================
   SITE CONFIGURATION
   Edit the values below. This file is safe to commit to GitHub —
   the Supabase "anon" key is a *public* key by design and is
   protected by Row Level Security (see /db/schema.sql).
   ============================================================ */

window.WEDDING = {
  /* ---- Couple & event ---- */
  groom: "Phong",
  bride: "Nhu",
  // Full names (used in a few places / SEO)
  groomFull: "Phong Hoang",
  brideFull: "Nhu",

  // ISO datetime of the CEREMONY START (used for the countdown).
  // Dec 20, 2026, 7:00 AM Eastern (-05:00, EST).
  date: "2026-12-20T07:00:00-05:00",
  dateDisplay: "December 20, 2026",
  dateLong: "Sunday, the Twentieth of December, Two Thousand Twenty-Six",

  city: "Duluth, Georgia",
  dressCode: "Elegant / Professional",

  // Contact shown in portal / footer (optional)
  contactEmail: "",
  contactPhone: "",

  /* ---- Supabase ---- */
  // 1) Create a project at https://supabase.com
  // 2) Settings → API → copy the Project URL and the "anon public" key
  supabaseUrl: "https://YOUR-PROJECT-ref.supabase.co",
  supabaseAnonKey: "YOUR-ANON-PUBLIC-KEY",

  /* ---- Schedule (day-of timeline) ---- */
  schedule: [
    {
      time: "7:00 – 8:30 AM", start: "07:00", end: "08:30",
      title: "Bride Tea Ceremony",
      address: "2450 Bretdale Rd, Duluth, GA 30096",
      maps: "https://www.google.com/maps/search/?api=1&query=2450+Bretdale+Rd+Duluth+GA+30096",
      note: ""
    },
    {
      time: "8:30 – 9:00 AM", start: "08:30", end: "09:00",
      title: "Travel",
      address: "Duluth → Lawrenceville",
      maps: "https://www.google.com/maps/dir/2450+Bretdale+Rd+Duluth+GA+30096/1351+Arlene+Valley+Ln+Lawrenceville+GA+30043",
      note: "Approximately a 25-minute drive between homes."
    },
    {
      time: "9:00 AM – 12:00 PM", start: "09:00", end: "12:00",
      title: "Groom Tea Ceremony",
      address: "1351 Arlene Valley Ln, Lawrenceville, GA 30043",
      maps: "https://www.google.com/maps/search/?api=1&query=1351+Arlene+Valley+Ln+Lawrenceville+GA+30043",
      note: ""
    },
    {
      time: "12:00 – 5:00 PM", start: "12:00", end: "17:00",
      title: "Free Time",
      address: "",
      maps: "",
      note: "Guests may relax at the groom's house or return home to prepare for the reception."
    },
    {
      time: "6:00 – 11:00 PM", start: "18:00", end: "23:00",
      title: "Wedding Reception",
      address: "Canton House · 2255 Pleasant Hill Rd, Duluth, GA 30096",
      maps: "https://www.google.com/maps/search/?api=1&query=Canton+House+2255+Pleasant+Hill+Rd+Duluth+GA+30096",
      note: "Dinner, toasts, and dancing."
    },
    {
      time: "11:00 PM – 12:00 AM", start: "23:00", end: "23:59",
      title: "Farewell",
      address: "Canton House · 2255 Pleasant Hill Rd, Duluth, GA 30096",
      maps: "https://www.google.com/maps/search/?api=1&query=Canton+House+2255+Pleasant+Hill+Rd+Duluth+GA+30096",
      note: "A warm send-off to close the celebration."
    }
  ]
};
