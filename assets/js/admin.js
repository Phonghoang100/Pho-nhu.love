/* ============================================================
   Admin dashboard: login (Supabase Auth) -> stats, table,
   search, filters, CSV export. Reads v_admin_rsvps.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const el = {
    notConfigured: $("#notConfigured"),
    gate: $("#gate"),
    dash: $("#dash"),
    loginForm: $("#loginForm"),
    email: $("#adminEmail"),
    password: $("#adminPassword"),
    loginBtn: $("#loginBtn"),
    loginMsg: $("#loginMsg"),
    logoutBtn: $("#logoutBtn"),
    refreshBtn: $("#refreshBtn"),
    exportBtn: $("#exportBtn"),
    search: $("#adminSearch"),
    filterStatus: $("#filterStatus"),
    tbody: $("#tbody"),
    rowCount: $("#rowCount"),
    stats: {
      accepted: $("#stAccepted"), declined: $("#stDeclined"), total: $("#stTotal"),
      guests: $("#stGuests"), adults: $("#stAdults"), children: $("#stChildren"),
      plusones: $("#stPlusOnes"), dietary: $("#stDietary"),
    },
  };

  let rows = [];
  let sortKey = "full_name";
  let sortDir = 1;

  function start() {
    if (!window.sbConfigured || !window.sbConfigured()) {
      el.notConfigured.classList.remove("hidden");
      el.gate.classList.add("hidden");
      return;
    }
    wire();
    window.sb.auth.getSession().then(({ data }) => {
      if (data.session) enterDashboard(); else showGate();
    });
    window.sb.auth.onAuthStateChange((_e, session) => {
      if (session) enterDashboard(); else showGate();
    });
  }

  function showGate() { el.gate.classList.remove("hidden"); el.dash.classList.add("hidden"); }
  function alert(node, type, msg) {
    if (!msg) { node.className = "hidden"; return; }
    node.className = "alert alert-" + type; node.innerHTML = msg;
  }

  function wire() {
    el.loginForm.addEventListener("submit", onLogin);
    el.logoutBtn.addEventListener("click", () => window.sb.auth.signOut());
    el.refreshBtn.addEventListener("click", load);
    el.exportBtn.addEventListener("click", exportCSV);
    el.search.addEventListener("input", render);
    el.filterStatus.addEventListener("change", render);
    $$("th[data-key]").forEach((th) =>
      th.addEventListener("click", () => {
        const k = th.dataset.key;
        if (sortKey === k) sortDir *= -1; else { sortKey = k; sortDir = 1; }
        render();
      })
    );
  }

  async function onLogin(e) {
    e.preventDefault();
    alert(el.loginMsg, "info", "");
    el.loginBtn.disabled = true;
    const label = el.loginBtn.innerHTML;
    el.loginBtn.innerHTML = '<span class="spinner"></span>';
    try {
      const { error } = await window.sb.auth.signInWithPassword({
        email: el.email.value.trim(), password: el.password.value,
      });
      if (error) throw error;
    } catch (err) {
      alert(el.loginMsg, "err", "Sign-in failed: " + (err.message || err));
    } finally {
      el.loginBtn.disabled = false;
      el.loginBtn.innerHTML = label;
    }
  }

  async function enterDashboard() {
    el.gate.classList.add("hidden");
    el.dash.classList.remove("hidden");
    await load();
  }

  async function load() {
    el.tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem"><span class="spinner dark"></span></td></tr>';
    const { data, error } = await window.sb
      .from("v_admin_rsvps")
      .select("*")
      .order("full_name", { ascending: true });
    if (error) {
      el.tbody.innerHTML = '<tr><td colspan="8" style="padding:1.5rem;color:#8a4b2e">Error loading data: ' + error.message + '</td></tr>';
      return;
    }
    rows = data || [];
    renderStats();
    render();
  }

  function renderStats() {
    const s = { accepted: 0, declined: 0, adults: 0, children: 0, plusones: 0, dietary: 0 };
    rows.forEach((r) => {
      if (r.status === "accepted") {
        s.accepted++;
        s.adults += 1 + (r.plus_one ? 1 : 0);
        s.children += r.children || 0;
        if (r.plus_one) s.plusones++;
      } else if (r.status === "declined") {
        s.declined++;
      }
      if (r.dietary && r.dietary.trim()) s.dietary++;
    });
    el.stats.accepted.textContent = s.accepted;
    el.stats.declined.textContent = s.declined;
    el.stats.total.textContent = rows.length;
    el.stats.adults.textContent = s.adults;
    el.stats.children.textContent = s.children;
    el.stats.plusones.textContent = s.plusones;
    el.stats.guests.textContent = s.adults + s.children;
    el.stats.dietary.textContent = s.dietary;
  }

  function filtered() {
    const q = el.search.value.trim().toLowerCase();
    const st = el.filterStatus.value;
    let out = rows.filter((r) => {
      if (st !== "all" && r.status !== st) return false;
      if (!q) return true;
      return [r.full_name, r.email, r.phone, r.message, r.dietary, r.plus_one_name, r.children_names]
        .some((v) => v && String(v).toLowerCase().includes(q));
    });
    out.sort((a, b) => {
      let x = a[sortKey], y = b[sortKey];
      if (typeof x === "number" && typeof y === "number") return (x - y) * sortDir;
      return String(x || "").localeCompare(String(y || "")) * sortDir;
    });
    return out;
  }

  function render() {
    const data = filtered();
    el.rowCount.textContent = data.length + " of " + rows.length + " responses";
    if (!data.length) {
      el.tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--muted)">No matching responses yet.</td></tr>';
      return;
    }
    el.tbody.innerHTML = data.map((r) =>
      "<tr>" +
      "<td><strong>" + esc(r.full_name) + "</strong></td>" +
      "<td><span class='badge " + r.status + "'>" + r.status + "</span></td>" +
      "<td>" + (r.plus_one ? "Yes" + (r.plus_one_name ? "<br><span class='r-sub'>" + esc(r.plus_one_name) + "</span>" : "") : "—") + "</td>" +
      "<td>" + (r.children || 0) + (r.children_names ? "<br><span class='r-sub'>" + esc(r.children_names) + "</span>" : "") + "</td>" +
      "<td class='wrap'>" + (r.dietary ? esc(r.dietary) : "—") + "</td>" +
      "<td class='wrap'>" + (r.message ? esc(r.message) : "—") + "</td>" +
      "<td>" + (r.email ? esc(r.email) : "") + (r.phone ? "<br><span class='r-sub'>" + esc(r.phone) + "</span>" : "") + "</td>" +
      "<td class='r-sub'>" + (r.updated_at ? new Date(r.updated_at).toLocaleDateString() : "—") + "</td>" +
      "</tr>"
    ).join("");
  }

  function exportCSV() {
    const cols = ["full_name","status","plus_one","plus_one_name","children","children_names",
                  "dietary","message","phone","email","updated_at"];
    const head = cols.join(",");
    const body = filtered().map((r) => cols.map((c) => csvCell(r[c])).join(",")).join("\n");
    const csv = head + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-rsvps-" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function csvCell(v) {
    if (v == null) return "";
    if (v === true) return "Yes";
    if (v === false) return "No";
    const s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  if (window.__sbReady) start();
  else window.addEventListener("sb:ready", start);
})();
