/* Terry's Barber Shop — small progressive-enhancement script.
   No dependencies. Everything degrades gracefully if JS is off. */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close the menu after tapping a link
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Footer year ---- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Shop hours (America/Chicago) ----
     Open Tue–Thu 05:00–16:00, Fri 05:00–15:00 (24h). Computes the shop's
     local day & time so the status is correct no matter where the visitor is.
     Keyed by weekday: Sun=0 ... Sat=6. */
  var SCHEDULE = {
    2: { open: 5, close: 16 }, // Tuesday
    3: { open: 5, close: 16 }, // Wednesday
    4: { open: 5, close: 16 }, // Thursday
    5: { open: 5, close: 15 }  // Friday
  };

  function fmtHour(h) {
    var ampm = h >= 12 ? "p.m." : "a.m.";
    var h12 = h % 12 || 12;
    return h12 + ":00 " + ampm;
  }

  function shopNow() {
    // Get current time in the shop's timezone via Intl, fall back to local.
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        weekday: "short", hour: "numeric", minute: "numeric", hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var hour = parseInt(map.hour, 10);
      if (hour === 24) hour = 0; // some engines emit "24" at midnight
      return { day: dayMap[map.weekday], hour: hour, minute: parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), hour: d.getHours(), minute: d.getMinutes() };
    }
  }

  function computeStatus() {
    var now = shopNow();
    var today = SCHEDULE[now.day];
    var open = today && now.hour >= today.open && now.hour < today.close;
    var label;
    if (open) {
      label = "Open now &middot; until " + fmtHour(today.close);
    } else if (today && now.hour < today.open) {
      label = "Closed &middot; opens today at " + fmtHour(today.open);
    } else {
      label = "Closed &middot; open Tue–Fri, 5am";
    }
    return { open: open, label: label, day: now.day };
  }

  var status = computeStatus();

  // Render status pills
  document.querySelectorAll("[data-open-status]").forEach(function (el) {
    el.hidden = false;
    el.innerHTML =
      '<span class="status-pill ' + (status.open ? "status-open" : "status-closed") + '">' +
      status.label + "</span>";
  });

  // Highlight today's row in the hours table
  var todayRow = document.querySelector('.hours-table tr[data-day="' + status.day + '"]');
  if (todayRow) todayRow.classList.add("is-today");
})();
