/* ============================================================
   Shared site behavior: nav, countdown, reveal, gallery,
   FAQ, footer year. Runs on every page.
   ============================================================ */
(function () {
  "use strict";
  const W = window.WEDDING || {};
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Fill couple/date placeholders ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    $$("[data-w]").forEach((el) => {
      const key = el.getAttribute("data-w");
      if (W[key] != null) el.textContent = W[key];
    });
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  });

  /* ---------- Nav: scrolled state + mobile toggle ---------- */
  const nav = $(".nav");
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = $(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => document.body.classList.toggle("menu-open"));
    $$(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("menu-open"))
    );
  }

  /* ---------- Countdown ---------- */
  const cd = $("#countdown");
  if (cd && W.date) {
    const target = new Date(W.date).getTime();
    const set = (id, v) => { const e = $("#" + id, cd); if (e) e.textContent = String(v).padStart(2, "0"); };
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        cd.innerHTML = '<p class="lede" style="margin:0">Today is the day. Welcome, with love.</p>';
        return true;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      set("cd-days", d); set("cd-hours", h); set("cd-mins", m); set("cd-secs", s);
      return false;
    };
    if (!tick()) {
      const iv = setInterval(() => { if (tick()) clearInterval(iv); }, 1000);
    }
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = $$("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Gallery lightbox ---------- */
  const gallery = $("#gallery");
  if (gallery) {
    const imgs = $$("img", gallery).map((i) => i.getAttribute("data-full") || i.src);
    let idx = 0;
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-nav lb-prev" aria-label="Previous">&#8249;</button>' +
      '<img alt="Gallery photo">' +
      '<button class="lb-nav lb-next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lb);
    const lbImg = $("img", lb);
    const show = (i) => { idx = (i + imgs.length) % imgs.length; lbImg.src = imgs[idx]; };
    const open = (i) => { show(i); lb.classList.add("open"); };
    const close = () => lb.classList.remove("open");
    $$("figure", gallery).forEach((f, i) => f.addEventListener("click", () => open(i)));
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lb-next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- FAQ accordion ---------- */
  $$(".faq-q").forEach((q) =>
    q.addEventListener("click", () => q.closest(".faq-item").classList.toggle("open"))
  );
})();
