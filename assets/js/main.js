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
     Open Tue–Fri 07:00–17:00. Computes the shop's local day & time so the
     status is correct no matter where the visitor is. */
  var OPEN_DAYS = { 2: 1, 3: 1, 4: 1, 5: 1 }; // Tue=2 ... Fri=5
  var OPEN_HOUR = 7, CLOSE_HOUR = 17;

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
    var open = OPEN_DAYS[now.day] && now.hour >= OPEN_HOUR && now.hour < CLOSE_HOUR;
    var label;
    if (open) {
      label = "Open now &middot; until 5:00 p.m.";
    } else if (OPEN_DAYS[now.day] && now.hour < OPEN_HOUR) {
      label = "Closed &middot; opens today at 7:00 a.m.";
    } else {
      label = "Closed &middot; open Tue–Fri, 7am–5pm";
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
