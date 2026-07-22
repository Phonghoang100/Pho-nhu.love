/* ============================================================
   Open RSVP: one form. Guest enters their name + details and
   submits. Re-submitting with the same name updates the entry.
   Talks to the Supabase RPC submit_rsvp.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const el = {
    notConfigured: $("#notConfigured"),
    app: $("#rsvpApp"),
    formStep: $("#formStep"),
    rsvpForm: $("#rsvpForm"),
    fullName: $("#fullName"),
    choiceAccept: $("#choiceAccept"),
    choiceDecline: $("#choiceDecline"),
    attendingBlock: $("#attendingBlock"),
    plusOne: $("#plusOne"),
    plusOneNameBlock: $("#plusOneNameBlock"),
    plusOneName: $("#plusOneName"),
    bringKids: $("#bringKids"),
    childrenBlock: $("#childrenBlock"),
    children: $("#children"),
    childrenNames: $("#childrenNames"),
    dietary: $("#dietary"),
    message: $("#message"),
    phone: $("#phone"),
    email: $("#email"),
    saveBtn: $("#saveBtn"),
    formMsg: $("#formMsg"),
    successStep: $("#successStep"),
    successTitle: $("#successTitle"),
    successText: $("#successText"),
    editBtn: $("#editBtn"),
  };

  function show(step) {
    [el.formStep, el.successStep].forEach((s) => s && s.classList.add("hidden"));
    if (step) step.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function alert(node, type, msg) {
    if (!msg) { node.className = "hidden"; node.textContent = ""; return; }
    node.className = "alert alert-" + type;
    node.innerHTML = msg;
  }

  function start() {
    if (!window.sbConfigured || !window.sbConfigured()) {
      el.notConfigured.classList.remove("hidden");
      el.app.classList.add("hidden");
      return;
    }
    el.notConfigured.classList.add("hidden");
    el.app.classList.remove("hidden");
    wire();
    show(el.formStep);
  }

  function wire() {
    // steppers
    $$(".stepper").forEach((st) => {
      const input = $("input", st);
      $$("button", st).forEach((b) =>
        b.addEventListener("click", () => {
          const step = b.dataset.step === "-" ? -1 : 1;
          const min = +input.min || 0, max = +input.max || 99;
          input.value = Math.max(min, Math.min(max, (+input.value || 0) + step));
        })
      );
    });

    [el.choiceAccept, el.choiceDecline].forEach((r) => r.addEventListener("change", syncStatus));
    el.plusOne.addEventListener("change", () =>
      el.plusOneNameBlock.classList.toggle("hidden", !el.plusOne.checked)
    );
    el.bringKids.addEventListener("change", () => {
      el.childrenBlock.classList.toggle("hidden", !el.bringKids.checked);
      if (el.bringKids.checked && (+el.children.value || 0) < 1) el.children.value = 1;
    });

    el.rsvpForm.addEventListener("submit", onSave);
    el.editBtn.addEventListener("click", () => show(el.formStep));
  }

  function syncStatus() {
    el.attendingBlock.classList.toggle("hidden", !el.choiceAccept.checked);
  }

  async function onSave(e) {
    e.preventDefault();
    alert(el.formMsg, "info", "");

    if (!el.fullName.value.trim()) {
      alert(el.formMsg, "err", "Please enter your name.");
      el.fullName.focus();
      return;
    }
    if (!el.choiceAccept.checked && !el.choiceDecline.checked) {
      alert(el.formMsg, "err", "Please let us know if you'll be attending.");
      return;
    }
    const status = el.choiceAccept.checked ? "accepted" : "declined";
    const bringingKids = el.bringKids.checked && status === "accepted";

    el.saveBtn.disabled = true;
    const label = el.saveBtn.innerHTML;
    el.saveBtn.innerHTML = '<span class="spinner"></span> Saving…';
    try {
      const payload = {
        p_full_name: el.fullName.value,
        p_status: status,
        p_plus_one: status === "accepted" && el.plusOne.checked,
        p_plus_one_name: el.plusOneName.value,
        p_children: bringingKids ? (+el.children.value || 0) : 0,
        p_children_names: bringingKids ? el.childrenNames.value : "",
        p_dietary: el.dietary.value,
        p_message: el.message.value,
        p_phone: el.phone.value,
        p_email: el.email.value,
      };
      const { data, error } = await window.sb.rpc("submit_rsvp", payload);
      if (error) throw error;

      if (status === "accepted") {
        const guests = 1 + (data.plus_one ? 1 : 0) + (data.children || 0);
        el.successTitle.textContent = "We can't wait to celebrate with you!";
        el.successText.innerHTML =
          "Your RSVP is confirmed for <strong>" + guests + "</strong> " +
          (guests === 1 ? "guest" : "guests") + ". Add the day to your calendar from the " +
          '<a href="./portal.html">Guest Portal</a>. Need to change something? Edit below or submit again with the same name.';
      } else {
        el.successTitle.textContent = "Thank you for letting us know.";
        el.successText.innerHTML =
          "We're sorry you can't make it, but we're grateful you responded. " +
          "If your plans change, just submit again with the same name.";
      }
      show(el.successStep);
    } catch (err) {
      alert(el.formMsg, "err", "We couldn't save your RSVP: " + (err.message || err));
    } finally {
      el.saveBtn.disabled = false;
      el.saveBtn.innerHTML = label;
    }
  }

  if (window.__sbReady) start();
  else window.addEventListener("sb:ready", start);
})();
